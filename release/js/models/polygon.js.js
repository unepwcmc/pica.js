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
        return '../dummyData/polygon.json';
      };

      Polygon.prototype.sync = function(method, model, options) {
        console.log(this.url());
        return $.ajax({
          url: this.url(),
          success: function() {
            model.set(data);
            return options.success();
          },
          dataType: 'json'
        });
      };

      return Polygon;

    })(Backbone.Model);
  });

}).call(this);
