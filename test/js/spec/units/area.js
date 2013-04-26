
describe('Pica.Models.Area', function() {
  return describe('saving a new area', function() {
    var error, magpieServer, pica, server, success;
    success = error = server = pica = magpieServer = null;
    before(function() {
      magpieServer = new window.TestHelpers.FakeMagpieServer();
      pica = window.TestHelpers.buildPicaApplication();
      pica.newWorkspace();
      magpieServer.respondTo('projectIndex');
      success = sinon.spy();
      error = sinon.spy();
      return pica.currentWorkspace.currentArea.save({
        success: success,
        error: error
      });
    });
    after(function() {
      return magpieServer.server.restore();
    });
    it('should send a workspace save request to magpie', function() {
      return expect(magpieServer.hasReceivedRequest('workspaceSave')).to.be.ok();
    });
    it('should have received 1 requests', function() {
      return expect(magpieServer.server.requests.length).to.be(1);
    });
    return describe('when magpie responds with a workspace id', function() {
      before(function() {
        return magpieServer.respondTo('workspaceSave');
      });
      it('saves the parent workspace and sets the area.workspace_id attribute', function() {
        return expect(pica.currentWorkspace.get('id')).to.be.a('number');
      });
      it('should send an area save request to magpie', function() {
        return expect(magpieServer.hasReceivedRequest('areaSave')).to.be.ok();
      });
      return describe('when magpie responds with an area id', function() {
        before(function() {
          return magpieServer.respondTo('areaSave');
        });
        it('sets the area.workspace_id attribute', function() {
          return expect(pica.currentWorkspace.currentArea.get('workspace_id')).to.equal(pica.currentWorkspace.get('id'));
        });
        it('saves the area', function() {
          return expect(pica.currentWorkspace.currentArea.get('id')).to.be.a('number');
        });
        it('calls the success callback', function() {
          return expect(success.calledOnce).to.equal(true);
        });
        return it('does not call the error callback', function() {
          return expect(error.calledOnce).to.equal(false);
        });
      });
    });
  });
});
