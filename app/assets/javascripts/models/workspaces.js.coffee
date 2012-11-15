Pica.module('Models', (Models, App, Backbone, Marionette, $, _) ->

  class Models.Workspace extends Backbone.Model
    url: () ->
      "#{Pica.config.magpieAddress}/workspaces"
)
