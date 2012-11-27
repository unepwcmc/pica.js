
window.Pica = {};

Pica.Models = {};

Pica.Views = {};

Pica.Application = (function() {

  function Application(config) {
    this.config = config;
    Pica.config = this.config;
    $.support.cors = true;
    $.ajaxSetup({
      headers: {
        'X-Magpie-ProjectId': Pica.config.projectId
      }
    });
  }

  Application.prototype.newWorkspace = function() {
    return this.currentWorkspace = new Pica.Models.Workspace();
  };

  return Application;

})();
