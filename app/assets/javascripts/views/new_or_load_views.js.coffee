Pica.module('Views', (Views, App, Backbone, Marionette, $, _) ->

  class Views.NewOrLoadView extends Backbone.View
    template: JST["templates/new-or-load"]
    events: 
      'click #new-area': 'fireNewArea'
      'click #load-analysis': 'fireLoad'

    fireNewArea: () ->
      Pica.vent.trigger('userRequest:drawNewArea')

    fireLoad: () ->
      Pica.vent.trigger('userRequest:loadArea')

    render: =>
      @$el.html(@template())
      return this
)
