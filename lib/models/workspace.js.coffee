class Pica.Models.Workspace extends Pica.Model
  constructor: () ->
    @attributes = {}
    @areas = []

    @currentArea = new Pica.Models.Area()
    @addArea(@currentArea)

  url: () ->
    "#{Pica.config.magpieUrl}/workspaces"

  addArea: (area) ->
    area.on('requestWorkspaceId', @save)
    @areas.push(area)

  save: (options) =>
    super options
