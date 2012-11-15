Pica.module('Models', (Models, App, Backbone, Marionette, $, _) ->

  class Models.Area extends Backbone.Model
    initialize: (options) ->
      @set(workspace: options.workspace)
      @set(polygons: new Pica.Collections.PolygonList([], {area: @}))

    url: () ->
      "#{Pica.config.magpieAddress}/areas"

    save: (attributes, options) ->
      options ||= {}
      @set(workspace_id: @get('workspace').get('id')) unless @get('workspace_id')?

      # Don't save unless we have a parent area id
      if @get('workspace_id')?
        super(arguments)
      else
        @get('workspace').save({},
          success: () =>
            @save {}, options
        )
)
