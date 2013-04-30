(function() {
  describe('Pica.Models.Polygon', function() {
    return describe('saving a new polygon', function() {
      var error, magpieServer, pica, server, success;

      success = error = server = pica = magpieServer = null;
      before(function(done) {
        var currentArea;

        pica = TestHelpers.buildPicaApplication();
        pica.newWorkspace();
        success = sinon.spy(function() {
          return done();
        });
        error = sinon.spy(function(a, b, theError) {
          return done();
        });
        currentArea = pica.currentWorkspace.currentArea;
        currentArea.createPolygon();
        return currentArea.currentPolygon.save({
          success: success,
          error: error
        });
      });
      it('saves the parent workspace and sets the area.workspace_id attribute', function() {
        return expect(pica.currentWorkspace.get('id')).to.be.a('number');
      });
      it('sets the polygon.area_id attribute', function() {
        return expect(pica.currentWorkspace.currentArea.currentPolygon.get('area_id')).to.equal(pica.currentWorkspace.currentArea.get('id'));
      });
      it('saves the area', function() {
        return expect(pica.currentWorkspace.currentArea.get('id')).to.be.a('number');
      });
      it('saves the polygon', function() {
        return expect(pica.currentWorkspace.currentArea.currentPolygon.get('id')).to.be.a('number');
      });
      it('calls the success callback', function() {
        return expect(success.calledOnce).to.equal(true);
      });
      return it('does not call the error callback', function() {
        return expect(error.calledOnce).to.equal(false);
      });
    });
  });

}).call(this);
