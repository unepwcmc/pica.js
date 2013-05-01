(function() {
  describe('Pica.Application', function() {
    return describe('.createWorkspace', function() {
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
  });

}).call(this);
