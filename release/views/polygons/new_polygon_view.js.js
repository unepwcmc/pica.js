(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Pica.module('Views', function(Views, App, Backbone, Marionette, $, _) {
    return Views.NewPolygonView = (function(_super) {

      __extends(NewPolygonView, _super);

      function NewPolygonView() {
        this.render = __bind(this.render, this);
        NewPolygonView.__super__.constructor.apply(this, arguments);
      }

      NewPolygonView.prototype.events = {
        'click #analyse': 'createPolygon'
      };

      NewPolygonView.prototype.initialize = function() {
        return this.polygon = new Pica.Models.Polygon();
      };

      NewPolygonView.prototype.createPolygon = function() {
        this.polygon.save;
        return PICA.router.navigate("/analysis/" + (this.polygon.get('analysis_id')) + "/polygon/" + (this.polygon.get('id')));
      };

      NewPolygonView.prototype.render = function() {
        return this;
      };

      return NewPolygonView;

    })(Pica.Views.MapEditView);
  });

}).call(this);
