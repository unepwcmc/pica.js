var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Pica.Views.ShowAreaPolygonsView = (function(_super) {

  __extends(ShowAreaPolygonsView, _super);

  function ShowAreaPolygonsView(options) {
    this.triggerPolyClick = __bind(this.triggerPolyClick, this);

    this.render = __bind(this.render, this);
    this.area = options.area;
    this.mapPolygons = [];
    this.area.on('sync', this.render);
    this.render();
  }

  ShowAreaPolygonsView.prototype.render = function() {
    var mapPolygon, polygon, _i, _len, _ref, _results,
      _this = this;
    this.removeAllPolygonsAndBindings();
    console.log("Going to render these polys on the map:");
    console.log(this.area.polygons);
    _ref = this.area.polygons;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      polygon = _ref[_i];
      if (!polygon.isComplete()) {
        continue;
      }
      mapPolygon = new L.Polygon(polygon.geomAsLatLngArray()).addTo(Pica.config.map);
      mapPolygon.on('click', (function() {
        var thatMapPolygon, thatPolygon;
        thatPolygon = polygon;
        thatMapPolygon = mapPolygon;
        return function(event) {
          return _this.triggerPolyClick(thatPolygon, event, thatMapPolygon);
        };
      })());
      polygon.on('delete', (function() {
        var thatMapPolygon;
        thatMapPolygon = mapPolygon;
        return function() {
          return _this.removeMapPolygonAndBindings(thatMapPolygon);
        };
      })());
      _results.push(this.mapPolygons.push(mapPolygon));
    }
    return _results;
  };

  ShowAreaPolygonsView.prototype.close = function() {
    return this.removeAllPolygonsAndBindings();
  };

  ShowAreaPolygonsView.prototype.removeAllPolygonsAndBindings = function() {
    var mapPolygon, _results;
    _results = [];
    while (mapPolygon = this.mapPolygons.shift()) {
      _results.push(this.removeMapPolygonAndBindings(mapPolygon));
    }
    return _results;
  };

  ShowAreaPolygonsView.prototype.removeMapPolygonAndBindings = function(mapPolygon) {
    mapPolygon.off('click', this.triggerPolyClicked);
    return Pica.config.map.removeLayer(mapPolygon);
  };

  ShowAreaPolygonsView.prototype.triggerPolyClick = function(polygon, event, mapPolygon) {
    return this.trigger('polygonClick', [polygon, event, mapPolygon]);
  };

  return ShowAreaPolygonsView;

})(Pica.Events);
