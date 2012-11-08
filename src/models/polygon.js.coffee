Pica.module('Models', (Models, App, Backbone, Marionette, $, _) ->

  class Models.Polygon extends Backbone.Model
    url: () ->
      "#{window.PICA.magpieAddress}/polygon"
)
