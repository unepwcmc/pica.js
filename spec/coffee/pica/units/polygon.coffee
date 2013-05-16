define [
  "sinon"
  "chai"
  "sinonChai"
  "mocha"
  "specHelpers"
  "models/polygon"
], (sinon, chai, sinonChai, mocha, testHelpers, PicaModelsPolygon) ->
  'use strict'

  should = chai.should()

  describe 'Pica.Models.Polygon', ->
    describe '.constructor', ->
      describe 'when given a pica application', ->
        pica = polygon = null
        before ->
          pica = {config: "I'm only a mock!"}
          polygon = new PicaModelsPolygon(pica)
          
        it 'stores a references to the given pica application', ->
          polygon.app.should.equal pica
  
      describe 'when not given a pica application', ->
        it 'throws an error', ->
          (-> new PicaModelsPolygon()).should
            .throw "Cannot create a PicaModel without specifying a PicaApplication"
  
    describe 'saving a new polygon', ->
  
      success = error = server = pica = magpieServer = null
  
      before ->
        magpieServer = new testHelpers.FakeMagpieServer()
        # When we create a new pica application, we make a first ajax
        # request ( calling @fetch ).
        pica = testHelpers.buildPicaApplication()
        # At this point `magpieServer.server.requests.length == 1`
        pica.newWorkspace()
        # Forcing a response from our fake magpie server.
        # This also `pops` the request from the `magpieServer.requests array.
        magpieServer.respondTo('projectIndex')
        # At this point `magpieServer.server.requests.length == 0`
        success = sinon.spy()
        error = sinon.spy()
        currentArea = pica.currentWorkspace.currentArea
        currentArea.createPolygon()
        currentArea.currentPolygon.save(
          success: success
          error: error
        )
      
      after ->
        # We need to restore the server or it will interfere with tests
        # in different modules.
        magpieServer.server.restore()
  
      it 'sends a workspace save request to magpie', ->
        magpieServer.hasReceivedRequest('workspaceSave').should.be.ok
  
      it 'receives 1 request', ->
        magpieServer.server.requests.length.should.equal 1
  
      describe 'when magpie responds with a workspace id', ->
      
        before ->
          magpieServer.respondTo('workspaceSave')
      
        it 'saves the parent workspace and sets the area.workspace_id attribute', ->
          pica.currentWorkspace.get('id').should.be.a 'number'
      
        it 'should send an area save request to magpie', ->
          magpieServer.hasReceivedRequest('areaSave').should.be.ok
  
      
        describe 'when magpie responds with an area id', ->
      
          before ->
            magpieServer.respondTo('areaSave')
      
          it 'sets the polygon.area_id attribute', ->
            pica.currentWorkspace.currentArea.currentPolygon.get('area_id')
              .should.equal pica.currentWorkspace.currentArea.get('id')
  
          it 'saves the area', ->
            pica.currentWorkspace.currentArea.get('id').should.be.a 'number'
  
          it 'should send polygon save request to magpie', ->
            magpieServer.hasReceivedRequest('polygonSave').should.be.ok
  
          describe 'when magpie responds with an area id', ->
  
            before ->
              magpieServer.respondTo('polygonSave')
  
            it 'saves the polygon', ->
              pica.currentWorkspace.currentArea.currentPolygon.get('id')
                .should.be.a 'number'
  
            it 'calls the success callback', ->
              success.calledOnce.should.equal true
  
            it 'does not call the error callback', ->
              error.calledOnce.should.equal false
  