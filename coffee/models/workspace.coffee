define [
 "lib/pica_model"
 "models/area"
]
, (PicaModel, PicaModelsArea) ->

  class PicaModelsWorkspace extends PicaModel
    constructor: (@app, options) ->
      @throwIfNoApp()
      @attributes = {}
      @areas = []
  
      @currentArea = new PicaModelsArea(@app)
      @addArea(@currentArea)
  
    url: () ->
      "#{@app.config.magpieUrl}/workspaces.json"
  
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
