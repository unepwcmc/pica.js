Pica.module('Models', (Models, App, Backbone, Marionette, $, _) ->

  class Models.Area extends Backbone.Model
    initialize: (options) ->
      @set(analysis: options.analysis)
      @set(polygons: new Pica.Collections.PolygonList([], {area: @}))

    url: () ->
      "#{Pica.config.magpieAddress}/areas"

    save: (attributes, options) ->
      options ||= {}
      @set(analysis_id: @get('analysis').get('id')) unless @get('analysis_id')?

      # Don't save unless we have a parent area id
      if @get('analysis_id')?
        super(arguments)
      else
        @get('analysis').save({}, success: () =>
          @save {}, options
        )
)
