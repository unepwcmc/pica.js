
Pica.Views.NewCircleView = (function() {

  function NewCircleView(options) {
    var _this = this;
    if (options.callbacks != null) {
      this.successCallback = options.callbacks.success;
      this.errorCallback = options.callbacks.error;
    }
    this.polygon = options.polygon;
    this.polygon.set('geometry', {
      type: 'Circle'
    });
    this.polygonDraw = new L.Circle.Draw(Pica.config.map, {});
    this.polygonDraw.enable();
    Pica.config.map.on('draw:circle-created', function(e) {
      return _this.createPolygon(e.circ);
    });
  }

  NewCircleView.prototype.createPolygon = function(mapCircle) {
    var _this = this;
    this.polygon.setGeomFromCircle(mapCircle.getLatLng(), mapCircle.getRadius());
    return this.polygon.save({
      success: function() {
        _this.close();
        if (_this.successCallback != null) {
          return _this.successCallback();
        }
      },
      error: function(xhr, textStatus, errorThrown) {
        _this.close();
        if (_this.errorCallback != null) {
          return _this.errorCallback.apply(_this, arguments);
        }
      }
    });
  };

  NewCircleView.prototype.close = function() {
    this.polygonDraw.disable();
    return Pica.config.map.off('draw:poly-created');
  };

  return NewCircleView;

})();
