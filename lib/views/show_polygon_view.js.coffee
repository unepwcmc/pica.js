class Pica.Views.ShowPolygonView
  constructor: (options) ->
    @polygons = options.polygons
    @mapPolygons = []
    @render()

  render: () ->
    for polygon in @polygons
      mapPolygon = new L.Polygon(
        polygon.geomAsLatLngArray()
      ).addTo(Pica.config.map)
      @mapPolygons.push(mapPolygon)
