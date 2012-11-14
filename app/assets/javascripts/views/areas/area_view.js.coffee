Pica.module('Views', (Views, App, Backbone, Marionette, $, _) ->

  class Views.AreaView extends Backbone.View
    template: JST["templates/area-view"]
    initialize: (options) ->
      @area = options.area
      @area = new Pica.Models.Area() unless @area?
      if @area.get('polygons').length == 0
        newPolygon = new Pica.Models.Polygon(area: @area)
        @currentView = new Pica.Views.NewPolygonView(polygon: newPolygon)
        newPolygon.on('sync', @showLayerStatsView)
      else
        @showLayerStatsView()

    showLayerStatsView: () =>
      @calculatedStatList = new Pica.Collections.CalculatedStatList(
        area: @area
        calculationList: Pica.calculationList
      )
      @calculatedStatList.fetch()
      @calculatedStatsView = new Pica.Views.CalculatedStatsView(
        collection: @calculatedStatList
      )
      @currentView = @calculatedStatsView
      @render()

    render: () ->
      @$el.html(@template())
      
      @$el.find('#area-sub-view-container').html(@currentView.render().el)
      return @
)
