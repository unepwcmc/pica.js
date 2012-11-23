class Pica.Models.Area extends Pica.Model
  constructor: (options) ->
    @polygons = []

    @set('name', 'My Lovely Area')

  setName: (name) ->
    @set('name', name)

  addPolygon: (polygon) ->
    polygon.on('requestAreaId', @save)
    polygon.on('sync', @fetch)
    @polygons.push(polygon)

  drawNewPolygonView: (finishedCallback) ->
    @currentPolygon = new Pica.Models.Polygon()
    @addPolygon(@currentPolygon)
    new Pica.Views.NewPolygonView(
      finishedCallback: finishedCallback
      polygon: @currentPolygon
    )

  # spawns a new ShowAreaPolygonsView for this area
  newShowAreaPolygonsView: () ->
    new Pica.Views.ShowAreaPolygonsView(
      area: @
    )

  url: () ->
    create: "#{Pica.config.magpieUrl}/workspaces/#{@get('workspace_id')}/areas_of_interest/"
    read:   "#{Pica.config.magpieUrl}/areas_of_interest/#{@get('id')}"

  fetch: () =>
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
      )
