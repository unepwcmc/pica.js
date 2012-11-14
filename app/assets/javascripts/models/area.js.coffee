Pica.module('Models', (Models, App, Backbone, Marionette, $, _) ->

  class Models.Area extends Backbone.Model
    initialize: () ->
      @set(polygons: new Pica.Collections.PolygonList([], {area: @}))

    url: () ->
      "#{Pica.config.magpieAddress}/areas"

    save: (attributes, options) ->
      console.log('Pretending to save area, remove me when magpie works')
      @set('id', parseInt(Math.random()*2902, 10))

      options.success(@, {}, options)
)
