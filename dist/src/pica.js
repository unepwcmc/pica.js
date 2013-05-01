(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.Pica || (window.Pica = {});

  Pica.Models = {};

  Pica.Views = {};

  Pica.Application = (function(_super) {
    __extends(Application, _super);

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
      if (this.config.delegateLayerControl) {
        this.showTileLayers();
      }
    }

    Application.prototype.newWorkspace = function() {
      return this.currentWorkspace = new Pica.Models.Workspace();
    };

    Application.prototype.showTileLayers = function() {
      return new Pica.Views.ShowLayersView({
        app: this
      });
    };

    Application.prototype.fetch = function() {
      return $.ajax({
        url: "" + Pica.config.magpieUrl + "/projects/" + Pica.config.projectId + ".json",
        type: 'get',
        success: this.parse
      });
    };

    Application.prototype.parse = function(data) {
      var attr, val;

      for (attr in data) {
        val = data[attr];
        this[attr] = val;
      }
      return this.trigger('sync');
    };

    return Application;

  })(Pica.Events);

}).call(this);
