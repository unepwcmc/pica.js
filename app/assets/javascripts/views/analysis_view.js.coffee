Pica.module('Views', (Views, App, Backbone, Marionette, $, _) ->

  class Views.WorkspaceView extends Backbone.View
    template: JST["templates/workspace-template"]

    initialize: (options) ->
      @workspace = options.workspace
      @area = options.area if options.area?
      @area ||= new Pica.Models.Area({workspace: @workspace})

      @render()
      
    render: =>
      @$el.html(@template())

      @currentTab = new Backbone.Marionette.Region(
        el: @el
      )
      @currentTab.show(new Pica.Views.AreaView(area: @area))

      return @
)
