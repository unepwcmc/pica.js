define [
 "lib/pica_model"
 "views/new_polygon_view"
 "views/new_circle_view"
 "views/upload_file_view"
 "views/show_area_polygons_view"
 "models/polygon"
]
, (PicaModel, PicaViewsNewPolygonView, PicaViewsNewCircleView, PicaViewsUploadFileView, PicaViewsShowAreaPolygonsView, PicaModelsPolygon) ->

  class PicaModelsArea extends PicaModel
    constructor: (@app) ->
      @throwIfNoApp()
      @polygons = []
  
      @set('name', 'My Lovely Area')
  
    setName: (name) ->
      @set('name', name)
  
    addPolygon: (polygon) ->
      polygon.on('requestAreaId', @getAreaId)
      polygon.on('sync', => @fetch())
      polygon.on('delete', => @fetch())
      @polygons.push(polygon)
      @trigger('addedPolygon', polygon)
  
    # Passes the area with an ID to success option
    # or passes an error
    getAreaId: (options) =>
      if @get('id')?
        options.success(@)
      else
        @save(options)
  
    # Create a new PicaViewsNewPolygonView for this area
    drawNewPolygonView: (callbacks) ->
      @createPolygon()
      new PicaViewsNewPolygonView(
        callbacks: callbacks
        polygon: @currentPolygon
        map: @app.config.map
      )
  
    # Create a new PicaViewsNewCircleView for this area
    drawNewCircleView: (callbacks) ->
      @createPolygon()
      new PicaViewsNewCircleView(
        callbacks: callbacks
        polygon: @currentPolygon
        map: @app.config.map
      )
  
    createPolygon: ->
      @currentPolygon = new PicaModelsPolygon(@app)
      @addPolygon(@currentPolygon)
  
    # Create a new PicaViewsUploadPolygonView for this area
    newUploadFileView: (callbacks) ->
      new PicaViewsUploadFileView(
        callbacks: callbacks
        area: @
        magpieUrl: @app.config.magpieUrl
      )
  
    # spawns a new ShowAreaPolygonsView for this area
    newShowAreaPolygonsView: () ->
      new PicaViewsShowAreaPolygonsView(
        area: @
        map: @app.config.map
      )
  
    url: () ->
      url = @app.config.magpieUrl
      create: "#{url}/workspaces/#{@get('workspace_id')}/areas_of_interest.json"
      read:   "#{url}/areas_of_interest/#{@get('id')}.json"
  
    parse: (data) ->
      if data.polygons?
        @polygons = []
        for polygonAttributes in data.polygons
          polygon = new PicaModelsPolygon(@app, attributes:polygonAttributes)
          @addPolygon(polygon)
        delete data.polygons
      else
        # Remove persisted polygons
        unPersistedPolygons = []
        for polygon, index in @polygons
          unPersistedPolygons.push(polygon) unless polygon.get('id')?
        @polygons = unPersistedPolygons
  
      super
  
    save: (options) =>
      options ||= {}
  
      if @get('workspace_id')?
        super options
      else
        @trigger('requestWorkspaceId',
          success: (workspace, textStatus, jqXHR) =>
            @set('workspace_id', workspace.get('id'))
            if @get('workspace_id')
              @save options
            else
              options.error(
                @,
                {error: "Could not save workspace, so cannot save area"},
                jqXHR
              )
          error: (jqXHR, textStatus, errorThrown) =>
            console.log "Unable to save area:"
            console.log arguments
            console.log jqXHR.status
            console.log jqXHR.statusText
            console.log jqXHR.responseText
            options.error(
              jqXHR,
              textStatus,
              {
                error: "Unable to obtain workspaceId, cannot save area",
                parentError: errorThrown
              }
            ) if options.error?
        )
