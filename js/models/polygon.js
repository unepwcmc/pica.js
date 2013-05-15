(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["lib/pica_model"], function(PicaModel) {
    var PicaModelsPolygon;

    return PicaModelsPolygon = (function(_super) {
      __extends(PicaModelsPolygon, _super);

      function PicaModelsPolygon(app, options) {
        var _base;

        this.app = app;
        if (options == null) {
          options = {};
        }
        this.save = __bind(this.save, this);
        this.throwIfNoApp();
        this.attributes = options.attributes != null ? options.attributes : {};
        (_base = this.attributes)['geometry'] || (_base['geometry'] = {
          type: 'Polygon'
        });
      }

      PicaModelsPolygon.prototype.isComplete = function() {
        return this.get('geometry').coordinates != null;
      };

      PicaModelsPolygon.prototype.setGeomFromPoints = function(points) {
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
        return this.set('geometry', {
          type: 'Polygon',
          coordinates: [points]
        });
      };

      PicaModelsPolygon.prototype.setGeomFromCircle = function(latLng, radius) {
        return this.set('geometry', {
          type: 'Circle',
          coordinates: [latLng.lng, latLng.lat],
          radius: radius
        });
      };

      PicaModelsPolygon.prototype.asLeafletArguments = function() {
        var args, latLngs, point, _i, _len, _ref;

        args = [];
        if (this.get('geometry').type === 'Polygon') {
          latLngs = [];
          if (this.isComplete()) {
            _ref = this.get('geometry').coordinates[0];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              point = _ref[_i];
              latLngs.push(new L.LatLng(point[1], point[0]));
            }
          }
          args.push(latLngs);
        } else {
          if (this.isComplete()) {
            point = this.get('geometry').coordinates;
            args = [new L.LatLng(point[1], point[0]), this.get('geometry').radius];
          } else {
            args = [[], 0];
          }
        }
        return args;
      };

      PicaModelsPolygon.prototype.url = function() {
        var url;

        url = this.app.config.magpieUrl;
        return {
          read: "" + url + "/polygons/" + (this.get('id')) + ".json",
          create: "" + url + "/areas_of_interest/" + (this.get('area_id')) + "/polygons.json"
        };
      };

      PicaModelsPolygon.prototype.save = function(options) {
        var _this = this;

        options || (options = {});
        if (this.get('area_id') != null) {
          return PicaModelsPolygon.__super__.save.call(this, options);
        } else {
          return this.trigger('requestAreaId', {
            success: function(area, textStatus, jqXHR) {
              _this.set('area_id', area.get('id'));
              if (_this.get('area_id')) {
                return _this.save(options);
              } else {
                if (options.error != null) {
                  return options.error(_this, {
                    error: "Unable to get area id, so cannot save polygon"
                  }, jqXHR);
                }
              }
            },
            error: function(jqXHR, textStatus, errorThrown) {
              console.log("Unable to save polygon:");
              console.log(arguments);
              console.log(jqXHR.status);
              console.log(jqXHR.statusText);
              console.log(jqXHR.responseText);
              if (options.error != null) {
                return options.error(jqXHR, textStatus, {
                  error: "Unable to obtain areaId, cannot save polygon",
                  parentError: errorThrown
                });
              }
            }
          });
        }
      };

      return PicaModelsPolygon;

    })(PicaModel);
  });

}).call(this);
