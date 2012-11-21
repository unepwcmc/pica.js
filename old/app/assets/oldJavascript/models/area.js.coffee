Pica.module('Models', (Models, App, Backbone, Marionette, $, _) ->

  class Models.Area extends Backbone.Model
    initialize: (options) ->
      @set(workspace_id: options.workspace_id) if options?
      @set(name: 'my lovely area')
      @set(polygons: new Pica.Collections.PolygonList([], {area: @}))
      @set(calculatedStatList: new Pica.Collections.CalculatedStatList([], {area: @}))
      
      @get('polygons').bind('add', (model, options) =>
        model.bind('sync', @fetch)
        model.bind('requestAreaId', @save)
      )
      @

    url: () ->
      "#{Pica.config.magpieAddress}/workspaces/#{@get('workspace_id')}/areas_of_interest/"

    parse: (response) ->
      super
      @trigger('reset')
      
    save: (attributes, options) =>
      console.log "saving area, its id is #{@get('id')}"
      options ||= {}

      # Don't save unless we have a parent area id
      if @get('workspace_id')?
        super
      else
        @trigger('requestWorkspaceId', {},
          success: (workspace, response, callbackOptions) =>
            @set(workspace_id: workspace.get('id'))
            if @get('workspace_id')?
              @save {}, options
            else
              options.error(@, {error: "Could not save workspace, so cannot save area"}, callbackOptions)
        )
)

Pica.module('Collections', (Collections, App, Backbone, Marionette, $, _) ->

 class Collections.AreaList extends Backbone.Collection
    model: Pica.Models.Area
)
