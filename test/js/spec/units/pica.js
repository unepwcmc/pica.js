(function() {
  describe('Pica.Application', function() {
    describe('.createWorkspace', function() {
      var magpieServer, pica;

      pica = magpieServer = null;
      before(function() {
        magpieServer = new window.TestHelpers.FakeMagpieServer();
        pica = window.TestHelpers.buildPicaApplication();
        return pica.newWorkspace();
      });
      after(function() {
        return magpieServer.server.restore();
      });
      it('creates a new workspace at .currentWorkspace', function() {
        if (pica.currentWorkspace.constructor.name != null) {
          return expect(pica.currentWorkspace.constructor.name).to.equal('Workspace');
        } else {
          return expect(pica.currentWorkspace).to.not.equal(null);
        }
      });
      return it('gives the new workspace a references to itself in .currentWorkspace.app', function() {
        return expect(pica.currentWorkspace.app).to.equal(pica);
      });
    });
    describe('.notifySyncStarted', function() {
      describe('called with no syncsInProgress', function() {
        var pica, syncStartedListener;

        pica = syncStartedListener = null;
        before(function() {
          var magpieServer;

          magpieServer = new window.TestHelpers.FakeMagpieServer();
          pica = window.TestHelpers.buildPicaApplication();
          syncStartedListener = sinon.spy();
          pica.on('syncStarted', syncStartedListener);
          return pica.notifySyncStarted();
        });
        it('fires the syncStarted event', function() {
          return expect(syncStartedListener.calledOnce).to.be.ok();
        });
        return it('increments syncsInProgress', function() {
          return expect(pica.syncsInProgress).to.equal(1);
        });
      });
      return describe('when syncsInProgress > 0 and it is called', function() {
        var pica, syncStartedListener;

        pica = syncStartedListener = null;
        before(function() {
          var magpieServer;

          magpieServer = new window.TestHelpers.FakeMagpieServer();
          pica = window.TestHelpers.buildPicaApplication();
          pica.syncsInProgress = 1;
          syncStartedListener = sinon.spy();
          pica.on('syncStarted', syncStartedListener);
          return pica.notifySyncStarted();
        });
        it('does not fire the syncStarted again', function() {
          return expect(syncStartedListener.calledOnce).not.to.be.ok();
        });
        return it('increments syncsInProgress', function() {
          return expect(pica.syncsInProgress).to.equal(2);
        });
      });
    });
    return describe('.notifySyncFinished', function() {
      describe('called when 1 syncsInProgress', function() {
        var pica, syncFinishedListener;

        pica = syncFinishedListener = null;
        before(function() {
          var magpieServer;

          magpieServer = new window.TestHelpers.FakeMagpieServer();
          pica = window.TestHelpers.buildPicaApplication();
          pica.syncsInProgress = 1;
          syncFinishedListener = sinon.spy();
          pica.on('syncFinished', syncFinishedListener);
          return pica.notifySyncFinished();
        });
        it('decrements syncsInProgress', function() {
          return expect(pica.syncsInProgress).to.equal(0);
        });
        return it('fires the syncFinished event', function() {
          return expect(syncFinishedListener.calledOnce).to.be.ok();
        });
      });
      return describe('called when 2 syncsInProgress', function() {
        var pica, syncFinishedListener;

        pica = syncFinishedListener = null;
        before(function() {
          var magpieServer;

          magpieServer = new window.TestHelpers.FakeMagpieServer();
          pica = window.TestHelpers.buildPicaApplication();
          pica.syncsInProgress = 2;
          syncFinishedListener = sinon.spy();
          pica.on('syncFinished', syncFinishedListener);
          return pica.notifySyncFinished();
        });
        it('decrements syncsInProgress', function() {
          return expect(pica.syncsInProgress).to.equal(1);
        });
        return it('does not fire the syncFinished event', function() {
          return expect(syncFinishedListener.calledOnce).not.to.be.ok();
        });
      });
    });
  });

  /*
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
  */


}).call(this);
