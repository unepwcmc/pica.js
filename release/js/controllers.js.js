(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Pica.module('Controllers', function(Controllers, App, Backbone, Marionette, $, _) {
    Controllers.MainRouter = (function(_super) {

      __extends(MainRouter, _super);

      function MainRouter() {
        this.polygonShow = __bind(this.polygonShow, this);
        MainRouter.__super__.constructor.apply(this, arguments);
      }

      MainRouter.prototype.routes = {
        "new_polygon": "newPolygon",
        "analysis/:analysis_id/polygon/:id": "polygonShow",
        ".*": "start"
      };

      MainRouter.prototype.initialize = function(options) {
        var _this = this;
        this.controller = options.controller;
        return Pica.vent.on("routeTo:polygonShow", function(polygon) {
          console.log("Navigating to /analysis/" + (polygon.get('analysis_id')) + "/polygon/" + (polygon.get('id')));
          return _this.navigate("/analysis/" + (polygon.get('analysis_id')) + "/polygon/" + (polygon.get('id')), {
            trigger: true
          });
        });
      };

      MainRouter.prototype.polygonShow = function(analysis_id, id) {
        return this.controller.showPolygon(id);
      };

      return MainRouter;

    })(Backbone.Router);
    Controllers.MainController = (function(_super) {

      __extends(MainController, _super);

      function MainController() {
        MainController.__super__.constructor.apply(this, arguments);
      }

      MainController.prototype.initialize = function(options) {
        return this.calculatedLayerStatList = new Pica.Collections.CalculatedLayerStatList([
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
      };

      MainController.prototype.start = function() {
        var tileLayer, tileLayerUrl;
        this.map = L.map('map').setView([51.505, -0.09], 3);
        tileLayerUrl = 'http://carbon-tool.cartodb.com/tiles/ne_countries/{z}/{x}/{y}.png';
        tileLayer = new L.TileLayer(tileLayerUrl, {
          maxZoom: 18
        }).addTo(this.map);
        return Pica.sidePanel.show(new Pica.Views.NewPolygonView(this.map));
      };

      MainController.prototype.showPolygon = function(polygon) {
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
