var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Pica.Views.ShowAreaPolygonsView = (function(_super) {

  __extends(ShowAreaPolygonsView, _super);

  function ShowAreaPolygonsView(options) {
    this.triggerPolyClick = __bind(this.triggerPolyClick, this);

    this.addPolygon = __bind(this.addPolygon, this);

    this.render = __bind(this.render, this);
    this.area = options.area;
    this.polysObserved = [];
    this.mapPolygons = [];
    this.area.on('sync', this.render);
    this.area.on('addedPolygon', this.addPolygon);
    this.render();
  }

  ShowAreaPolygonsView.prototype.render = function() {
    var mapPolygon, polygon, _i, _len, _ref, _results,
      _this = this;
    this.removeAllPolygonsAndBindings();
    _ref = this.area.polygons;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      polygon = _ref[_i];
      if (!polygon.isComplete()) {
        continue;
      }
      mapPolygon = new L.Polygon(polygon.geomAsLatLngArray()).addTo(Pica.config.map);
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

  ShowAreaPolygonsView.prototype.addPolygon = function(polygon) {
    polygon.on('change', this.render);
    return this.polysObserved.push(polygon);
  };

  ShowAreaPolygonsView.prototype.close = function() {
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
