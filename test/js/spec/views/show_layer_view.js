(function() {
  describe("Pica.Views.ShowLayersView", function() {
    return describe("Leaflet Layer Control is delegated to Pica", function() {
      var magpieServer, spyRenderLayerControl;

      spyRenderLayerControl = magpieServer = void 0;
      before(function() {
        return magpieServer = new TestHelpers.FakeMagpieServer();
      });
      beforeEach(function() {
        return spyRenderLayerControl = sinon.spy(Pica.Views.ShowLayersView.prototype, 'renderLayerControl');
      });
      afterEach(function() {
        return spyRenderLayerControl.restore();
      });
      after(function() {
        return magpieServer.server.restore();
      });
      it("calls renderLayerControl once with delegateLayerControl option set to true", function() {
        var pica;

        pica = TestHelpers.buildPicaApplication({
          delegateLayerControl: true
        });
        magpieServer.respondTo('projectIndex');
        return expect(spyRenderLayerControl.calledOnce).to.equal(true);
      });
      return it("does not call renderLayerControl without the delegateLayerControl option", function() {
        var pica;

        pica = TestHelpers.buildPicaApplication();
        magpieServer.respondTo('projectIndex');
        return expect(spyRenderLayerControl.calledOnce).to.equal(false);
      });
    });
  });

}).call(this);
