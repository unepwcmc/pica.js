Pica.module('Models', (Models, App, Backbone, Marionette, $, _) ->

  class Models.Calculation extends Backbone.Model
    url: () ->
      "#{Pica.config.magpieAddress}/calculations/#{@get('name')}"
)

Pica.module('Collections', (Collections, App, Backbone, Marionette, $, _) ->

  class Collections.CalculationList extends Backbone.Collection
    model: Pica.Models.Calculation

    initialize: (collection, options) ->
      collection.each (calculation) ->
        calculation.fetch()

)
