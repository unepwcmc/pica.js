// Generated by CoffeeScript 1.4.0
(function() {

  window.Pica = {
    start: function(options) {
      if (options == null) {
        options = {};
      }
      this.renderMap(options.map);
      return this.renderSidebar(options.sidebar);
    },
    renderMap: function(id) {
      if (id != null) {
        return L.map(id);
      }
    },
    renderSidebar: function(selector) {
      $(selector).append('<a href="#">New Area</a>');
      $(selector).append('<a href="#">or load a saved Area of Interest</a>');
      return $(selector).append('Click on the map to start drawing your first polygon and define an Area Of Interest');
    }
  };

}).call(this);
