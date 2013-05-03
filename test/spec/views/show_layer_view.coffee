describe "Pica.Views.ShowLayersView", ->

  describe "Leaflet Layer Control is delegated to Pica", ->
    spyRenderLayerControl = magpieServer = undefined
    
    before ->

      spyRenderLayerControl = sinon.spy(
        Pica.Views.ShowLayersView.prototype, 'renderLayerControl')

      magpieServer = new TestHelpers.FakeMagpieServer()
      pica = TestHelpers.buildPicaApplication {delegateLayerControl: yes}


    after ->
      magpieServer.server.restore()


    it "renderLayerControl is called once",  ->
      magpieServer.respondTo('projectIndex')
      expect(spyRenderLayerControl.calledOnce).to.equal true

    