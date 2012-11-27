var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Pica.Models.Polygon = (function(_super) {

  __extends(Polygon, _super);

  function Polygon(options) {
    if (options == null) {
      options = {};
    }
    this.save = __bind(this.save, this);

    this.attributes = options.attributes != null ? options.attributes : {};
  }

  Polygon.prototype.isComplete = function() {
    return this.get('geometry') != null;
  };

  Polygon.prototype.setGeomFromPoints = function(points) {
    var point;
    points = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = points.length; _i < _len; _i++) {
        point = points[_i];
        _results.push([point.lng, point.lat]);
      }
      return _results;
    })();
    points.push(points[0]);
    return this.set('geometry', [[points]]);
  };

  Polygon.prototype.geomAsLatLngArray = function() {
    var latLngs, point, _i, _len, _ref;
    latLngs = [];
    if (this.isComplete()) {
      _ref = this.get('geometry')[0][0];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        point = _ref[_i];
        latLngs.push(new L.LatLng(point[1], point[0]));
      }
    }
    return latLngs;
  };

  Polygon.prototype.url = function() {
    return {
      read: "" + Pica.config.magpieUrl + "/polygons/" + (this.get('id')),
      create: "" + Pica.config.magpieUrl + "/areas_of_interest/" + (this.get('area_id')) + "/polygons"
    };
  };

  Polygon.prototype.save = function(options) {
    var _this = this;
    options || (options = {});
    if (this.get('area_id') != null) {
      return Polygon.__super__.save.call(this, options);
    } else {
      return this.trigger('requestAreaId', {
        success: function(area, textStatus, jqXHR) {
          var successCallback;
          _this.set('area_id', area.get('id'));
          if (_this.get('area_id')) {
            successCallback = options.success;
            return _this.save(options);
          } else {
            if (options.error != null) {
              return options.error(_this, {
                error: "Could not save area, so cannot save polygon"
              }, jqXHR);
            }
          }
        },
        error: function(error) {
          console.log("Unable to save polygon:");
          return console.log(error);
        }
      });
    }
  };

  return Polygon;

})(Pica.Model);
