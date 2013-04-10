(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Pica.Views.ShowLayersView = (function() {
    function ShowLayersView(options) {
      this.removeTileLayers = __bind(this.removeTileLayers, this);
      this.render = __bind(this.render, this);      this.app = options.app;
      this.app.on('sync', this.render);
      this.tileLayers = [];
      this.render();
    }

    ShowLayersView.prototype.render = function() {
      var layer, tileLayer, _i, _len, _ref, _results;

      this.removeTileLayers();
      _ref = this.app.layers;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        layer = _ref[_i];
        tileLayer = new L.TileLayer(layer.tile_url);
        this.tileLayers.push(tileLayer);
        _results.push(tileLayer.addTo(this.app.config.map));
      }
      return _results;
    };

    ShowLayersView.prototype.removeTileLayers = function() {
      var tileLayer, _i, _len, _ref, _results;

      _ref = this.tileLayers;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tileLayer = _ref[_i];
        _results.push(this.app.map.removeLayer(tileLayer));
      }
      return _results;
    };

    ShowLayersView.prototype.close = function() {
      this.removeTileLayers();
      return this.app.off('sync', this.render);
    };

    return ShowLayersView;

  })();

}).call(this);
