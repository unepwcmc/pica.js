(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Pica.module('Controllers', function(Controllers, App, Backbone, Marionette, $, _) {
    Controllers.MainRouter = (function(_super) {

      __extends(MainRouter, _super);

      function MainRouter() {
        MainRouter.__super__.constructor.apply(this, arguments);
      }

      MainRouter.prototype.routes = {
        "new_polygon": "newPolygon",
        "analysis/:analysis_id/polygon/:id": "polygonShow",
        ".*": "start"
      };

      MainRouter.prototype.start = function() {
        return this.currentView = new Pica.Views.DrawOrLoadView();
      };

      return MainRouter;

    })(Backbone.Router);
    Controllers.MainController = (function(_super) {

      __extends(MainController, _super);

      function MainController() {
        MainController.__super__.constructor.apply(this, arguments);
      }

      MainController.prototype.initialize = function(options) {
        return this.calculatedLayerStatList = new Pica.CalculatedLayerStats.CalculatedLayerStatList([
          new Pica.CalculatedLayerStats.CalculatedLayerStat({
            name: "Carbon",
            value: 50
          }), new Pica.CalculatedLayerStats.CalculatedLayerStat({
            name: "Beef",
            value: 5
          }), new Pica.CalculatedLayerStats.CalculatedLayerStat({
            name: "Watermelon",
            value: 150
          })
        ]);
      };

      MainController.prototype.start = function() {
        this.calculatedLayerStatsView = new Pica.Views.CalculatedLayerStatsView({
          collection: this.calculatedLayerStatList
        });
        return Pica.sidePanel.show(this.calculatedLayerStatsView);
      };

      return MainController;

    })(Marionette.Controller);
    return Controllers.addInitializer(function() {
      var controller;
      controller = new Controllers.MainController();
      new Controllers.MainRouter({
        controller: controller
      });
      return controller.start();
    });
  });

}).call(this);
