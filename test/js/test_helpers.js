
window.TestHelpers = {};

TestHelpers.map = false;

TestHelpers.buildPicaApplication = function() {
  if (!TestHelpers.map) {
    TestHelpers.map = L.map("map", {
      center: [24.5, 54],
      zoom: 9
    });
  }
  return new Pica.Application({
    magpieUrl: "http://magpie.unepwcmc-005.vm.brightbox.net",
    projectId: 5,
    map: TestHelpers.map
  });
};

TestHelpers.FakeMagpieServer = (function() {

  function FakeMagpieServer() {
    this.server = sinon.fakeServer.create();
  }

  FakeMagpieServer.prototype.routes = {
    projectIndex: {
      method: 'GET',
      matcher: /.*projects\/\d+\.json/,
      response: {
        "id": 5,
        "name": "my_polygon",
        "layers": [
          {
            "id": 1,
            "display_name": "Protected Areas",
            "tile_url": "http://184.73.201.235/blue/{z}/{x}/{y}",
            "is_displayed": true
          }
        ]
      }
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
    }
  };

  FakeMagpieServer.prototype.respondTo = function(routeName) {
    var request;
    request = this.hasReceivedRequest(routeName);
    if (request) {
      return request.respond(200, {
        "Content-Type": "application/json"
      }, JSON.stringify(this.routes[routeName].response));
    } else {
      throw "server hasn't received a " + routeName + " request";
    }
  };

  FakeMagpieServer.prototype.hasReceivedRequest = function(routeName) {
    var request, requests, routeDetails, _i, _len;
    routeDetails = this.routes[routeName];
    requests = this.server.requests;
    for (_i = 0, _len = requests.length; _i < _len; _i++) {
      request = requests[_i];
      if (request.url.match(routeDetails.matcher) && routeDetails.method === request.method) {
        return request;
      }
    }
    return false;
  };

  return FakeMagpieServer;

})();
