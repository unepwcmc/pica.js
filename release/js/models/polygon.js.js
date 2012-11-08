(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Pica.module('Models', function(Models, App, Backbone, Marionette, $, _) {
    return Models.Polygon = (function(_super) {

      __extends(Polygon, _super);

      function Polygon() {
        Polygon.__super__.constructor.apply(this, arguments);
      }

      Polygon.prototype.url = function() {
        return "" + window.PICA.magpieAddress + "/polygon";
      };

      return Polygon;

    })(Backbone.Model);
  });

}).call(this);
