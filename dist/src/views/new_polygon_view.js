
Pica.Views.NewPolygonView = (function() {

  function NewPolygonView(options) {
    var _this = this;
    if (options.callbacks != null) {
      this.successCallback = options.callbacks.success;
      this.errorCallback = options.callbacks.error;
    }
    this.polygon = options.polygon;
    this.polygonDraw = new L.Polygon.Draw(Pica.config.map, {});
    this.polygonDraw.enable();
    Pica.config.map.on('draw:poly-created', function(e) {
      var mapPolygon;
      mapPolygon = e.poly;
      return _this.createPolygon(mapPolygon);
    });
  }

  NewPolygonView.prototype.createPolygon = function(mapPolygon) {
    var _this = this;
    this.polygon.setGeomFromPoints(mapPolygon.getLatLngs());
    return this.polygon.save({
      success: function() {
        _this.close();
        if (typeof successCallback !== "undefined" && successCallback !== null) {
          return _this.successCallback();
        }
      }
    }, {
      error: function(error) {
        _this.close();
        if (typeof errorCallback !== "undefined" && errorCallback !== null) {
          return _this.errorCallback();
        }
      }
    });
  };

  NewPolygonView.prototype.close = function() {
    this.polygonDraw.disable();
    return Pica.config.map.off('draw:poly-created');
  };

  return NewPolygonView;

})();
