(function() {
  define(["sinon", "chai", "sinonChai", "mocha", "specHelpers", "views/show_layers_view"], function(sinon, chai, sinonChai, mocha, testHelpers, ShowLayersView) {
    'use strict';
    var should;

    should = chai.should();
    return describe("Pica.Views.ShowLayersView", function() {
      return describe("Leaflet Layer Control is delegated to Pica", function() {
        var magpieServer, spyRenderLayerControl;

        spyRenderLayerControl = magpieServer = void 0;
        before(function() {
          return magpieServer = new testHelpers.FakeMagpieServer();
        });
        beforeEach(function() {
          return spyRenderLayerControl = sinon.spy(ShowLayersView.prototype, 'renderLayerControl');
        });
        after(function() {
          return magpieServer.server.restore();
        });
        afterEach(function() {
          return spyRenderLayerControl.restore();
        });
        it("calls renderLayerControl once with delegateLayerControl option set to true", function() {
          var pica;

          pica = testHelpers.buildPicaApplication({
            delegateLayerControl: true
          });
          magpieServer.respondTo('projectIndex');
          return spyRenderLayerControl.calledOnce.should.equal(true);
        });
        return it("does not call renderLayerControl without the delegateLayerControl option", function() {
          var pica;

          pica = testHelpers.buildPicaApplication();
          magpieServer.respondTo('projectIndex');
          return spyRenderLayerControl.calledOnce.should.equal(false);
        });
      });
    });
  });

}).call(this);
