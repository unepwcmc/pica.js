define [
  "lib/pica_event"
  "lib/pica_model"
  "models/workspace"
  "views/show_layers_view"
], (PicaEvents, PicaModel, PicaModelsWorkspace, ShowLayersView) ->

  class PicaApplication extends PicaEvents
    constructor: (@config) ->
  
      $.support.cors = true
  
      $.ajaxSetup
        headers:
          'X-Magpie-ProjectId': @config.projectId
  
      @layers = []
      @fetch()
  
      # If Leaflet LayerControl activation is delegated
      # to pica, then show Tile Layers by default.
      if @config.delegateLayerControl then @showTileLayers()
  
    newWorkspace: ->
      @currentWorkspace = new PicaModelsWorkspace(@)
  
    showTileLayers: ->
      new ShowLayersView app:@
  
    fetch: ->
      $.ajax(
        url: "#{@config.magpieUrl}/projects/#{@config.projectId}.json"
        type: 'get'
        success: @parse
      )
  
    parse: (data) =>
      for attr, val of data
        @[attr] = val
      @trigger('sync')
  
    notifySyncStarted: ->
      @syncsInProgress or= 0
      @syncsInProgress = @syncsInProgress + 1
  
      if @syncsInProgress is 1
        @trigger('syncStarted')
  
    notifySyncFinished: ->
      @syncsInProgress or= 0
      @syncsInProgress = @syncsInProgress - 1
  
      if @syncsInProgress is 0
        @trigger('syncFinished')
  