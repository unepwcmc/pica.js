class Map
  constructor: (domId, workspace, urlTemplate, defaultCenter = [0, 0], defaultZoom = 2, tileLayerOptions = {}) ->
    @map = L.map(domId).setView(defaultCenter, defaultZoom)

    L.tileLayer(urlTemplate, tileLayerOptions).addTo @map

    @defineMapEventHandlers(@map)

  defineMapEventHandlers: (map) ->
    (new L.Polygon.Draw(map, {})).enable()
    map.on 'draw:poly-created', @addPolygon

  addPolygon: (polygonDrawEvent) =>
    mapPolygon = polygonDrawEvent.poly
    mapPolygon.addTo(@map)
    aoi = @workspace.currentAreaOfInterest()
    aoi.addPolygon(polygonDrawEvent.poly.getLatLngs())

class Sidepanel

class Layer

class Workspace
  constructor: (@application, @workspaceId) ->
    if @workspaceId
      @fetch()
    else
      @initializeEmptyWorkspace()

  fetch: ->
    $.getJSON "#{@application.options.server_url}/applications/1.json", @parse

  parse: (data) ->

  currentAreaOfInterest: ->
    

class AreaOfInterest

class Polygon

class Analysis

class Pica
  constructor: (@options = {}) ->
    @createWorkspace()
    @fetch()

  renderMap: (domId, urlTemplate) ->
    @map = new Map(domId, @workspace, urlTemplate)

  renderSidepanel: (domId) ->
    @sidepanel = new Sidepanel(domId, @workspace)

  createWorkspace: ->
    @workspace = new Workspace(@, @getWorkspaceIdFromUrl())

  fetch: ->
    $.getJSON "#{@options.server_url}/apps/#{@options.app_id}.json", @parse if @options.server_url

  parse: (data) ->
    @layers << new Layer(@, layer) for layer in data.layers

  getWorkspaceIdFromUrl: ->
    match = @getLocationHash().match(/workspace\/(\d+)/)
    return match[1] if match
    return null

  # http://stackoverflow.com/a/7050884
  getLocationHash: -> window.location.hash

window.Pica = Pica

# For testing

#window.Map = Map
#window.Sidepanel = Sidepanel
#window.Layer = Layer
#window.Workspace = Workspace
#window.AreaOfInterest = AreaOfInterest
#window.Polygon = Polygon
#window.Analysis = Analysis
