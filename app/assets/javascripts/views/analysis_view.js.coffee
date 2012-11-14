Pica.module('Views', (Views, App, Backbone, Marionette, $, _) ->

  class Views.AnalysisView extends Backbone.View
    template: JST["templates/analysis-template"]

    initialize: (options) ->
      @analysis = options.model
      @area = options.area if options.area?
      @area ||= new Pica.Models.Area({analysis: @analysis})

      @render()
      
    render: =>
      @$el.html(@template())

      @currentTab = new Backbone.Marionette.Region(
        el: @el
      )
      @currentTab.show(new Pica.Views.AreaView(@area))

      return @
)
