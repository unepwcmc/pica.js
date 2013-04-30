describe 'Pica.Models.Workspace', ->
  describe '.constructor', ->
    describe 'when given a pica application', ->
      pica = workspace = null
      before ->
        pica = {config: "I'm only a mock!"}
        workspace = new Pica.Models.Workspace(pica)
        
      it 'stores a references to the given pica application', ->
        expect(workspace.app).to.equal(pica)

    describe 'when not given a pica application', ->
      it 'throws an error', ->
        expect(->
          new Pica.Models.Workspace()
        ).to.throwException((e)->
          expect(e).to.be.equal('Cannot create a Pica.Model without specifying a Pica.Application')
        )

  describe '.save', ->
    success = error = syncing = finishedSync = server = pica = magpieServer = null

    before ->
      magpieServer = new window.TestHelpers.FakeMagpieServer()
      pica = window.TestHelpers.buildPicaApplication()

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
      expect(magpieServer.hasReceivedRequest('workspaceSave')).to.be.ok()
    )

    describe 'when the server responds with a workspace id', ->
      before ->
        magpieServer.respondTo('workspaceSave')

      it "assigns the workspace an id", ->
        expect(pica.currentWorkspace.get('id')).to.be.a('number')

      it 'calls the success callback', ->
        expect(success.calledOnce).to.equal(true)

      it 'does not call the error callback', ->
        expect(error.calledOnce).to.equal(false)

    after ->
      magpieServer.server.restore()

