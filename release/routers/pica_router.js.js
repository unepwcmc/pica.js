(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Pica.module('Routers', function(Routers, App, Backbone, Marionette, $, _) {
    Routers.MainRouter = (function(_super) {

      __extends(MainRouter, _super);

      function MainRouter() {
        MainRouter.__super__.constructor.apply(this, arguments);
      }

      MainRouter.prototype.routes = {
        "new_polygon": "newPolygon",
        "analysis/:analysis_id/polygon/:id": "polygonShow",
        ".*": "start"
      };

      MainRouter.prototype.introduction = function(magpieAddress) {
        return Pica.config.magpieAddress = magpieAddress;
      };

      MainRouter.prototype.start = function() {
        return this.currentView = new Pica.Views.DrawOrLoadView();
      };

      MainRouter.prototype.newPolygon = function() {
        return this.currentView = new Pica.Views.NewPolygonView();
      };

      MainRouter.prototype.polygonShow = function(event) {
        var analysisId, polygonId;
        analysisId = 1;
        polygonId = 1;
        this.analysis = new Pica.Models.Analysis({
          id: analysisId
        });
        this.polygon = new Pica.Models.Polygon({
          id: polygonId
        });
        return this.currentView = new Pica.Views.AnalysisView({
          model: this.analysis,
          currentPolygon: this.polygon
        });
      };

      return MainRouter;

    })(Backbone.Router);
    return Routers.addInitializer(function() {
      return new Routers.MainRouter();
    });
  });

}).call(this);
