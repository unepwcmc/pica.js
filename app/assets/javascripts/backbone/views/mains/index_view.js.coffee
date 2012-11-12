PicaJs.Views.Mains ||= {}

class PicaJs.Views.Mains.IndexView extends Backbone.View
  template: JST["backbone/templates/mains/index"]

  render: ->
    $(@el).html(@template())
    return this
