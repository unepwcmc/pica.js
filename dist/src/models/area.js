var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Pica.Models.Area = (function(_super) {

  __extends(Area, _super);

  function Area(options) {
    this.save = __bind(this.save, this);
    this.attributes = {};
    this.polygons = [];
    this.set('name', 'My Lovely Area');
  }

  Area.prototype.setName = function(name) {
    return this.set('name', name);
  };

  Area.prototype.addPolygon = function(polygon) {
    polygon.on('requestAreaId', this.save);
    return this.polygons.push(polygon);
  };

  Area.prototype.drawNewPolygonView = function(finishedCallback) {
    this.currentPolygon = new Pica.Models.Polygon();
    this.addPolygon(this.currentPolygon);
    return new Pica.Views.NewPolygonView({
      finishedCallback: finishedCallback,
      polygon: this.currentPolygon
    });
  };

  Area.prototype.stats = function() {};

  Area.prototype.fetchStats = function(callback) {
    return this.fetch({
      success: callback
    });
  };

  Area.prototype.url = function() {
    return {
      create: "" + Pica.config.magpieUrl + "/workspaces/" + (this.get('workspace_id')) + "/areas_of_interest/",
      read: "" + Pica.config.magpieUrl + "/areas_of_interest/" + (this.get('id'))
    };
  };

  Area.prototype.save = function(options) {
    var _this = this;
    options || (options = {});
    if (this.get('workspace_id') != null) {
      return Area.__super__.save.call(this, options);
    } else {
      return this.trigger('requestWorkspaceId', {
        success: function(workspace, textStatus, jqXHR) {
          _this.set('workspace_id', workspace.get('id'));
          if (_this.get('workspace_id')) {
            return _this.save(options);
          } else {
            return options.error(_this, {
              error: "Could not save workspace, so cannot save area"
            }, jqXHR);
          }
        }
      });
    }
  };

  return Area;

})(Pica.Model);
