class Pica
  constructor: (_options) ->
    options = _options || {}
  
    workspace = @createWorkspace(@getWorkspaceIdFromUrl())
    @renderMap(options.map_id, workspace)
    @renderSidepanel(options.sidepanel_id, workspace)

  createWorkspace: ->

  renderMap: ->

  renderSidepanel: ->

  getWorkspaceIdFromUrl: ->
    window.location.hash

window.Pica = Pica
