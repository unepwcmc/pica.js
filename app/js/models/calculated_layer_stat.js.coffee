Pica.module('Models', (Models, App, Backbone, Marionette, $, _) ->

  class Models.CalculatedLayerStat extends Backbone.Model
    url: () ->
      "#{window.PICA.magpieAddress}/polygon"
)

Pica.module('Collections', (Collections, App, Backbone, Marionette, $, _) ->
  class Collections.CalculatedLayerStatList extends Backbone.Collection
    model: Pica.Models.CalculatedLayerStat
    initialize: (options) ->
      @polygonId = options.polygonId

    url: () ->
      "/polygon/#{@polygonId}/calculated_layer_stats"
)
