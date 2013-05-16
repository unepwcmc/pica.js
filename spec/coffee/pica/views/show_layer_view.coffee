define [
  "sinon"
  "chai"
  "sinonChai"
  "mocha"
  "specHelpers"
  "views/show_layers_view"
], (sinon, chai, sinonChai, mocha, testHelpers, ShowLayersView) ->
  'use strict'

  should = chai.should()

  describe "Pica.Views.ShowLayersView", ->
  
    describe "Leaflet Layer Control is delegated to Pica", ->
      spyRenderLayerControl = magpieServer = undefined
      
      before ->
        magpieServer = new testHelpers.FakeMagpieServer()
  
      beforeEach ->
        spyRenderLayerControl = sinon.spy(
          ShowLayersView.prototype, 'renderLayerControl')
  
      after ->
        magpieServer.server.restore()

      afterEach ->
        spyRenderLayerControl.restore()
  
  
  
      it "calls renderLayerControl once with delegateLayerControl option set to true",  ->
        pica = testHelpers.buildPicaApplication {delegateLayerControl: yes}
        magpieServer.respondTo('projectIndex')
        spyRenderLayerControl.calledOnce.should.equal true
  
  
      it "does not call renderLayerControl without the delegateLayerControl option",  ->
        pica = testHelpers.buildPicaApplication()
        magpieServer.respondTo('projectIndex')
        spyRenderLayerControl.calledOnce.should.equal false

    