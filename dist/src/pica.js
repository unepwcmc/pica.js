var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

window.Pica = {};

Pica.Models = {};

Pica.Views = {};

Pica.Application = (function() {

  function Application(config) {
    this.config = config;
    this.parse = __bind(this.parse, this);

    Pica.config = this.config;
    $.support.cors = true;
    $.ajaxSetup({
      headers: {
        'X-Magpie-ProjectId': Pica.config.projectId
      }
    });
    this.layers = [];
    this.fetch();
  }

  Application.prototype.newWorkspace = function() {
    return this.currentWorkspace = new Pica.Models.Workspace();
  };

  Application.prototype.fetch = function() {
    return $.ajax({
      url: "" + Pica.config.magpieUrl + "/projects/" + Pica.config.projectId + ".json",
      type: 'get',
      success: this.parse
    });
  };

  Application.prototype.parse = function(data) {
    var attr, val, _results;
    _results = [];
    for (attr in data) {
      val = data[attr];
      _results.push(this[attr] = val);
    }
    return _results;
  };

  return Application;

})();
