(function() {
  describe('Pica.Models.Area', function() {
    describe('.constructor', function() {
      describe('when given a pica application', function() {
        var area, pica;

        pica = area = null;
        before(function() {
          pica = {
            config: "I'm only a mock!"
          };
          return area = new Pica.Models.Area(pica);
        });
        return it('stores a references to the given pica application', function() {
          return expect(area.app).to.equal(pica);
        });
      });
      return describe('when not given a pica application', function() {
        return it('throws an error', function() {
          return expect(function() {
            return new Pica.Models.Area();
          }).to.throwException(function(e) {
            return expect(e).to.be.equal('Cannot create a Pica.Model without specifying a Pica.Application');
          });
        });
      });
    });
    describe('.createPolygon', function() {
      var area;

      area = null;
      before(function() {
        area = new Pica.Models.Area({
          config: "I'm a mock!"
        });
        return area.createPolygon();
      });
      return it('creates a new polygon and stores it in .currentPolygon', function() {
        return expect(area.currentPolygon).not.to.be(void 0);
      });
    });
    describe('.parse', function() {
      return it('creates polygons with correct attributes from the given data.polygons', function() {
        var area;

        area = new Pica.Models.Area({
          config: "I'm a mock!"
        });
        area.parse({
          polygons: [
            {
              id: 141
            }
          ]
        });
        return expect(area.polygons[0].get('id')).to.equal(141);
      });
    });
    return describe('.save', function() {
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

}).call(this);
