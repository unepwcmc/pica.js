Pica.module('Models', (Models, App, Backbone, Marionette, $, _) ->

  class Models.Polygon extends Backbone.Model
    url: () ->
      "#{Pica.config.magpieAddress}/polygons"

    initialize: (options) ->
      @area = options.area

    setGeomFromPoints: (points) ->
      points = _.map(points, (p) ->
        [p.lng, p.lat]
      )
      points.push points[0]

      @set(geometry: [[points]])

    save: (attributes, options) =>
      options ||= {}
      @set(area_id: @get('area').get('id')) unless @get('area_id')?

      # Don't save unless we have a parent area id
      if @get('area_id')?
        super(arguments)
        @trigger('sync')
      else
        @get('area').save({}, success: () =>
          @save {}, options
        )
)
Pica.module('Collections', (Collections, App, Backbone, Marionette, $, _) ->

 class Collections.PolygonList extends Backbone.Collection
    model: Pica.Models.Polygon
    initialize: (models, options) ->
      @area =  options.area
)
