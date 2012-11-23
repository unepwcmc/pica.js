class Pica.Views.ShowAreaPolygonsView
  constructor: (options) ->
    @area = options.area
    @mapPolygons = []
    @area.on('sync', @render)
    @render()

  render: () =>
    for polygon in @area.polygons
      continue unless polygon.isComplete()
      continue if polygon.get('isOnMap')

      mapPolygon = new L.Polygon(
        polygon.geomAsLatLngArray()
      ).addTo(Pica.config.map)

      @mapPolygons.push(mapPolygon)
      polygon.set('isOnMap', true)
