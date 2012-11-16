class Workspace

window.Workspace = Workspace

class Pica
  constructor: (_options) ->
    @options = _options || {}

    @createWorkspace()
    @fetch()

  createWorkspace: ->
    @workspace = new Workspace(@, @getWorkspaceIdFromUrl())

  fetch: ->
    $.getJSON "#{@options.server_url}/applications/1.json", @parse

  parse: (data) ->

  getWorkspaceIdFromUrl: ->
    match = @getLocationHash().match(/workspace\/(\d+)/)
    return match[1] if match
    return null

  # http://stackoverflow.com/a/7050884
  getLocationHash: -> window.location.hash

window.Pica = Pica
