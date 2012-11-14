Pica.module('Models', (Models, App, Backbone, Marionette, $, _) ->

  class Models.Area extends Backbone.Model
    initialize: () ->
      @set(polygons: new Pica.Collections.PolygonList([], {area: @}))
)
