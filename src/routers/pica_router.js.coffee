Pica.module('Routers', (Routers, App, Backbone, Marionette, $, _) ->

  class Routers.MainRouter extends Backbone.Router
    routes:
      "new_polygon": "newPolygon"
      "analysis/:analysis_id/polygon/:id": "polygonShow"
      ".*": "start"

    introduction: (magpieAddress) ->
      Pica.config.magpieAddress = magpieAddress

    start: () ->
      @currentView = new Pica.Views.DrawOrLoadView()

    newPolygon: () ->
      @currentView = new Pica.Views.NewPolygonView()

    polygonShow: (event) ->
      # TODO: actually get these values from event
      analysisId = 1
      polygonId = 1
      @analysis = new Pica.Models.Analysis(id: analysisId)
      @polygon = new Pica.Models.Polygon(id: polygonId)
      @currentView = new Pica.Views.AnalysisView(model: @analysis, currentPolygon: @polygon)

  # Routers Initializer
  # --------------------
  #
  # Get a MainRouter up and running
  Routers.addInitializer ->
    new Routers.MainRouter()
)
