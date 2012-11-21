var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Pica.Models.Workspace = (function(_super) {

  __extends(Workspace, _super);

  function Workspace() {
    this.save = __bind(this.save, this);
    this.attributes = {};
    this.areas = [];
    this.currentArea = new Pica.Models.Area();
    this.addArea(this.currentArea);
  }

  Workspace.prototype.url = function() {
    return "" + Pica.config.magpieUrl + "/workspaces";
  };

  Workspace.prototype.addArea = function(area) {
    area.on('requestWorkspaceId', this.save);
    return this.areas.push(area);
  };

  Workspace.prototype.save = function(options) {
    return Workspace.__super__.save.call(this, options);
  };

  return Workspace;

})(Pica.Model);
