(function() {
  define(["jquery", "sinon", "specData", "leaflet", "pica_application"], function($, sinon, specData, L, PicaApplication) {
    'use strict';
    var testHelpers;

    testHelpers = {};
    testHelpers.map || (testHelpers.map = L.map("map", {
      center: [24.5, 54],
      zoom: 9
    }));
    testHelpers.defaultOptions = {
      map: testHelpers.map,
      magpieUrl: "http://magpie.unepwcmc-005.vm.brightbox.net",
      projectId: 5
    };
    testHelpers.buildPicaApplication = function(options) {
      var defaultOptions, ops;

      if (options == null) {
        options = {};
      }
      defaultOptions = testHelpers.defaultOptions;
      ops = $.extend({}, defaultOptions, options);
      return new PicaApplication(ops);
    };
    testHelpers.FakeMagpieServer = (function() {
      function FakeMagpieServer() {
        this.server = sinon.fakeServer.create();
      }

      FakeMagpieServer.prototype.routes = {
        projectIndex: {
          method: 'GET',
          matcher: /.*projects\/\d+\.json/,
          response: specData.FAKE_PROJECT_INDEX_RESPONSE
        },
        workspaceIndex: {
          method: 'GET',
          matcher: /.*workspaces.json/
        },
        workspaceSave: {
          method: 'POST',
          matcher: /.*workspaces.json/,
          response: {
            areas_of_interest: [],
            id: 590
          }
        },
        areasIndex: {
          method: 'GET',
          matcher: /.*areas_of_interest.json/
        },
        areaSave: {
          method: 'POST',
          matcher: /.*areas_of_interest.json/,
          response: {
            id: 5,
            name: ""
          }
        },
        polygonSave: {
          method: 'POST',
          matcher: /.*polygons.json/,
          response: specData.FAKE_POLYGON_RESPONSE
        }
      };

      FakeMagpieServer.prototype.respondTo = function(routeName) {
        if (this.hasReceivedRequest(routeName)) {
          this.server.requests[0].respond(200, {
            "Content-Type": "application/json"
          }, JSON.stringify(this.routes[routeName].response));
          return this.server.requests.splice(0, 1);
        } else {
          throw new Error("server hasn't received a " + routeName + " request");
        }
      };

      FakeMagpieServer.prototype.hasReceivedRequest = function(routeName) {
        var routeDetails;

        routeDetails = this.routes[routeName];
        return this.server.requests[0].url.match(routeDetails.matcher) && routeDetails.method === this.server.requests[0].method;
      };

      return FakeMagpieServer;

    })();
    return testHelpers;
  });

}).call(this);
