
describe('Pica.Models.Area', function() {
  return describe('saving a new area', function() {
    var error, pica, server, success;
    success = error = server = pica = null;
    before(function() {
      server = sinon.fakeServer.create();
      pica = window.TestHelpers.buildPicaApplication();
      pica.newWorkspace();
      TestHelpers.Magpie.Respond.getProjects(server);
      success = sinon.spy(function() {});
      error = sinon.spy(function() {});
      return pica.currentWorkspace.currentArea.save({
        success: success,
        error: error
      });
    });
    it('should send a workspace save request to magpie', function() {
      return expect(server.requests[0].url).to.match(TestHelpers.Magpie.UrlMatchers.workspaceIndex);
    });
    describe('when magpie responds with a workspace id', function() {
      before(function() {
        return TestHelpers.Magpie.Respond.saveWorkspace(server);
      });
      it('saves the parent workspace and sets the area.workspace_id attribute', function() {
        return expect(pica.currentWorkspace.get('id')).to.be.a('number');
      });
      it('should send an area save request to magpie');
      return describe('when magpie responds with an area id', function() {
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
    return after(function() {
      return server.restore();
    });
  });
});
