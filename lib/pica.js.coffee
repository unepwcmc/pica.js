#
# * pica.js
# * https://github.com/unepwcmc/pica.js
# *
# * Copyright (c) 2012 UNEP-WCMC
#

window.Pica ||= {}
Pica.Models = {}
Pica.Views = {}

class Pica.Application extends Pica.Events
  constructor: (@config) ->
    Pica.config = @config

    $.support.cors = true

    $.ajaxSetup
      headers:
        'X-Magpie-ProjectId': Pica.config.projectId

    @layers = []
    @fetch()

    # If Leaflet LayerControl activation is delegated
    # to pica, then show Tile Layers.
    if @config.delegateLayerControl then @showTileLayers()

  newWorkspace: ->
    @currentWorkspace = new Pica.Models.Workspace()

  showTileLayers: ->
    new Pica.Views.ShowLayersView(app:@)

  fetch: ->
    $.ajax(
      url: "#{Pica.config.magpieUrl}/projects/#{Pica.config.projectId}.json"
      type: 'get'
      success: @parse
    )

  parse: (data) =>
    for attr, val of data
      @[attr] = val
    @trigger('sync')
