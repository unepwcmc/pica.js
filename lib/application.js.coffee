window.Pica ||= {}
console.log Pica, 1
Pica.Models = {}
Pica.Views = {}
console.log Pica, 2

class Pica.Application extends Pica.Events
  
  constructor: (@config) ->
    Pica.config = @config

    $.support.cors = true

    $.ajaxSetup
      headers:
        'X-Magpie-ProjectId': Pica.config.projectId

    @layers = []
    @fetch()

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
