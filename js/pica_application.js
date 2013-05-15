(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["lib/pica_event", "lib/pica_model", "models/workspace", "views/show_layers_view"], function(PicaEvents, PicaModel, PicaModelsWorkspace, ShowLayersView) {
    var PicaApplication;

    return PicaApplication = (function(_super) {
      __extends(PicaApplication, _super);

      function PicaApplication(config) {
        this.config = config;
        this.parse = __bind(this.parse, this);
        $.support.cors = true;
        $.ajaxSetup({
          headers: {
            'X-Magpie-ProjectId': this.config.projectId
          }
        });
        this.layers = [];
        this.fetch();
        if (this.config.delegateLayerControl) {
          this.showTileLayers();
        }
      }

      PicaApplication.prototype.newWorkspace = function() {
        return this.currentWorkspace = new PicaModelsWorkspace(this);
      };

      PicaApplication.prototype.showTileLayers = function() {
        return new ShowLayersView({
          app: this
        });
      };

      PicaApplication.prototype.fetch = function() {
        return $.ajax({
          url: "" + this.config.magpieUrl + "/projects/" + this.config.projectId + ".json",
          type: 'get',
          success: this.parse
        });
      };

      PicaApplication.prototype.parse = function(data) {
        var attr, val;

        for (attr in data) {
          val = data[attr];
          this[attr] = val;
        }
        return this.trigger('sync');
      };

      PicaApplication.prototype.notifySyncStarted = function() {
        this.syncsInProgress || (this.syncsInProgress = 0);
        this.syncsInProgress = this.syncsInProgress + 1;
        if (this.syncsInProgress === 1) {
          return this.trigger('syncStarted');
        }
      };

      PicaApplication.prototype.notifySyncFinished = function() {
        this.syncsInProgress || (this.syncsInProgress = 0);
        this.syncsInProgress = this.syncsInProgress - 1;
        if (this.syncsInProgress === 0) {
          return this.trigger('syncFinished');
        }
      };

      return PicaApplication;

    })(PicaEvents);
  });

}).call(this);
