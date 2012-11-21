Pica.module('Views', (Views, App, Backbone, Marionette, $, _) ->

  class Views.NewPolygonView extends Pica.Views.MapEditView
    template: JST["templates/new-polygon-view"]

    initialize: (options) ->
      @polygon = options.polygon

      # Turn on Leaflet.draw polygon tool
      (new L.Polygon.Draw(Pica.map, {})).enable()

      Pica.map.on 'draw:poly-created', (e) =>
        mapPolygon = e.poly
        mapPolygon.addTo(Pica.map)
        @createPolygon mapPolygon

    createPolygon: (mapPolygon) ->
      @polygon.setGeomFromPoints(mapPolygon.getLatLngs())
      @polygon.save(
        @polygon.attributes
      )

    render: =>
      @$el.html(@template())
      return this
)
