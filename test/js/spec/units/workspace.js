(function() {
  describe('Pica.Models.Workspace', function() {
    describe('.constructor', function() {
      describe('when given a pica application', function() {
        var pica, workspace;

        pica = workspace = null;
        before(function() {
          pica = {
            config: "I'm only a mock!"
          };
          return workspace = new Pica.Models.Workspace(pica);
        });
        return it('stores a references to the given pica application', function() {
          return expect(workspace.app).to.equal(pica);
        });
      });
      return describe('when not given a pica application', function() {
        return it('throws an error', function() {
          return expect(function() {
            return new Pica.Models.Workspace();
          }).to.throwException(function(e) {
            return expect(e).to.be.equal('Cannot create a Pica.Model without specifying a Pica.Application');
          });
        });
      });
    });
    return describe('.save', function() {
      var error, finishedSync, magpieServer, pica, server, success, syncing;

      success = error = syncing = finishedSync = server = pica = magpieServer = null;
      before(function() {
        magpieServer = new window.TestHelpers.FakeMagpieServer();
        pica = window.TestHelpers.buildPicaApplication();
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
        return expect(magpieServer.hasReceivedRequest('workspaceSave')).to.be.ok();
      });
      describe('when the server responds with a workspace id', function() {
        before(function() {
          return magpieServer.respondTo('workspaceSave');
        });
        it("assigns the workspace an id", function() {
          return expect(pica.currentWorkspace.get('id')).to.be.a('number');
        });
        it('calls the success callback', function() {
          return expect(success.calledOnce).to.equal(true);
        });
        return it('does not call the error callback', function() {
          return expect(error.calledOnce).to.equal(false);
        });
      });
      return after(function() {
        return magpieServer.server.restore();
      });
    });
  });

}).call(this);
