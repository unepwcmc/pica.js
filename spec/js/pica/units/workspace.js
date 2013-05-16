(function() {
  define(["sinon", "chai", "sinonChai", "mocha", "specHelpers", "models/workspace"], function(sinon, chai, sinonChai, mocha, testHelpers, PicaModelsWorkspace) {
    'use strict';
    var should;

    should = chai.should();
    return describe('Pica.Models.Workspace', function() {
      describe('.constructor', function() {
        describe('when given a pica application', function() {
          var pica, workspace;

          pica = workspace = null;
          before(function() {
            pica = {
              config: "I'm only a mock!"
            };
            return workspace = new PicaModelsWorkspace(pica);
          });
          return it('stores a references to the given pica application', function() {
            return workspace.app.should.be.equal(pica);
          });
        });
        return describe('when not given a pica application', function() {
          return it('throws an error', function() {
            return (function() {
              return new PicaModelsWorkspace();
            }).should["throw"]("Cannot create a PicaModel without specifying a PicaApplication");
          });
        });
      });
      return describe('.save', function() {
        var error, finishedSync, magpieServer, pica, server, success, syncing;

        success = error = syncing = finishedSync = server = pica = magpieServer = null;
        before(function() {
          magpieServer = new testHelpers.FakeMagpieServer();
          pica = testHelpers.buildPicaApplication();
          pica.newWorkspace();
          magpieServer.respondTo('projectIndex');
          success = sinon.spy();
          error = sinon.spy();
          pica.on('syncing', syncing);
          pica.on('finishedSync', finishedSync);
          return pica.currentWorkspace.save({
            success: success,
            error: error
          });
        });
        it('sends a workspace save request to magpie', function() {
          return magpieServer.hasReceivedRequest('workspaceSave').should.be.ok;
        });
        describe('when the server responds with a workspace id', function() {
          before(function() {
            return magpieServer.respondTo('workspaceSave');
          });
          it("assigns the workspace an id", function() {
            return pica.currentWorkspace.get('id').should.be.a('number');
          });
          it('calls the success callback', function() {
            return success.calledOnce.should.equal(true);
          });
          return it('does not call the error callback', function() {
            return error.calledOnce.should.equal(false);
          });
        });
        return after(function() {
          return magpieServer.server.restore();
        });
      });
    });
  });

}).call(this);
