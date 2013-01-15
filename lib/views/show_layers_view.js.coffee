class Pica.Views.ShowLayersView
  constructor: (options) ->
    @app = options.app
    @app.on('sync', @render)
    @tileLayers = []
    @render()

  render: =>
    @removeTileLayers()
    for layer in @app.layers
      tileLayer = new L.TileLayer(layer.tile_url)
      @tileLayers.push(tileLayer)
      tileLayer.addTo(@app.config.map)

  removeTileLayers: =>
    for tileLayer in @tileLayers
      @app.map.removeLayer(tileLayer)

  close: ->
    @removeTileLayers()
    @app.off('sync', @render)
