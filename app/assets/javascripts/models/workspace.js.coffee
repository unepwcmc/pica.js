class Pica.Models.Workspace extends Pica.Events
  constructor: () ->
    @areas = []

    @currentArea = new Pica.Models.Area()
    @addArea(@currentArea)

  addArea: (area) ->
    area.on('requestWorkspaceId', @save)
    @areas.push(area)

  save: () ->

