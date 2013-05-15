(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["lib/pica_event"], function(PicaEvents) {
    var PicaViewsUploadFileView;

    return PicaViewsUploadFileView = (function(_super) {
      __extends(PicaViewsUploadFileView, _super);

      function PicaViewsUploadFileView(options) {
        this.options = options;
        this.onUploadComplete = __bind(this.onUploadComplete, this);
        this.render = __bind(this.render, this);
        if (options.callbacks != null) {
          this.successCallback = this.options.callbacks.success;
          this.errorCallback = this.options.callbacks.error;
        }
        this.area = this.options.area;
        this.el = document.createElement("div");
        this.area.getAreaId({
          success: this.render
        });
      }

      PicaViewsUploadFileView.prototype.render = function() {
        var formFrame;

        formFrame = document.createElement('iframe');
        formFrame.src = "" + this.options.magpieUrl + "/areas_of_interest/" + (this.area.get('id')) + "/polygons/new_upload_form/";
        formFrame.className = "pica-upload-form";
        this.el.appendChild(formFrame);
        return window.addEventListener("message", this.onUploadComplete, false);
      };

      PicaViewsUploadFileView.prototype.onUploadComplete = function(event) {
        if (event.origin === this.options.magpieUrl && (event.data.polygonImportStatus != null)) {
          if (event.data.polygonImportStatus === 'Successful import' && (this.successCallback != null)) {
            this.successCallback(event.data.polygonImportStatus, event.data.importMessages);
          } else if (this.errorCallback != null) {
            this.errorCallback(event.data.polygonImportStatus, event.data.importMessages);
          }
          return this.close();
        }
      };

      PicaViewsUploadFileView.prototype.close = function() {
        window.removeEventListener("message", this.onUploadComplete);
        return $(this.el).remove();
      };

      return PicaViewsUploadFileView;

    })(PicaEvents);
  });

}).call(this);
