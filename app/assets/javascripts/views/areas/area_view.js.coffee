Pica.module('Views', (Views, App, Backbone, Marionette, $, _) ->

  class Views.AreaView extends Backbone.View
    template: JST["templates/area-view"]
    initialize: (options) ->
      @area = options.area
      @area = new Pica.Models.Area() unless @area?
      if @area.get('polygons').length == 0
        @currentView = new Pica.Views.NewPolygonView(new Pica.Models.Polygon())
      else
        console.log "implement me"
        @calculatedLayerStatList = new Pica.Collections.CalculatedLayerStatList(
          areaId: options.areaId
        )
        @calculatedLayerStatList.fetch()
        @calculatedLayerStatsView = new Pica.Views.CalculatedLayerStatsView(
          collection: @calculatedLayerStatList
        )

    render: () ->
      @$el.html(@template())
      
      @$el.find('#area-sub-view-container').html(@currentView.render().el)
      return @
)
