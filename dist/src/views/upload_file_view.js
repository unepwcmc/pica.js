(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Pica.Views.UploadFileView = (function(_super) {
    __extends(UploadFileView, _super);

    function UploadFileView(options) {
      this.onUploadComplete = __bind(this.onUploadComplete, this);
      this.render = __bind(this.render, this);      if (options.callbacks != null) {
        this.successCallback = options.callbacks.success;
        this.errorCallback = options.callbacks.error;
      }
      this.area = options.area;
      this.el = document.createElement("div");
      this.area.getAreaId({
        success: this.render
      });
    }

    UploadFileView.prototype.render = function() {
      var formFrame;

      formFrame = document.createElement('iframe');
      formFrame.src = "" + Pica.config.magpieUrl + "/areas_of_interest/" + (this.area.get('id')) + "/polygons/new_upload_form/";
      formFrame.className = "pica-upload-form";
      this.el.appendChild(formFrame);
      return window.addEventListener("message", this.onUploadComplete, false);
    };

    UploadFileView.prototype.onUploadComplete = function(event) {
      if (event.origin === Pica.config.magpieUrl && (event.data.polygonImportStatus != null)) {
        if (event.data.polygonImportStatus === 'Successful import' && (this.successCallback != null)) {
          this.successCallback(event.data.polygonImportStatus, event.data.importMessages);
        } else if (this.errorCallback != null) {
          this.errorCallback(event.data.polygonImportStatus, event.data.importMessages);
        }
        return this.close();
      }
    };

    UploadFileView.prototype.close = function() {
      window.removeEventListener("message", this.onUploadComplete);
      return $(this.el).remove();
    };

    return UploadFileView;

  })(Pica.Events);

}).call(this);
