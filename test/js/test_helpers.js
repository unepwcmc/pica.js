
window.TestHelpers = {};

TestHelpers.map || (TestHelpers.map = L.map("map", {
  center: [24.5, 54],
  zoom: 9
}));

TestHelpers.FakePolygonResponse = {
  "id": 98,
  "area_of_interest_id": 5,
  "geometry": {
    "type": "Polygon",
    "coordinates": [[[53.63250732421874, 24.599577462003484], [53.69293212890625, 24.12920858513251], [54.3878173828125, 24.241955877694206], [54.2779541015625, 24.80169495167004], [53.63250732421874, 24.599577462003484]]]
  }
};

TestHelpers.buildPicaApplication = function() {
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
    },
    polygonSave: {
      method: 'POST',
      matcher: /.*polygons.json/,
      response: TestHelpers.FakePolygonResponse
    }
  };

  FakeMagpieServer.prototype.respondTo = function(routeName) {
    if (this.hasReceivedRequest(routeName)) {
      this.server.requests[0].respond(200, {
        "Content-Type": "application/json"
      }, JSON.stringify(this.routes[routeName].response));
      return this.server.requests.splice(0, 1);
    } else {
      throw "server hasn't received a " + routeName + " request";
    }
  };

  FakeMagpieServer.prototype.hasReceivedRequest = function(routeName) {
    var routeDetails;
    routeDetails = this.routes[routeName];
    return this.server.requests[0].url.match(routeDetails.matcher) && routeDetails.method === this.server.requests[0].method;
  };

  return FakeMagpieServer;

})();
