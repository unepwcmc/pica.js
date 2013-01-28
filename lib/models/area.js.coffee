class Pica.Models.Area extends Pica.Model
  constructor: (options) ->
    @polygons = []

    @set('name', 'My Lovely Area')

  setName: (name) ->
    @set('name', name)

  addPolygon: (polygon) ->
    polygon.on('requestAreaId', (options) =>
      if @get('id')?
        options.success(@)
      else
        @save(options)
    )
    polygon.on('sync', => @fetch())
    polygon.on('delete', => @fetch())
    @polygons.push(polygon)
    @trigger('addedPolygon', polygon)

  # Create a new Pica.Views.NewPolygonView for this area
  drawNewPolygonView: (callbacks) ->
    @currentPolygon = new Pica.Models.Polygon()
    @addPolygon(@currentPolygon)
    new Pica.Views.NewPolygonView(
      callbacks: callbacks
      polygon: @currentPolygon
    )

  # Create a new Pica.Views.NewCircleView for this area
  drawNewCircleView: (callbacks) ->
    @currentPolygon = new Pica.Models.Polygon()
    @addPolygon(@currentPolygon)
    new Pica.Views.NewCircleView(
      callbacks: callbacks
      polygon: @currentPolygon
    )

  # Create a new Pica.Views.UploadPolygonView for this area
  newUploadFileView: (callbacks) ->
    new Pica.Views.UploadFileView(
      callbacks: callbacks
      area: @
    )

  # spawns a new ShowAreaPolygonsView for this area
  newShowAreaPolygonsView: () ->
    new Pica.Views.ShowAreaPolygonsView(
      area: @
    )

  url: () ->
    create: "#{Pica.config.magpieUrl}/workspaces/#{@get('workspace_id')}/areas_of_interest/"
    read:   "#{Pica.config.magpieUrl}/areas_of_interest/#{@get('id')}"

  parse: (data) ->
    if data.polygons?
      @polygons = [] 
      for polygonAttributes in data.polygons
        polygon = new Pica.Models.Polygon(attributes:polygonAttributes)
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
            options.error(@, {error: "Could not save workspace, so cannot save area"}, jqXHR)
        error: (jqXHR, textStatus, errorThrown) =>
          console.log "Unable to save area:"
          console.log arguments
          console.log jqXHR.status
          console.log jqXHR.statusText
          console.log jqXHR.responseText
          options.error(jqXHR, textStatus, {error: "Unable to obtain workspaceId, cannot save area", parentError: errorThrown}) if options.error?
      )
