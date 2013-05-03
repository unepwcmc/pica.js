(function() {
  describe("Pica.Views.ShowLayersView", function() {
    return describe("Leaflet Layer Control is delegated to Pica", function() {
      var magpieServer, spyRenderLayerControl;

      spyRenderLayerControl = magpieServer = void 0;
      before(function() {
        var pica;

        spyRenderLayerControl = sinon.spy(Pica.Views.ShowLayersView.prototype, 'renderLayerControl');
        magpieServer = new TestHelpers.FakeMagpieServer();
        return pica = TestHelpers.buildPicaApplication({
          delegateLayerControl: true
        });
      });
      after(function() {
        return magpieServer.server.restore();
      });
      return it("renderLayerControl is called once", function() {
        magpieServer.respondTo('projectIndex');
        return expect(spyRenderLayerControl.calledOnce).to.equal(true);
      });
    });
  });

}).call(this);
