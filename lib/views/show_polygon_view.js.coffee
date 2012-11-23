class Pica.Views.ShowAreaPolygonsView
  constructor: (options) ->
    @area = options.area
    @mapPolygons = []
    @area.on('sync', @render)
    @render()

  render: () =>
    while mapPolygon = @mapPolygons.shift()
      Pica.config.map.removeLayer mapPolygon

    for polygon in @area.polygons
      continue unless polygon.isComplete()

      mapPolygon = new L.Polygon(
        polygon.geomAsLatLngArray()
      ).addTo(Pica.config.map)

      @mapPolygons.push(mapPolygon)
