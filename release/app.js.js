(function() {

  window.Pica = new Backbone.Marionette.Application();

  window.Pica.config = {};

  Pica.addRegions({
    main: "#map",
    side_panel: "#side_panel"
  });

  Pica.on("initialize:after", function() {
    return Backbone.history.start();
  });

  Pica.addInitializer(function(options) {
    var calculatedLayerStatsView;
    calculatedLayerStatsView = new Pica.Views.CalculatedLayerStatsView({
      collection: options.calculatedLayerStats
    });
    return Pica.main.show(calculatedLayerStatsView);
  });

  $(document).ready(function() {
    var calculatedLayerStats;
    calculatedLayerStats = new Pica.Collections.CalculatedLayerStats([
      new Pica.Models.CalculatedLayerStat({
        name: "Carbon",
        value: 50
      }), new Pica.Models.CalculatedLayerStat({
        name: "Beef",
        value: 5
      }), new Pica.Models.CalculatedLayerStat({
        name: "Watermelon",
        value: 150
      })
    ]);
    return Pica.start({
      calculatedLayerStats: calculatedLayerStats
    });
  });

}).call(this);
