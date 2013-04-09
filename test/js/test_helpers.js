(function() {
  window.TestHelpers = {};

  TestHelpers.buildPicaApplication = function() {
    return new Pica.Application({
      magpieUrl: "http://magpie.unepwcmc-005.vm.brightbox.net",
      projectId: 5,
      map: map
    });
  };

}).call(this);
