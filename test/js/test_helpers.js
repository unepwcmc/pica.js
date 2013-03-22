
window.TestHelpers = {};

TestHelpers.buildPicaApplication = function() {
  return new Pica.Application({
    magpieUrl: "http://magpie.unepwcmc-005.vm.brightbox.net",
    projectId: 5,
    map: map
  });
};

TestHelpers.MagpieRespond = {};

TestHelpers.MagpieRespond.getProjects = function(server) {
  if (server.requests[0].url.match(/.*projects\/\d+\.json/)) {
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
