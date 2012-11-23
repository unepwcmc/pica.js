class Pica.Views.NewPolygonView
  constructor: (options) ->
    @finishedCallback = options.finishedCallback

    @polygon = options.polygon

    # Turn on Leaflet.draw polygon tool
    @polygonDraw = new L.Polygon.Draw(Pica.config.map, {})
    @polygonDraw.enable()

    Pica.config.map.on 'draw:poly-created', (e) =>
      mapPolygon = e.poly
      mapPolygon.addTo(Pica.config.map)
      @createPolygon mapPolygon

  createPolygon: (mapPolygon) ->
    @polygon.setGeomFromPoints(mapPolygon.getLatLngs())
    @polygon.save(success: () =>
      @close()
      @finishedCallback() if finishedCallback?
    )

  close: () ->
    @polygonDraw.disable()
    Pica.config.map.off('draw:poly-created')
