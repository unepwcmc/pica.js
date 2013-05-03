(function() {
  window.TestHelpers || (window.TestHelpers = {});

  TestHelpers.map || (TestHelpers.map = L.map("map", {
    center: [24.5, 54],
    zoom: 9
  }));

  TestHelpers.buildPicaApplication = function(options) {
    var default_options;

    if (options == null) {
      options = {};
    }
    default_options = {
      map: TestHelpers.map,
      magpieUrl: "http://magpie.unepwcmc-005.vm.brightbox.net",
      projectId: 5
    };
    $.extend(default_options, options);
    return new Pica.Application(default_options);
  };

  TestHelpers.FakeMagpieServer = (function() {
    function FakeMagpieServer() {
      this.server = sinon.fakeServer.create();
    }

    FakeMagpieServer.prototype.routes = {
      projectIndex: {
        method: 'GET',
        matcher: /.*projects\/\d+\.json/,
        response: TestHelpers.data.FAKE_PROJECT_INDEX_RESPONSE
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
        response: TestHelpers.data.FAKE_POLYGON_RESPONSE
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

}).call(this);
