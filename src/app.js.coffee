Pica = new Backbone.Marionette.Application()

Pica.addRegions
  main: "#map"
  side_panel: "#side_panel"

Pica.on "initialize:after", ->
  Backbone.history.start()

Pica.addInitializer (options) ->
  calculatedLayerStatsView = new calculatedLayerStatsView(
    collection: options.calculatedLayerStats
  )
  Pica.main.show(calculatedLayerStats)
