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
      "#{Pica.config.magpieAddress}/polygon/#{@polygonId}/calculated_layer_stats"

    fetch: (options) ->
      $.ajax(
        url: @url(),
        type: 'post',
        data: JSON.stringify(
          polygonGeoJSON: @polygonGeoJSON
        )
        success: (data) =>
          @reset($.parseJSON(data))
          options.success(@)
        error: (data) ->
          console.log "Fetched failed"
      )
)
