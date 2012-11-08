Pica.module('Controllers', (Controllers, App, Backbone, Marionette, $, _) ->

  class Controllers.MainRouter extends Backbone.Router
    routes:
      "new_polygon": "newPolygon"
      "analysis/:analysis_id/polygon/:id": "polygonShow"
      ".*": "start"

    start: () ->
      @currentView = new Pica.Views.DrawOrLoadView()

  class Controllers.MainController extends Marionette.Controller
    initialize: (options) ->
      @calculatedLayerStatList = new Pica.CalculatedLayerStats.CalculatedLayerStatList([
        new Pica.CalculatedLayerStats.CalculatedLayerStat(name: "Carbon", value: 50),
        new Pica.CalculatedLayerStats.CalculatedLayerStat(name: "Beef", value: 5),
        new Pica.CalculatedLayerStats.CalculatedLayerStat(name: "Watermelon", value: 150)
      ])

    start: () ->
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
