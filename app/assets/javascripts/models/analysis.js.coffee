Pica.module('Models', (Models, App, Backbone, Marionette, $, _) ->

  class Models.Analysis extends Backbone.Model
    url: () ->
      "#{Pica.config.magpieAddress}/analyses"
)
