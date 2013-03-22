
describe('Pica.Models.Area', function() {
  return describe('saving a new area', function() {
    var error, pica, server, success;
    success = error = server = null;
    server = sinon.fakeServer.create();
    pica = window.TestHelpers.buildPicaApplication();
    pica.newWorkspace();
    TestHelpers.MagpieRespond.getProjects(server);
    before(function(done) {
      var newArea;
      newArea = new Pica.Models.Area;
      pica.currentWorkspace.addArea(newArea);
      pica.currentWorkspace.setCurrentArea(newArea);
      success = sinon.spy(function() {
        return done();
      });
      error = sinon.spy(function() {
        return done();
      });
      newArea.save({
        success: success,
        error: error
      });
      return done();
    });
    it('should send a workspace save request to magpie', function() {
      debugger;      return server.request;
    });
    describe('when magpie responds with a workspace id', function() {
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
