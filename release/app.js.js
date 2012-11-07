(function() {
  var Pica;

  Pica = new Backbone.Marionette.Application();

  Pica.addRegions({
    main: "#map",
    side_panel: "#side_panel"
  });

  Pica.on("initialize:after", function() {
    return Backbone.history.start();
  });

  Pica.addInitializer(function(options) {
    var calculatedLayerStatsView;
    calculatedLayerStatsView = new calculatedLayerStatsView({
      collection: options.calculatedLayerStats
    });
    return Pica.main.show(calculatedLayerStats);
  });

}).call(this);
