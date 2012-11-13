Pica.module('Controllers', (Controllers, App, Backbone, Marionette, $, _) ->

  class Controllers.MainRouter extends Backbone.Router
    routes:
      "new_polygon": "newPolygon"
      "analysis/:analysis_id/polygon/:id": "polygonShow"
      ".*": "start"

    initialize: (options) ->
      @controller = options.controller


    polygonShow: (analysis_id, id) =>
      @controller.showPolygon(id)

  # Extended controller that adds concept of action events bindings,
  # which are event bindings that are only valid for the duration
  # of an action
  class Controllers.EventTransitionController extends Marionette.Controller
    # Add binding which is only valid for action duration.
    transitionToActionOn: (event, action) ->
      @actionEventBindings ||= []
      @actionEventBindings.push(event: event, action: action)
      Pica.vent.on(event, () =>
        @transitionToAction(action, arguments)
      )

    clearActionEventBindings: () ->
      _.each @actionEventBindings, (binding) ->
        Pica.vent.off(binding.event, binding.action)

    transitionToAction: (action, eventArguments) ->
      @clearActionEventBindings()
      action.apply(@, eventArguments)

  class Controllers.MainController extends Controllers.EventTransitionController
    initialize: (options) ->
      @map = L.map('map').setView([0, 0], 2)
      tileLayerUrl = 'http://carbon-tool.cartodb.com/tiles/ne_countries/{z}/{x}/{y}.png'
      tileLayer = new L.TileLayer(tileLayerUrl, {
        maxZoom: 18
      }).addTo @map

    start: () ->
      @drawNewOrLoad()

    drawNewOrLoad: () ->
      Pica.sidePanel.show(new Pica.Views.NewOrLoadView(new Pica.Models.Polygon(), @map))
      
      @transitionToActionOn('userRequest:drawNewArea', @drawNewPolygon)
      Pica.vent.on('userRequest:loadArea', () -> alert('Implement me'))

    drawNewPolygon: () ->
      Pica.sidePanel.show(new Pica.Views.NewPolygonView(new Pica.Models.Polygon(), @map))

      @transitionToActionOn('polygon:Created', @showPolygon)

    showPolygon: (polygon) ->
      Pica.router.navigate("/analysis/#{polygon.get('analysis_id')}/polygon/#{polygon.get('id')}")

      @layerStatList = new Pica.Collections.CalculatedLayerStatList(
        polygonId: polygon.get('id')
      )
      @layerStatList.fetch(
        success: (collection, response, options) =>
          @calculatedLayerStatsView = new Pica.Views.CalculatedLayerStatsView(
            collection: collection
          )
          Pica.sidePanel.show(@calculatedLayerStatsView)
        error: () =>
          console.log 'fetch failed'
      )


  # App entry point
  Controllers.addInitializer ->
    controller = new Controllers.MainController()
    Pica.router = new Controllers.MainRouter(controller: controller)

    controller.start()
)
