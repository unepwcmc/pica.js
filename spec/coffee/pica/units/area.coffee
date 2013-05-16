define [
  "sinon"
  "chai"
  "sinonChai"
  "mocha"
  "specHelpers"
  "models/area"
], (sinon, chai, sinonChai, mocha, testHelpers, PicaModelsArea) ->
  'use strict'

  should = chai.should()

  describe 'PicaModelsArea', ->
    describe '.constructor', ->
      describe 'when given a pica application', ->
        pica = area = null
        before ->
          pica = {config: "I'm only a mock!"}
          area = new PicaModelsArea(pica)
          
        it 'stores a references to the given pica application', ->
          area.app.should.equal pica
  
      describe 'when not given a pica application', ->
        it 'throws an error', ->
          (-> new PicaModelsArea()).should
            .throw "Cannot create a PicaModel without specifying a PicaApplication"
  
    describe '.createPolygon', ->
      area = null
      before ->
        area = new PicaModelsArea({config: "I'm a mock!"})
        area.createPolygon()
  
      it 'creates a new polygon and stores it in .currentPolygon', ->
        area.currentPolygon.should.not.be.a "undefined"
  
    describe '.parse', ->
      it 'creates polygons with correct attributes from the given data.polygons', ->
        area = new PicaModelsArea({config: "I'm a mock!"})
        area.parse(
          polygons:[
            id: 141
          ]
        )
        area.polygons[0].get('id').should.be.equal 141
  
    describe '.save', ->
  
      success = error = server = pica = magpieServer = null
  
      before ->
        magpieServer = new testHelpers.FakeMagpieServer()
        # When we create a new pica application, we make a first ajax
        # request ( calling @fetch ).
        pica = testHelpers.buildPicaApplication()
        pica.newWorkspace()
        # Forcing a response from our fake magpie server.
        # This also `pops` the request from the `magpieServer.requests array.
        magpieServer.respondTo('projectIndex')
        # At this point `magpieServer.server.requests.length == 0`
        success = sinon.spy()
        error = sinon.spy()
        # Here a new request is getting fired.
        # See Pica.Model.sync in pica_model.js.coffee
        pica.currentWorkspace.currentArea.save(
          success: success
          error: error
        )
        # At this point `magpieServer.server.requests.length == 1`
  
      after ->
        # We need to restore the server or it will interfere with tests
        # in different modules.
        magpieServer.server.restore()
  
  
      it('should send a workspace save request to magpie', ->
        magpieServer.hasReceivedRequest('workspaceSave').should.be.ok
      )
  
      describe('when magpie responds with a workspace id', ->
  
        before(->
          magpieServer.respondTo('workspaceSave')
        )
  
        it('saves the parent workspace and sets the area.workspace_id attribute', ->
          pica.currentWorkspace.get('id').should.be.a 'number'
        )
  
        it('should send an area save request to magpie', ->
          magpieServer.hasReceivedRequest('areaSave').should.be.ok
        )
  
        describe('when magpie responds with an area id', ->
  
          before(->
            magpieServer.respondTo('areaSave')
          )
  
          it('sets the area.workspace_id attribute', ->
            pica.currentWorkspace.currentArea.get('workspace_id').should
              .equal pica.currentWorkspace.get('id')
          )
          it('saves the area', ->
            pica.currentWorkspace.currentArea.get('id').should
              .be.a 'number'
          )
          it('calls the success callback', ->
            success.calledOnce.should.equal true
          )
          it('does not call the error callback', ->
            error.calledOnce.should.equal false
          )
        )
      )


