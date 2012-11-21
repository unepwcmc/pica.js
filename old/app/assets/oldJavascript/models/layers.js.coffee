Pica.module('Collections', (Collections, App, Backbone, Marionette, $, _) ->
  class Collections.LayerList
    constructor: (appId) ->
      @appId = appId
      @layers = []
      @fetch()

    url: () ->
      "#{Pica.config.magpieAddress}/apps/#{@appId}"

    fetch: () ->
      $.ajax(
        url: @url()
        success: @parse
      )

    parse: (data) ->
      _.each data.layers, (layer) ->
        @layers.push layer
)

