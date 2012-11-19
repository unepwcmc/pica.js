Pica.module('Models', (Models, App, Backbone, Marionette, $, _) ->

  class Models.CalculatedStat extends Backbone.Model
    initialize: (options) ->
      @area = options.area
      @calculation = options.calculation
    url: () ->
      "#{Pica.config.magpieAddress}/areas/#{@area.get('id')}/calculation/#{@calculation.get('id')}/calculated_stat/"
)

Pica.module('Collections', (Collections, App, Backbone, Marionette, $, _) ->
  class Collections.CalculatedStatList extends Backbone.Collection
    model: Pica.Models.CalculatedStat
    initialize: (options) ->
      @area = options.area
      @calculationList = options.calculationList

    url: () ->
      "#{Pica.config.magpieAddress}/areas/#{@area.get('id')}/calculated_layer_stats"

    fetch: (options) ->
      @remove(@models)
      @

)
