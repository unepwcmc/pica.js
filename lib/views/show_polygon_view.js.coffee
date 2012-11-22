class Pica.Views.ShowAreaPolygonsView
  constructor: (options) ->
    @area = options.area
    @mapPolygons = []
    @area.on('sync', @render)
    @render()

  render: () =>
    for polygon in @area.polygons
      mapPolygon = new L.Polygon(
        polygon.geomAsLatLngArray()
      ).addTo(Pica.config.map)
      @mapPolygons.push(mapPolygon)
