window.Pica = new Backbone.Marionette.Application()
window.Pica.config = {}

Pica.addRegions
  main: "#map"
  side_panel: "#side_panel"

Pica.on "initialize:after", ->
  Backbone.history.start()

Pica.addInitializer (options) ->
  calculatedLayerStatsView = new Pica.Views.CalculatedLayerStatsView(
    collection: options.calculatedLayerStats
  )
  Pica.main.show(calculatedLayerStatsView)

$(document).ready ->
  calculatedLayerStats = new Pica.Collections.CalculatedLayerStats([
    new Pica.Models.CalculatedLayerStat(name: "Carbon", value: 50),
    new Pica.Models.CalculatedLayerStat(name: "Beef", value: 5),
    new Pica.Models.CalculatedLayerStat(name: "Watermelon", value: 150)
  ])
  Pica.start calculatedLayerStats: calculatedLayerStats
