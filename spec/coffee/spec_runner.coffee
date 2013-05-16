
requirejs.config

  baseUrl: "../js"
  
  # Specify dependency libraries
  paths:
    jquery: "../vendor/jquery/jquery"
    jQueryXDomainRequest: "../vendor/jQuery.XDomainRequest/index"
    leaflet: "../vendor/leaflet/dist/leaflet"
    leaflet_draw: "../vendor/leaflet.draw/index"
    almond: "../node_modules/grunt-requirejs/node_modules/almond/almond"
    pica: "pica"

    # Spec paths
    chai: "../vendor/chai/chai"
    sinonChai: "../vendor/sinon-chai/lib/sinon-chai"
    sinon: "../vendor/sinon/index"
    mocha: "../vendor/mocha/mocha"
    main_spec: "../spec/js/main"
    specHelpers: "../spec/js/spec_helpers"
    specData: "../spec/js/spec_data"
    workspaceSpec: "../spec/js/pica/units/workspace"
    areaSpec: "../spec/js/pica/units/area"
    picaSpec: "../spec/js/pica/units/pica"
    polygonSpec: "../spec/js/pica/units/polygon"
    showLayerViewSpec: "../spec/js/pica/views/show_layer_view"
    uploadFileViewSpec: "../spec/js/pica/views/upload_file_view"


  # Not AMD-capable per default,
  # so we need to use the AMD wrapping of RequireJS.
  shim:
    jQueryXDomainRequest:
      exports: "jquery"

    # Leaflet has added AMD compatibility with this commit:
    # https://github.com/Leaflet/Leaflet/commit/323245ffc356683914f63fb9b70f6fe8627cdc69
    leaflet:
      exports: "L"

    leaflet_draw:
      deps: ["leaflet"]
      exports: "L"

    # Spec shims
    sinon:
      exports: "sinon"

    mocha:
      init: ->
        mocha.setup "bdd"
        mocha


  requirejs ["main_spec"]