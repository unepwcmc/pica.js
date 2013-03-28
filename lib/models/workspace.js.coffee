class Pica.Models.Workspace extends Pica.Model
  constructor: () ->
    @attributes = {}
    @areas = []

    @currentArea = new Pica.Models.Area()
    @addArea(@currentArea)

  url: () ->
    "#{Pica.config.magpieUrl}/workspaces.json"

  addArea: (area) ->
    area.on('requestWorkspaceId', (options) =>
      if @get('id')?
        options.success(@)
      else
        @save(options)
    )
    @areas.push(area)

  removeArea: (theArea) ->
    id = @areas.indexOf(theArea)
    area = @areas.splice(id, 1)[0]
    if area.get('id')?
      area.destroy()

  setCurrentArea: (theArea) ->
    for area in @areas
      if area == theArea
        @currentArea = area

  setCurrentAreaById: (areaId) ->
    for area in @areas
      if area.get('id') == areaId
        @currentArea = area

  save: (options) =>
    super options
