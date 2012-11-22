
Pica.Views.ShowPolygonView = (function() {

  function ShowPolygonView(options) {
    this.polygons = options.polygons;
    this.mapPolygons = [];
    this.render();
  }

  ShowPolygonView.prototype.render = function() {
    var mapPolygon, polygon, _i, _len, _ref, _results;
    _ref = this.polygons;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      polygon = _ref[_i];
      mapPolygon = new L.Polygon(polygon.geomAsLatLngArray()).addTo(Pica.config.map);
      _results.push(this.mapPolygons.push(mapPolygon));
    }
    return _results;
  };

  return ShowPolygonView;

})();
