(function() {
  define(["sinon", "chai", "sinonChai", "mocha", "specHelpers"], function(sinon, chai, sinonChai, mocha, testHelpers) {
    'use strict';
    var should;

    should = chai.should();
    return describe('Pica.Application', function() {
      describe('.createWorkspace', function() {
        var magpieServer, pica;

        pica = magpieServer = null;
        before(function() {
          magpieServer = new testHelpers.FakeMagpieServer();
          pica = testHelpers.buildPicaApplication();
          return pica.newWorkspace();
        });
        after(function() {
          return magpieServer.server.restore();
        });
        it('creates a new workspace at .currentWorkspace', function() {
          if (pica.currentWorkspace.constructor.name != null) {
            return pica.currentWorkspace.constructor.name.should.equal('PicaModelsWorkspace');
          } else {
            return pica.currentWorkspace.should.not.equal("null");
          }
        });
        return it('gives the new workspace a references to itself in .currentWorkspace.app', function() {
          return pica.currentWorkspace.app.should.equal(pica);
        });
      });
      describe('.notifySyncStarted', function() {
        describe('called with no syncsInProgress', function() {
          var pica, syncStartedListener;

          pica = syncStartedListener = null;
          before(function() {
            var magpieServer;

            magpieServer = new testHelpers.FakeMagpieServer();
            pica = testHelpers.buildPicaApplication();
            syncStartedListener = sinon.spy();
            pica.on('syncStarted', syncStartedListener);
            return pica.notifySyncStarted();
          });
          it('fires the syncStarted event', function() {
            return syncStartedListener.calledOnce.should.be.ok;
          });
          return it('increments syncsInProgress', function() {
            return pica.syncsInProgress.should.equal(1);
          });
        });
        return describe('when syncsInProgress > 0 and it is called', function() {
          var pica, syncStartedListener;

          pica = syncStartedListener = null;
          before(function() {
            var magpieServer;

            magpieServer = new testHelpers.FakeMagpieServer();
            pica = testHelpers.buildPicaApplication();
            pica.syncsInProgress = 1;
            syncStartedListener = sinon.spy();
            pica.on('syncStarted', syncStartedListener);
            return pica.notifySyncStarted();
          });
          it('does not fire the syncStarted again', function() {
            return syncStartedListener.calledOnce.should.to.be.ok;
          });
          return it('increments syncsInProgress', function() {
            return pica.syncsInProgress.should.equal(2);
          });
        });
      });
      return describe('.notifySyncFinished', function() {
        describe('called when 1 syncsInProgress', function() {
          var pica, syncFinishedListener;

          pica = syncFinishedListener = null;
          before(function() {
            var magpieServer;

            magpieServer = new testHelpers.FakeMagpieServer();
            pica = testHelpers.buildPicaApplication();
            pica.syncsInProgress = 1;
            syncFinishedListener = sinon.spy();
            pica.on('syncFinished', syncFinishedListener);
            return pica.notifySyncFinished();
          });
          it('decrements syncsInProgress', function() {
            return pica.syncsInProgress.should.equal(0);
          });
          return it('fires the syncFinished event', function() {
            return syncFinishedListener.calledOnce.should.be.ok;
          });
        });
        return describe('called when 2 syncsInProgress', function() {
          var pica, syncFinishedListener;

          pica = syncFinishedListener = null;
          before(function() {
            var magpieServer;

            magpieServer = new testHelpers.FakeMagpieServer();
            pica = testHelpers.buildPicaApplication();
            pica.syncsInProgress = 2;
            syncFinishedListener = sinon.spy();
            pica.on('syncFinished', syncFinishedListener);
            return pica.notifySyncFinished();
          });
          it('decrements syncsInProgress', function() {
            return pica.syncsInProgress.should.equal(1);
          });
          return it('does not fire the syncFinished event', function() {
            return syncFinishedListener.calledOnce.should.not.be.ok;
          });
        });
      });
    });
  });

}).call(this);
