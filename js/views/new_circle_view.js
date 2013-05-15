(function() {
  define([], function() {
    var PicaViewsNewCircleView;

    return PicaViewsNewCircleView = (function() {
      function PicaViewsNewCircleView(options) {
        var _this = this;

        this.options = options;
        if (this.options.callbacks != null) {
          this.successCallback = this.options.callbacks.success;
          this.errorCallback = this.options.callbacks.error;
        }
        this.polygon = this.options.polygon;
        this.polygon.set('geometry', {
          type: 'Circle'
        });
        this.polygonDraw = new L.Circle.Draw(this.options.map, {});
        this.polygonDraw.enable();
        this.options.map.on('draw:circle-created', function(e) {
          return _this.createPolygon(e.circ);
        });
      }

      PicaViewsNewCircleView.prototype.createPolygon = function(mapCircle) {
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

      PicaViewsNewCircleView.prototype.close = function() {
        this.polygonDraw.disable();
        return this.options.map.off('draw:circle-created');
      };

      return PicaViewsNewCircleView;

    })();
  });

}).call(this);
