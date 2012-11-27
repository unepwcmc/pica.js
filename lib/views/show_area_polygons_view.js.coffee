class Pica.Views.ShowAreaPolygonsView extends Pica.Events
  constructor: (options) ->
    @area = options.area
    @mapPolygons = []
    @area.on('sync', @render)
    @render()

  render: () =>
    @removeAllPolygonsAndBindings()

    for polygon in @area.polygons
      continue unless polygon.isComplete()

      mapPolygon = new L.Polygon(
        polygon.geomAsLatLngArray()
      ).addTo(Pica.config.map)

      mapPolygon.on('click', (=>
        thatPolygon = polygon
        thatMapPolygon = mapPolygon
        return (event) =>
          @triggerPolyClick(thatPolygon, event, thatMapPolygon)
      )())
      polygon.on('delete', (=>
        thatMapPolygon = mapPolygon
        return =>
          @removeMapPolygonAndBindings(thatMapPolygon)
      )())

      @mapPolygons.push(mapPolygon)

  close: ->
    @removeAllPolygonsAndBindings()

  removeAllPolygonsAndBindings: ->
    while mapPolygon = @mapPolygons.shift()
      @removeMapPolygonAndBindings(mapPolygon)

  removeMapPolygonAndBindings: (mapPolygon) ->
    mapPolygon.off('click', @triggerPolyClicked)
    Pica.config.map.removeLayer mapPolygon

  triggerPolyClick: (polygon, event, mapPolygon) =>
    @trigger('polygonClick', [polygon, event, mapPolygon])
