
window.TestHelpers = {};

TestHelpers.buildPicaApplication = function() {
  return new Pica.Application({
    magpieUrl: "http://magpie.unepwcmc-005.vm.brightbox.net",
    projectId: 5,
    map: map
  });
};

TestHelpers.Magpie = {};

TestHelpers.Magpie.UrlMatchers = {};

TestHelpers.Magpie.UrlMatchers.projectIndex = /.*projects\/\d+\.json/;

TestHelpers.Magpie.UrlMatchers.workspaceIndex = /.*workspaces.json/;

TestHelpers.Magpie.UrlMatchers.areasIndex = /.*areas_of_interest.json/;

TestHelpers.Magpie.Respond = {};

TestHelpers.Magpie.Respond.getProjects = function(server) {
  if (server.requests[0].url.match(TestHelpers.Magpie.UrlMatchers.projectIndex)) {
    server.requests[0].respond(200, {
      "Content-Type": "application/json"
    }, JSON.stringify({
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
    }));
  } else {
    throw "server hasn't received a projects request";
  }
  return server.requests.splice(0, 1);
};

TestHelpers.Magpie.Respond.saveWorkspace = function(server) {
  if (server.requests[0].url.match(TestHelpers.Magpie.UrlMatchers.workspaceIndex)) {
    server.requests[0].respond(200, {
      "Content-Type": "application/json"
    }, JSON.stringify({
      areas_of_interest: [],
      id: 590
    }));
  } else {
    throw "server hasn't received a projects request";
  }
  return server.requests.splice(0, 1);
};

TestHelpers.Magpie.Respond.saveArea = function(server) {
  if (server.requests[0].url.match(TestHelpers.Magpie.UrlMatchers.areaIndex)) {
    server.requests[0].respond(200, {
      "Content-Type": "application/json"
    }, JSON.stringify({
      id: 5,
      name: ""
    }));
  } else {
    throw "server hasn't received an area request";
  }
  return server.requests.splice(0, 1);
};
