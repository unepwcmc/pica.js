(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Pica.Models.Area = (function(_super) {
    __extends(Area, _super);

    function Area(options) {
      this.save = __bind(this.save, this);
      this.getAreaId = __bind(this.getAreaId, this);      this.polygons = [];
      this.set('name', 'My Lovely Area');
    }

    Area.prototype.setName = function(name) {
      return this.set('name', name);
    };

    Area.prototype.addPolygon = function(polygon) {
      var _this = this;

      polygon.on('requestAreaId', this.getAreaId);
      polygon.on('sync', function() {
        return _this.fetch();
      });
      polygon.on('delete', function() {
        return _this.fetch();
      });
      this.polygons.push(polygon);
      return this.trigger('addedPolygon', polygon);
    };

    Area.prototype.getAreaId = function(options) {
      if (this.get('id') != null) {
        return options.success(this);
      } else {
        return this.save(options);
      }
    };

    Area.prototype.drawNewPolygonView = function(callbacks) {
      this.createPolygon();
      return new Pica.Views.NewPolygonView({
        callbacks: callbacks,
        polygon: this.currentPolygon
      });
    };

    Area.prototype.drawNewCircleView = function(callbacks) {
      this.createPolygon();
      return new Pica.Views.NewCircleView({
        callbacks: callbacks,
        polygon: this.currentPolygon
      });
    };

    Area.prototype.createPolygon = function() {
      this.currentPolygon = new Pica.Models.Polygon();
      return this.addPolygon(this.currentPolygon);
    };

    Area.prototype.newUploadFileView = function(callbacks) {
      return new Pica.Views.UploadFileView({
        callbacks: callbacks,
        area: this
      });
    };

    Area.prototype.newShowAreaPolygonsView = function() {
      return new Pica.Views.ShowAreaPolygonsView({
        area: this
      });
    };

    Area.prototype.url = function() {
      var url;

      url = Pica.config.magpieUrl;
      return {
        create: "" + url + "/workspaces/" + (this.get('workspace_id')) + "/areas_of_interest.json",
        read: "" + url + "/areas_of_interest/" + (this.get('id')) + ".json"
      };
    };

    Area.prototype.parse = function(data) {
      var index, polygon, polygonAttributes, unPersistedPolygons, _i, _j, _len, _len1, _ref, _ref1;

      if (data.polygons != null) {
        this.polygons = [];
        _ref = data.polygons;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          polygonAttributes = _ref[_i];
          polygon = new Pica.Models.Polygon({
            attributes: polygonAttributes
          });
          this.addPolygon(polygon);
        }
        delete data.polygons;
      } else {
        unPersistedPolygons = [];
        _ref1 = this.polygons;
        for (index = _j = 0, _len1 = _ref1.length; _j < _len1; index = ++_j) {
          polygon = _ref1[index];
          if (polygon.get('id') == null) {
            unPersistedPolygons.push(polygon);
          }
        }
        this.polygons = unPersistedPolygons;
      }
      return Area.__super__.parse.apply(this, arguments);
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
          },
          error: function(jqXHR, textStatus, errorThrown) {
            console.log("Unable to save area:");
            console.log(arguments);
            console.log(jqXHR.status);
            console.log(jqXHR.statusText);
            console.log(jqXHR.responseText);
            if (options.error != null) {
              return options.error(jqXHR, textStatus, {
                error: "Unable to obtain workspaceId, cannot save area",
                parentError: errorThrown
              });
            }
          }
        });
      }
    };

    return Area;

  })(Pica.Model);

}).call(this);
