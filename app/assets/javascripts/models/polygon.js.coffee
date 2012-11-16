Pica.module('Models', (Models, App, Backbone, Marionette, $, _) ->

  class Models.Polygon extends Backbone.Model
    url: () ->
      "#{Pica.config.magpieAddress}/polygons"

    initialize: (options) ->
      @set(area_id: options.area_id) if options?

    setGeomFromPoints: (points) ->
      points = _.map(points, (p) ->
        [p.lng, p.lat]
      )
      points.push points[0]

      @set(geometry: [[points]])

    save: (attributes, options) =>
      options ||= {}

      # Don't save unless we have a parent area id
      if @get('area_id')?
        super
        @trigger('sync')
      else
        @trigger('requestAreaId', {},
          success: (area, response, callbackOptions) =>
            @set(area_id: area.get('id'))
            debugger
            @save {}, options
          error: (error, response, callbackOptions) ->
            console.log "Unable to save polygon:"
            console.log error
        )
)
Pica.module('Collections', (Collections, App, Backbone, Marionette, $, _) ->

 class Collections.PolygonList extends Backbone.Collection
    model: Pica.Models.Polygon
    initialize: (models, options) ->
      @area =  options.area
)
