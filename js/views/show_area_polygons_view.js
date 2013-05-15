(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["lib/pica_event"], function(PicaEvents) {
    var PicaViewsShowAreaPolygonsView;

    return PicaViewsShowAreaPolygonsView = (function(_super) {
      __extends(PicaViewsShowAreaPolygonsView, _super);

      function PicaViewsShowAreaPolygonsView(options) {
        this.options = options;
        this.triggerPolyClick = __bind(this.triggerPolyClick, this);
        this.addPolygon = __bind(this.addPolygon, this);
        this.render = __bind(this.render, this);
        this.area = this.options.area;
        this.polysObserved = [];
        this.mapPolygons = [];
        this.area.on('sync', this.render);
        this.area.on('addedPolygon', this.addPolygon);
        this.render();
      }

      PicaViewsShowAreaPolygonsView.prototype.render = function() {
        var mapPolygon, newObject, polygon, _i, _len, _ref, _results,
          _this = this;

        this.removeAllPolygonsAndBindings();
        _ref = this.area.polygons;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          polygon = _ref[_i];
          if (!polygon.isComplete()) {
            continue;
          }
          newObject = function(theConstructor, args) {
            var Wrapper;

            Wrapper = function(args) {
              return theConstructor.apply(this, args);
            };
            Wrapper.prototype = theConstructor.prototype;
            return new Wrapper(args);
          };
          mapPolygon = newObject(L[polygon.get('geometry').type], polygon.asLeafletArguments()).addTo(this.options.map);
          polygon.on('delete', (function() {
            var thatMapPolygon;

            thatMapPolygon = mapPolygon;
            return function() {
              return _this.removeMapPolygonAndBindings(thatMapPolygon);
            };
          })());
          mapPolygon.on('click', (function() {
            var thatMapPolygon, thatPolygon;

            thatPolygon = polygon;
            thatMapPolygon = mapPolygon;
            return function(event) {
              return _this.triggerPolyClick(thatPolygon, event, thatMapPolygon);
            };
          })());
          _results.push(this.mapPolygons.push(mapPolygon));
        }
        return _results;
      };

      PicaViewsShowAreaPolygonsView.prototype.addPolygon = function(polygon) {
        polygon.on('change', this.render);
        return this.polysObserved.push(polygon);
      };

      PicaViewsShowAreaPolygonsView.prototype.close = function() {
        var polygon, _i, _len, _ref, _results;

        this.removeAllPolygonsAndBindings();
        this.area.off('sync', this.render);
        this.area.off('addedPolygon', this.addPolygon);
        _ref = this.polysObserved;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          polygon = _ref[_i];
          _results.push(polygon.off('change', this.render));
        }
        return _results;
      };

      PicaViewsShowAreaPolygonsView.prototype.removeAllPolygonsAndBindings = function() {
        var mapPolygon, _results;

        _results = [];
        while (mapPolygon = this.mapPolygons.shift()) {
          _results.push(this.removeMapPolygonAndBindings(mapPolygon));
        }
        return _results;
      };

      PicaViewsShowAreaPolygonsView.prototype.removeMapPolygonAndBindings = function(mapPolygon) {
        mapPolygon.off('click', this.triggerPolyClicked);
        return this.options.map.removeLayer(mapPolygon);
      };

      PicaViewsShowAreaPolygonsView.prototype.triggerPolyClick = function(polygon, event, mapPolygon) {
        return this.trigger('polygonClick', [polygon, event, mapPolygon]);
      };

      return PicaViewsShowAreaPolygonsView;

    })(PicaEvents);
  });

}).call(this);
