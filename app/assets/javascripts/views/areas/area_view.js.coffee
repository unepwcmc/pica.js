Pica.module('Views', (Views, App, Backbone, Marionette, $, _) ->

  class Views.AreaView extends Backbone.View
    initialize: (options) ->
      @calculatedLayerStatList = new Pica.Collections.CalculatedLayerStatList(
        areaId: options.areaId
      )
      @calculatedLayerStatList.fetch()
      @calculatedLayerStatsView = new Pica.Views.CalculatedLayerStatsView(
        collection: @calculatedLayerStatList
      )

    render: () ->
      @$el.html(@calculatedLayerStatsView.el)
      return @
)
