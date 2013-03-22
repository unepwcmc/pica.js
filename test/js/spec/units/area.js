
describe('Pica.Models.Area', function() {
  return describe('creating a new area', function() {
    var error, pica, success;
    success = void 0;
    error = void 0;
    pica = window.TestHelpers.buildPicaApplication();
    before(function(done) {
      var newArea;
      pica.newWorkspace();
      newArea = new Pica.Models.Area;
      pica.currentWorkspace.addArea(newArea);
      pica.currentWorkspace.setCurrentArea(newArea);
      success = sinon.spy(function() {
        return done();
      });
      error = sinon.spy(function() {
        return done();
      });
      return newArea.save({
        success: success,
        error: error
      });
    });
    it('saves the parent workspace and sets the area.workspace_id attribute', function() {
      expect(pica.currentWorkspace.get('id')).to.be.a('number');
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
