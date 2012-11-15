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
      Pica.map = L.map('map').setView([0, 0], 2)
      tileLayerUrl = 'http://carbon-tool.cartodb.com/tiles/ne_countries/{z}/{x}/{y}.png'
      tileLayer = new L.TileLayer(tileLayerUrl, {
        maxZoom: 18
      }).addTo Pica.map

    start: () ->
      @drawNewOrLoad()

    drawNewOrLoad: () ->
      Pica.sidePanel.show(new Pica.Views.NewOrLoadView())

      @transitionToActionOn('userRequest:drawNewArea', @newAnalysis)
      Pica.vent.on('userRequest:loadArea', () -> alert('Implement me'))

    newAnalysis: () ->
      Pica.sidePanel.show(new Pica.Views.AnalysisView(analysis: new Pica.Models.Analysis()))

  # App entry point
  Controllers.addInitializer ->
    controller = new Controllers.MainController()
    Pica.router = new Controllers.MainRouter(controller: controller)

    Pica.calculationList = new Pica.Collections.CalculationList([{name: 'mangrove_carbon_sum'}])

    controller.start()
)
