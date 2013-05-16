(function() {
  define(["sinon", "chai", "sinonChai", "mocha", "specHelpers", "models/polygon"], function(sinon, chai, sinonChai, mocha, testHelpers, PicaModelsPolygon) {
    'use strict';
    var should;

    should = chai.should();
    return describe('Pica.Models.Polygon', function() {
      describe('.constructor', function() {
        describe('when given a pica application', function() {
          var pica, polygon;

          pica = polygon = null;
          before(function() {
            pica = {
              config: "I'm only a mock!"
            };
            return polygon = new PicaModelsPolygon(pica);
          });
          return it('stores a references to the given pica application', function() {
            return polygon.app.should.equal(pica);
          });
        });
        return describe('when not given a pica application', function() {
          return it('throws an error', function() {
            return (function() {
              return new PicaModelsPolygon();
            }).should["throw"]("Cannot create a PicaModel without specifying a PicaApplication");
          });
        });
      });
      return describe('saving a new polygon', function() {
        var error, magpieServer, pica, server, success;

        success = error = server = pica = magpieServer = null;
        before(function() {
          var currentArea;

          magpieServer = new testHelpers.FakeMagpieServer();
          pica = testHelpers.buildPicaApplication();
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
          return magpieServer.hasReceivedRequest('workspaceSave').should.be.ok;
        });
        it('receives 1 request', function() {
          return magpieServer.server.requests.length.should.equal(1);
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
            it('sets the polygon.area_id attribute', function() {
              return pica.currentWorkspace.currentArea.currentPolygon.get('area_id').should.equal(pica.currentWorkspace.currentArea.get('id'));
            });
            it('saves the area', function() {
              return pica.currentWorkspace.currentArea.get('id').should.be.a('number');
            });
            it('should send polygon save request to magpie', function() {
              return magpieServer.hasReceivedRequest('polygonSave').should.be.ok;
            });
            return describe('when magpie responds with an area id', function() {
              before(function() {
                return magpieServer.respondTo('polygonSave');
              });
              it('saves the polygon', function() {
                return pica.currentWorkspace.currentArea.currentPolygon.get('id').should.be.a('number');
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
  });

}).call(this);
