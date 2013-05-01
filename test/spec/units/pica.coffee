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


  describe '.notifySyncStarted', ->
    describe 'called with no syncsInProgress', ->
      pica = syncStartedListener = null
      before ->
        magpieServer = new window.TestHelpers.FakeMagpieServer()
        pica = window.TestHelpers.buildPicaApplication()

        syncStartedListener = sinon.spy()
        pica.on('syncStarted', syncStartedListener)

        pica.notifySyncStarted()

      it 'fires the syncStarted event', ->
        expect(syncStartedListener.calledOnce).to.be.ok()

      it 'increments syncsInProgress', ->
        expect(pica.syncsInProgress).to.equal(1)

    describe 'when syncsInProgress > 0 and it is called', ->
      pica = syncStartedListener = null
      before ->
        magpieServer = new window.TestHelpers.FakeMagpieServer()
        pica = window.TestHelpers.buildPicaApplication()
        pica.syncsInProgress = 1

        syncStartedListener = sinon.spy()
        pica.on('syncStarted', syncStartedListener)

        pica.notifySyncStarted()

      it 'does not fire the syncStarted again', ->
        expect(syncStartedListener.calledOnce).not.to.be.ok()

      it 'increments syncsInProgress', ->
        expect(pica.syncsInProgress).to.equal(2)

  describe '.notifySyncFinished', ->
    describe 'called when 1 syncsInProgress', ->
      pica = syncFinishedListener = null
      before ->
        magpieServer = new window.TestHelpers.FakeMagpieServer()
        pica = window.TestHelpers.buildPicaApplication()
        pica.syncsInProgress = 1

        syncFinishedListener = sinon.spy()
        pica.on('syncFinished', syncFinishedListener)

        pica.notifySyncFinished()

      it 'decrements syncsInProgress', ->
        expect(pica.syncsInProgress).to.equal(0)

      it 'fires the syncFinished event', ->
        expect(syncFinishedListener.calledOnce).to.be.ok()

    describe 'called when 2 syncsInProgress', ->
      pica = syncFinishedListener = null
      before ->
        magpieServer = new window.TestHelpers.FakeMagpieServer()
        pica = window.TestHelpers.buildPicaApplication()
        pica.syncsInProgress = 2

        syncFinishedListener = sinon.spy()
        pica.on('syncFinished', syncFinishedListener)

        pica.notifySyncFinished()

      it 'decrements syncsInProgress', ->
        expect(pica.syncsInProgress).to.equal(1)

      it 'does not fire the syncFinished event', ->
        expect(syncFinishedListener.calledOnce).not.to.be.ok()

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
