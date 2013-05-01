(function() {
  describe('Pica.Models.Polygon', function() {
    describe('.constructor', function() {
      describe('when given a pica application', function() {
        var pica, polygon;

        pica = polygon = null;
        before(function() {
          pica = {
            config: "I'm only a mock!"
          };
          return polygon = new Pica.Models.Polygon(pica);
        });
        return it('stores a references to the given pica application', function() {
          return expect(polygon.app).to.equal(pica);
        });
      });
      return describe('when not given a pica application', function() {
        return it('throws an error', function() {
          return expect(function() {
            return new Pica.Models.Polygon();
          }).to.throwException(function(e) {
            return expect(e).to.be.equal('Cannot create a Pica.Model without specifying a Pica.Application');
          });
        });
      });
    });
    return describe('saving a new polygon', function() {
      var error, magpieServer, pica, server, success;

      success = error = server = pica = magpieServer = null;
      before(function() {
        var currentArea;

        magpieServer = new window.TestHelpers.FakeMagpieServer();
        pica = window.TestHelpers.buildPicaApplication();
        pica.newWorkspace();
        magpieServer.respondTo('projectIndex');
        success = sinon.spy();
        error = sinon.spy();
        currentArea = pica.currentWorkspace.currentArea;
        currentArea.createPolygon();
        return currentArea.currentPolygon.save({
          success: success,
          error: error
        });
      });
      after(function() {
        return magpieServer.server.restore();
      });
      it('sends a workspace save request to magpie', function() {
        return expect(magpieServer.hasReceivedRequest('workspaceSave')).to.be.ok();
      });
      it('receives 1 request', function() {
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
          it('sets the polygon.area_id attribute', function() {
            return expect(pica.currentWorkspace.currentArea.currentPolygon.get('area_id')).to.equal(pica.currentWorkspace.currentArea.get('id'));
          });
          it('saves the area', function() {
            return expect(pica.currentWorkspace.currentArea.get('id')).to.be.a('number');
          });
          it('should send polygon save request to magpie', function() {
            return expect(magpieServer.hasReceivedRequest('polygonSave')).to.be.ok();
          });
          return describe('when magpie responds with an area id', function() {
            before(function() {
              return magpieServer.respondTo('polygonSave');
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
      });
    });
  });

}).call(this);
