Pica.module('Models', (Models, App, Backbone, Marionette, $, _) ->

  class Models.Workspace extends Backbone.Model
    url: () ->
      "#{Pica.config.magpieAddress}/workspaces"

    initialize: () ->
      @set(areas: new Pica.Collections.AreaList([]))
      
      @get('areas').bind('add', (model, options) =>
        model.bind('requestWorkspaceId', @save)
      )

    save: (attributes, options) =>
      console.log 'Mocking workspace save, remove method when magpie works'
      @set(id: 6)
      options.success(@, options, options)

)
