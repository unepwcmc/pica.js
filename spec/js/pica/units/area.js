(function() {
  define(["sinon", "chai", "sinonChai", "mocha", "specHelpers", "models/area"], function(sinon, chai, sinonChai, mocha, testHelpers, PicaModelsArea) {
    'use strict';
    var should;

    should = chai.should();
    return describe('PicaModelsArea', function() {
      describe('.constructor', function() {
        describe('when given a pica application', function() {
          var area, pica;

          pica = area = null;
          before(function() {
            pica = {
              config: "I'm only a mock!"
            };
            return area = new PicaModelsArea(pica);
          });
          return it('stores a references to the given pica application', function() {
            return area.app.should.equal(pica);
          });
        });
        return describe('when not given a pica application', function() {
          return it('throws an error', function() {
            return (function() {
              return new PicaModelsArea();
            }).should["throw"]("Cannot create a PicaModel without specifying a PicaApplication");
          });
        });
      });
      describe('.createPolygon', function() {
        var area;

        area = null;
        before(function() {
          area = new PicaModelsArea({
            config: "I'm a mock!"
          });
          return area.createPolygon();
        });
        return it('creates a new polygon and stores it in .currentPolygon', function() {
          return area.currentPolygon.should.not.be.a("undefined");
        });
      });
      describe('.parse', function() {
        return it('creates polygons with correct attributes from the given data.polygons', function() {
          var area;

          area = new PicaModelsArea({
            config: "I'm a mock!"
          });
          area.parse({
            polygons: [
              {
                id: 141
              }
            ]
          });
          return area.polygons[0].get('id').should.be.equal(141);
        });
      });
      return describe('.save', function() {
        var error, magpieServer, pica, server, success;

        success = error = server = pica = magpieServer = null;
        before(function() {
          magpieServer = new testHelpers.FakeMagpieServer();
          pica = testHelpers.buildPicaApplication();
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
          return magpieServer.hasReceivedRequest('workspaceSave').should.be.ok;
        });
        return describe('when magpie responds with a workspace id', function() {
          before(function() {
            return magpieServer.respondTo('workspaceSave');
          });
          it('saves the parent workspace and sets the area.workspace_id attribute', function() {
            return pica.currentWorkspace.get('id').should.be.a('number');
          });
          it('should send an area save request to magpie', function() {
            return magpieServer.hasReceivedRequest('areaSave').should.be.ok;
          });
          return describe('when magpie responds with an area id', function() {
            before(function() {
              return magpieServer.respondTo('areaSave');
            });
            it('sets the area.workspace_id attribute', function() {
              return pica.currentWorkspace.currentArea.get('workspace_id').should.equal(pica.currentWorkspace.get('id'));
            });
            it('saves the area', function() {
              return pica.currentWorkspace.currentArea.get('id').should.be.a('number');
            });
            it('calls the success callback', function() {
              return success.calledOnce.should.equal(true);
            });
            return it('does not call the error callback', function() {
              return error.calledOnce.should.equal(false);
            });
          });
        });
      });
    });
  });

}).call(this);
