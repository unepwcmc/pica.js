describe 'Pica.Application', ->

  describe '.createWorkspace', ->
    pica = magpieServer = null

    before ->
      magpieServer = new window.TestHelpers.FakeMagpieServer()
      pica = window.TestHelpers.buildPicaApplication()

      pica.newWorkspace()

    after ->
      magpieServer.server.restore()

    it 'creates a new workspace at .currentWorkspace', ->
      if pica.currentWorkspace.constructor.name?
        expect(pica.currentWorkspace.constructor.name).to.equal('Workspace')
      else
        # Do a more naive tests in IE, because it's rubbish
        expect(pica.currentWorkspace).to.not.equal(null)

    it 'gives the new workspace a references to itself in .currentWorkspace.app', ->
      expect(pica.currentWorkspace.app).to.equal(pica)

###
  describe 'when saving a workspace', ->
    success = error = syncing = finishedSync = server = pica = magpieServer = null

    before ->
      magpieServer = new window.TestHelpers.FakeMagpieServer()
      pica = window.TestHelpers.buildPicaApplication()

      pica.newWorkspace()
      magpieServer.respondTo('projectIndex')

      syncing = sinon.spy()
      finishedSync = sinon.spy()

      pica.on('syncing', syncing)
      pica.on('finishedSync', finishedSync)

      # Here a new request is getting fired.
      # See Pica.Model.sync in pica_model.js.coffee
      pica.currentWorkspace.save()

    it "fires the 'syncing' event", ->
      expect(syncing.calledOnce).to.equal(true)

    it "doesn't fire the 'finishedSync' event", ->
      expect(finishedSync.calledOnce).to.equal(false)

    describe 'when the server responds with a workspace id', ->
      before ->
        magpieServer.respondTo('workspaceSave')

      it "has fired the 'syncing' event once", ->
        expect(syncing.calledOnce).to.equal(true)

      it "fires the 'finishedSync' event once", ->
        expect(finishedSync.calledOnce).to.equal(true)

    after ->
      magpieServer.server.restore()
###
