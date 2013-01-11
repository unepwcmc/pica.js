class Pica.Views.NewPolygonView
  constructor: (options) ->
    if options.callbacks?
      @successCallback = options.callbacks.success
      @errorCallback = options.callbacks.error

    @polygon = options.polygon

    # Turn on Leaflet.draw polygon tool
    @polygonDraw = new L.Polygon.Draw(Pica.config.map, {})
    @polygonDraw.enable()

    Pica.config.map.on 'draw:poly-created', (e) =>
      mapPolygon = e.poly
      @createPolygon mapPolygon

  createPolygon: (mapPolygon) ->
    @polygon.setGeomFromPoints(mapPolygon.getLatLngs())
    @polygon.save(success: () =>
      @close()
      @successCallback() if @successCallback?
    error: (error) =>
      @close()
      @errorCallback() if @errorCallback?
    )

  close: () ->
    @polygonDraw.disable()
    Pica.config.map.off('draw:poly-created')
