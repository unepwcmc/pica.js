Pica.module('Models', (Models, App, Backbone, Marionette, $, _) ->

  class Models.Polygon extends Backbone.Model
    url: () ->
      '/polygon'

    setGeomFromPoints: (points) ->
      points = _.map(points, (p) ->
        [p.lat, p.lng]
      )
      points.push points[0]

      @set(geom: 
        "type": "Feature",
        "geometry": 
          "type": "MultiPolygon",
          "coordinates": [[[points]]]
      )
)
