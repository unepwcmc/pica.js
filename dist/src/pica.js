
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
        'X-Magpie-AppId': Pica.config.appId
      }
    });
  }

  Application.prototype.newWorkspace = function() {
    return this.currentWorkspace = new Pica.Models.Workspace();
  };

  return Application;

})();
