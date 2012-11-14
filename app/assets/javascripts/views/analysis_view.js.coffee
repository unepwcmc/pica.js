Pica.module('Views', (Views, App, Backbone, Marionette, $, _) ->

  class Views.AnalysisView extends Backbone.View
    template: JST["templates/analysis-template"]

    initialize: (options) ->
      @area = new Pica.Models.Area

      @render()
      
    render: =>
      @$el.html(@template())

      @currentTab = new Backbone.Marionette.Region(
        el: "#current-area-tab"
      )
      @currentTab.show(new Pica.Views.AreaView(@area))

      return this
)
