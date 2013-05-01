(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Pica.Views.ShowLayersView = (function() {
    function ShowLayersView(options) {
      this.removeTileLayers = __bind(this.removeTileLayers, this);
      this.render = __bind(this.render, this);      this.app = options.app;
      this.app.on('sync', this.render);
      this.tileLayers = {};
      this.layerControl = false;
    }

    ShowLayersView.prototype.render = function() {
      var layer, tileLayer, _i, _len, _ref;

      this.removeTileLayers();
      this.removeLayerControl();
      _ref = this.app.layers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        layer = _ref[_i];
        tileLayer = L.tileLayer(layer.tile_url);
        this.tileLayers[layer.display_name] = tileLayer;
        if (!this.app.config.delegateLayerControl) {
          tileLayer.addTo(this.app.config.map);
        }
      }
      if (this.app.config.delegateLayerControl) {
        return this.layerControl = this.renderLayerControl(this.app.config.map);
      }
    };

    ShowLayersView.prototype.renderLayerControl = function(map) {
      var extraOverlays, layers;

      extraOverlays = this.app.config.extraOverlays || {};
      layers = $.extend(this.tileLayers, extraOverlays);
      this.showFirstOverlay(layers, map);
      return L.control.layers({}, layers).addTo(map);
    };

    ShowLayersView.prototype.showFirstOverlay = function(layers, map) {
      var layer, name;

      for (name in layers) {
        layer = layers[name];
        layer.addTo(map);
        return;
      }
    };

    ShowLayersView.prototype.removeTileLayers = function() {
      var name, tileLayer, _ref, _results;

      _ref = this.tileLayers;
      _results = [];
      for (name in _ref) {
        tileLayer = _ref[name];
        _results.push(this.app.map.removeLayer(tileLayer));
      }
      return _results;
    };

    ShowLayersView.prototype.removeLayerControl = function() {
      var _ref;

      return (_ref = this.layerControl) != null ? _ref.removeFrom(this.app.map) : void 0;
    };

    ShowLayersView.prototype.close = function() {
      this.removeTileLayers();
      this.removeLayerControl();
      return this.app.off('sync', this.render);
    };

    return ShowLayersView;

  })();

}).call(this);
