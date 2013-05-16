define [
  "sinon"
  "chai"
  "sinonChai"
  "mocha"
  "specHelpers"
  "models/workspace"
], (sinon, chai, sinonChai, mocha, testHelpers, PicaModelsWorkspace) ->
  'use strict'

  should = chai.should()

  describe 'PicaModelsWorkspace', ->
    describe '.constructor', ->
      describe 'when given a pica application', ->
        pica = workspace = null
        before ->
          pica = {config: "I'm only a mock!"}
          workspace = new PicaModelsWorkspace(pica)
          
        it 'stores a references to the given pica application', ->
          workspace.app.should.be.equal(pica)
  
      describe 'when not given a pica application', ->
        it 'throws an error', ->
          (-> new PicaModelsWorkspace()).should
            .throw "Cannot create a PicaModel without specifying a PicaApplication"
          
  
    describe '.save', ->
      success = error = syncing = finishedSync = server = pica = magpieServer = null
  
      before ->
        magpieServer = new testHelpers.FakeMagpieServer()
        pica = testHelpers.buildPicaApplication()
  
        pica.newWorkspace()
        magpieServer.respondTo('projectIndex')
  
        success = sinon.spy()
        error = sinon.spy()
  
        pica.on('syncing', syncing)
        pica.on('finishedSync', finishedSync)
  
        # Here a new request is getting fired.
        # See Pica.Model.sync in pica_model.js.coffee
        pica.currentWorkspace.save(
          success: success
          error: error
        )
  
  
      it('sends a workspace save request to magpie', ->
        magpieServer.hasReceivedRequest('workspaceSave').should.be.ok
      )
  
      describe 'when the server responds with a workspace id', ->
        before ->
          magpieServer.respondTo('workspaceSave')
  
        it "assigns the workspace an id", ->
          pica.currentWorkspace.get('id').should.be.a('number')
  
        it 'calls the success callback', ->
          success.calledOnce.should.equal(true)
  
        it 'does not call the error callback', ->
          error.calledOnce.should.equal(false)
  
      after ->
        magpieServer.server.restore()
  
  