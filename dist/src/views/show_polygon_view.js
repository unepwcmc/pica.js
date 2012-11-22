var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Pica.Views.ShowAreaPolygonsView = (function() {

  function ShowAreaPolygonsView(options) {
    this.render = __bind(this.render, this);
    this.area = options.area;
    this.mapPolygons = [];
    this.area.on('sync', this.render);
    this.render();
  }

  ShowAreaPolygonsView.prototype.render = function() {
    var mapPolygon, polygon, _i, _len, _ref, _results;
    _ref = this.area.polygons;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      polygon = _ref[_i];
      mapPolygon = new L.Polygon(polygon.geomAsLatLngArray()).addTo(Pica.config.map);
      _results.push(this.mapPolygons.push(mapPolygon));
    }
    return _results;
  };

  return ShowAreaPolygonsView;

})();
