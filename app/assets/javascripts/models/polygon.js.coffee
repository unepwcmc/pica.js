Pica.module('Models', (Models, App, Backbone, Marionette, $, _) ->

  class Models.Polygon extends Backbone.Model
    url: () ->
      "#{Pica.config.magpieAddress}/polygons"

    setGeomFromPoints: (points) ->
      points = _.map(points, (p) ->
        [p.lng, p.lat]
      )
      points.push points[0]

      @set(geometry: [[points]])
)
Pica.module('Collections', (Collections, App, Backbone, Marionette, $, _) ->

 class Collections.PolygonList extends Backbone.Collection
    model: Pica.Models.Polygon
    initialize: (models, options) ->
      @area =  options.area
)
