(function() {
  requirejs.config({
    paths: {
      jquery: "../vendor/jquery/jquery",
      jQueryXDomainRequest: "../vendor/jQuery.XDomainRequest/index",
      leaflet: "../vendor/leaflet/dist/leaflet",
      leaflet_draw: "../vendor/leaflet.draw/index",
      almond: "../node_modules/grunt-requirejs/node_modules/almond/almond",
      pica: "pica"
    },
    shim: {
      jQueryXDomainRequest: {
        exports: "jquery"
      },
      leaflet_draw: {
        deps: ["leaflet"],
        exports: "L"
      }
    },
    name: "almond",
    include: ["pica"],
    wrap: {
      startFile: "../wrap/start.frag",
      endFile: "../wrap/end.frag"
    }
  });

}).call(this);
