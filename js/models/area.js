(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["lib/pica_model", "views/new_polygon_view", "views/new_circle_view", "views/upload_file_view", "views/show_area_polygons_view", "models/polygon"], function(PicaModel, PicaViewsNewPolygonView, PicaViewsNewCircleView, PicaViewsUploadFileView, PicaViewsShowAreaPolygonsView, PicaModelsPolygon) {
    var PicaModelsArea;

    return PicaModelsArea = (function(_super) {
      __extends(PicaModelsArea, _super);

      function PicaModelsArea(app) {
        this.app = app;
        this.save = __bind(this.save, this);
        this.getAreaId = __bind(this.getAreaId, this);
        this.throwIfNoApp();
        this.polygons = [];
        this.set('name', 'My Lovely Area');
      }

      PicaModelsArea.prototype.setName = function(name) {
        return this.set('name', name);
      };

      PicaModelsArea.prototype.addPolygon = function(polygon) {
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

      PicaModelsArea.prototype.getAreaId = function(options) {
        if (this.get('id') != null) {
          return options.success(this);
        } else {
          return this.save(options);
        }
      };

      PicaModelsArea.prototype.drawNewPolygonView = function(callbacks) {
        this.createPolygon();
        return new PicaViewsNewPolygonView({
          callbacks: callbacks,
          polygon: this.currentPolygon,
          map: this.app.config.map
        });
      };

      PicaModelsArea.prototype.drawNewCircleView = function(callbacks) {
        this.createPolygon();
        return new PicaViewsNewCircleView({
          callbacks: callbacks,
          polygon: this.currentPolygon,
          map: this.app.config.map
        });
      };

      PicaModelsArea.prototype.createPolygon = function() {
        this.currentPolygon = new PicaModelsPolygon(this.app);
        return this.addPolygon(this.currentPolygon);
      };

      PicaModelsArea.prototype.newUploadFileView = function(callbacks) {
        return new PicaViewsUploadFileView({
          callbacks: callbacks,
          area: this,
          magpieUrl: this.app.config.magpieUrl
        });
      };

      PicaModelsArea.prototype.newShowAreaPolygonsView = function() {
        return new PicaViewsShowAreaPolygonsView({
          area: this,
          map: this.app.config.map
        });
      };

      PicaModelsArea.prototype.url = function() {
        var url;

        url = this.app.config.magpieUrl;
        return {
          create: "" + url + "/workspaces/" + (this.get('workspace_id')) + "/areas_of_interest.json",
          read: "" + url + "/areas_of_interest/" + (this.get('id')) + ".json"
        };
      };

      PicaModelsArea.prototype.parse = function(data) {
        var index, polygon, polygonAttributes, unPersistedPolygons, _i, _j, _len, _len1, _ref, _ref1;

        if (data.polygons != null) {
          this.polygons = [];
          _ref = data.polygons;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            polygonAttributes = _ref[_i];
            polygon = new PicaModelsPolygon(this.app, {
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
        return PicaModelsArea.__super__.parse.apply(this, arguments);
      };

      PicaModelsArea.prototype.save = function(options) {
        var _this = this;

        options || (options = {});
        if (this.get('workspace_id') != null) {
          return PicaModelsArea.__super__.save.call(this, options);
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

      return PicaModelsArea;

    })(PicaModel);
  });

}).call(this);
