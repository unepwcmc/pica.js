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
    return "" + Pica.config.magpieUrl + "/workspaces.json";
  };

  Workspace.prototype.addArea = function(area) {
    var _this = this;
    area.on('requestWorkspaceId', function(options) {
      if (_this.get('id') != null) {
        return options.success(_this);
      } else {
        return _this.save(options);
      }
    });
    return this.areas.push(area);
  };

  Workspace.prototype.removeArea = function(theArea) {
    var area, id;
    id = this.areas.indexOf(theArea);
    area = this.areas.splice(id, 1)[0];
    if (area.get('id') != null) {
      return area.destroy();
    }
  };

  Workspace.prototype.setCurrentArea = function(theArea) {
    var area, _i, _len, _ref, _results;
    _ref = this.areas;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      area = _ref[_i];
      if (area === theArea) {
        _results.push(this.currentArea = area);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  Workspace.prototype.setCurrentAreaById = function(areaId) {
    var area, _i, _len, _ref, _results;
    _ref = this.areas;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      area = _ref[_i];
      if (area.get('id') === areaId) {
        _results.push(this.currentArea = area);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  Workspace.prototype.save = function(options) {
    return Workspace.__super__.save.call(this, options);
  };

  return Workspace;

})(Pica.Model);
