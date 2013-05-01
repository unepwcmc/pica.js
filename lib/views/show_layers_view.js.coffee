class Pica.Views.ShowLayersView
  constructor: (options) ->
    @app = options.app
    @app.on('sync', @render)
    @tileLayers = {}
    @layerControl = no

  # For every layer in @app.layers,
  # we build a @tileLayers object, compatible with the arguments to
  # L.control.layers, and, if we are not delegating the Layer Control 
  # functionality to Pica, we simply add every layer to the map in order.
  render: =>
    @removeTileLayers()
    @removeLayerControl()
    for layer in @app.layers
      tileLayer = L.tileLayer(layer.tile_url)
      @tileLayers[layer.display_name] = tileLayer
      if not @app.config.delegateLayerControl
        tileLayer.addTo(@app.config.map)
    @layerControl = @renderLayerControl @app.config.map

  # I we are delegating the Layer Control functionality to Pica:
  # first merge optional extra overlays from config into @tileLayers and
  # show first layer with Layer Control.
  renderLayerControl: (map) ->
    if @app.config.delegateLayerControl
      extraOverlays = @app.config.extraOverlays or {}
      layers = $.extend @tileLayers, extraOverlays
      @showFirstOverlay(layers, map)
      return L.control.layers({}, layers).addTo map

  showFirstOverlay: (layers, map) ->
    for name, layer of layers
      layer.addTo map
      return
 
  removeTileLayers: =>
    for name, tileLayer of @tileLayers
      @app.map.removeLayer(tileLayer)

  removeLayerControl: ->
    @layerControl?.removeFrom @app.map

  close: ->
    @removeTileLayers()
    @removeLayerControl()
    @app.off('sync', @render)
