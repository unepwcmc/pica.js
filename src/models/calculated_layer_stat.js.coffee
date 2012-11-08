Pica.module('CalculatedLayerStats', (CalculatedLayerStats, App, Backbone, Marionette, $, _) ->

  class CalculatedLayerStats.CalculatedLayerStat extends Backbone.Model
    url: () ->
      "#{window.PICA.magpieAddress}/polygon"

  class CalculatedLayerStats.CalculatedLayerStatList extends Backbone.Collection
    model: CalculatedLayerStats.CalculatedLayerStat
)
