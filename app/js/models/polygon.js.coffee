Pica.module('Models', (Models, App, Backbone, Marionette, $, _) ->

  class Models.Polygon extends Backbone.Model
    url: () ->
      '../dummyData/polygon.json'

    sync: (method, model, options) ->
      console.log @url()
      $.ajax(
        url: @url(),
        success: () ->
          model.set(data)
          options.success()
        dataType: 'json'
      )

)
