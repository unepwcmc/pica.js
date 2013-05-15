(function() {
  define([], function() {
    var PicaViewsNewPolygonView;

    return PicaViewsNewPolygonView = (function() {
      function PicaViewsNewPolygonView(options) {
        var _this = this;

        this.options = options;
        if (this.options.callbacks != null) {
          this.successCallback = this.options.callbacks.success;
          this.errorCallback = this.options.callbacks.error;
        }
        this.polygon = this.options.polygon;
        this.polygonDraw = new L.Polygon.Draw(this.options.map, {});
        this.polygonDraw.enable();
        this.options.map.on('draw:poly-created', function(e) {
          var mapPolygon;

          mapPolygon = e.poly;
          return _this.createPolygon(mapPolygon);
        });
      }

      PicaViewsNewPolygonView.prototype.createPolygon = function(mapPolygon) {
        var _this = this;

        this.polygon.setGeomFromPoints(mapPolygon.getLatLngs());
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

      PicaViewsNewPolygonView.prototype.close = function() {
        this.polygonDraw.disable();
        return this.options.map.off('draw:poly-created');
      };

      return PicaViewsNewPolygonView;

    })();
  });

}).call(this);
