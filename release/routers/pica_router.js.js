(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  window.PICA.config = {};

  Pica.Routers.PicaRouter = (function(_super) {

    __extends(PicaRouter, _super);

    function PicaRouter() {
      PicaRouter.__super__.constructor.apply(this, arguments);
    }

    PicaRouter.prototype.routes = {
      "new_polygon": "newPolygon",
      "analysis/:analysis_id/polygon/:id": "polygonShow",
      ".*": "start"
    };

    PicaRouter.prototype.introduction = function(magpieAddress) {
      return window.PICA.config.magpieAddress = magpieAddress;
    };

    PicaRouter.prototype.start = function() {
      return this.currentView = new Pica.Views.DrawOrLoadView();
    };

    PicaRouter.prototype.newPolygon = function() {
      return this.currentView = new Pica.Views.NewPolygonView();
    };

    PicaRouter.prototype.polygonShow = function(event) {
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

    return PicaRouter;

  })(Backbone.Router);

}).call(this);
