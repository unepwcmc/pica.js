describe "Pica.Views.ShowLayersView", ->

  describe "Leaflet Layer Control is delegated to Pica", ->
    spyRenderLayerControl = magpieServer = undefined
    
    before ->
      magpieServer = new TestHelpers.FakeMagpieServer()

    beforeEach ->
      spyRenderLayerControl = sinon.spy(
        Pica.Views.ShowLayersView.prototype, 'renderLayerControl')

    afterEach ->
      spyRenderLayerControl.restore()

    after ->
      magpieServer.server.restore()


    it "calls renderLayerControl once with delegateLayerControl option set to true",  ->
      pica = TestHelpers.buildPicaApplication {delegateLayerControl: yes}
      magpieServer.respondTo('projectIndex')
      expect(spyRenderLayerControl.calledOnce).to.equal true


    it "does not call renderLayerControl without the delegateLayerControl option",  ->
      pica = TestHelpers.buildPicaApplication()
      magpieServer.respondTo('projectIndex')
      expect(spyRenderLayerControl.calledOnce).to.equal false

    