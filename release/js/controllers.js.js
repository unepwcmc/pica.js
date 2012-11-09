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
        return this.controller = options.controller;
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
        var tileLayer, tileLayerUrl;
        this.calculatedLayerStatList = new Pica.Collections.CalculatedLayerStatList([
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
        this.map = L.map('map').setView([51.505, -0.09], 3);
        tileLayerUrl = 'http://carbon-tool.cartodb.com/tiles/ne_countries/{z}/{x}/{y}.png';
        return tileLayer = new L.TileLayer(tileLayerUrl, {
          maxZoom: 18
        }).addTo(this.map);
      };

      MainController.prototype.start = function() {
        return this.drawNewPolygon();
      };

      MainController.prototype.drawNewPolygon = function() {
        Pica.sidePanel.show(new Pica.Views.NewPolygonView(new Pica.Models.Polygon(), this.map));
        return Pica.vent.on("polygon:Created", this.showPolygon);
      };

      MainController.prototype.showPolygon = function(polygon) {
        Pica.router.navigate("/analysis/" + (polygon.get('analysis_id')) + "/polygon/" + (polygon.get('id')));
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
      Pica.router = new Controllers.MainRouter({
        controller: controller
      });
      return controller.start();
    });
  });

}).call(this);
