var Pica;

(Pica = function() {
    var api_url = '';

    return {
      start: function(options) {
        L.map(options.map);
      }
    }
}());
