Pica.module('Controllers', (Controllers, App, Backbone, Marionette, $, _) ->

  class Controllers.MainRouter extends Backbone.Router
    routes:
      "new_polygon": "newPolygon"
      "analysis/:analysis_id/polygon/:id": "polygonShow"
      ".*": "start"

    initialize: (options) ->
      @controller = options.controller

      # App triggered changes
      Pica.vent.on("routeTo:polygonShow", (polygon) =>
        console.log "Navigating to /analysis/#{polygon.get('analysis_id')}/polygon/#{polygon.get('id')}"
        @navigate("/analysis/#{polygon.get('analysis_id')}/polygon/#{polygon.get('id')}", trigger: true)
      )

    polygonShow: (analysis_id, id) =>
      @controller.showPolygon(id)

  class Controllers.MainController extends Marionette.Controller
    initialize: (options) ->
      @calculatedLayerStatList = new Pica.Collections.CalculatedLayerStatList([
        new Pica.Models.CalculatedLayerStat(name: "Carbon", value: 50),
        new Pica.Models.CalculatedLayerStat(name: "Beef", value: 5),
        new Pica.Models.CalculatedLayerStat(name: "Watermelon", value: 150)
      ])

    start: () ->
      @map = L.map('map').setView([51.505, -0.09], 3)
      tileLayerUrl = 'http://carbon-tool.cartodb.com/tiles/ne_countries/{z}/{x}/{y}.png'
      tileLayer = new L.TileLayer(tileLayerUrl, {
        maxZoom: 18
      }).addTo @map
      Pica.sidePanel.show(new Pica.Views.NewPolygonView(@map))

    showPolygon: (polygon) ->
      @calculatedLayerStatsView = new Pica.Views.CalculatedLayerStatsView(
        collection: @calculatedLayerStatList
      )
      Pica.sidePanel.show(@calculatedLayerStatsView)

  # App entry point
  Controllers.addInitializer ->
    controller = new Controllers.MainController()
    new Controllers.MainRouter(controller: controller)

    controller.start()
)
