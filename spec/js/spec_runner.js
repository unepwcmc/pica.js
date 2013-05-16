(function() {
  requirejs.config({
    baseUrl: "../js",
    paths: {
      jquery: "../vendor/jquery/jquery",
      jQueryXDomainRequest: "../vendor/jQuery.XDomainRequest/index",
      leaflet: "../vendor/leaflet/dist/leaflet",
      leaflet_draw: "../vendor/leaflet.draw/index",
      almond: "../node_modules/grunt-requirejs/node_modules/almond/almond",
      pica: "pica",
      chai: "../vendor/chai/chai",
      sinonChai: "../vendor/sinon-chai/lib/sinon-chai",
      sinon: "../vendor/sinon/index",
      mocha: "../vendor/mocha/mocha",
      main_spec: "../spec/js/main",
      specHelpers: "../spec/js/spec_helpers",
      specData: "../spec/js/spec_data",
      workspaceSpec: "../spec/js/pica/units/workspace",
      areaSpec: "../spec/js/pica/units/area",
      picaSpec: "../spec/js/pica/units/pica",
      polygonSpec: "../spec/js/pica/units/polygon",
      showLayerViewSpec: "../spec/js/pica/views/show_layer_view",
      uploadFileViewSpec: "../spec/js/pica/views/upload_file_view"
    },
    shim: {
      jQueryXDomainRequest: {
        exports: "jquery"
      },
      leaflet: {
        exports: "L"
      },
      leaflet_draw: {
        deps: ["leaflet"],
        exports: "L"
      },
      sinon: {
        exports: "sinon"
      },
      mocha: {
        init: function() {
          mocha.setup("bdd");
          return mocha;
        }
      }
    }
  }, requirejs(["main_spec"]));

}).call(this);
