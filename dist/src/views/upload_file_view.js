var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Pica.Views.UploadFileView = (function() {

  function UploadFileView(options) {
    this.onUploadComplete = __bind(this.onUploadComplete, this);

    this.render = __bind(this.render, this);
    if (options.callbacks != null) {
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
    this.el.appendChild(formFrame);
    return window.addEventListener("message", this.onUploadComplete, false);
  };

  UploadFileView.prototype.onUploadComplete = function(event) {
    var polygonAttributes, _i, _len, _ref;
    if (event.origin === Pica.config.magpieUrl) {
      _ref = event.data.createdPolygons;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        polygonAttributes = _ref[_i];
        this.area.addPolygon(new Pica.Models.Polygon(polygonAttributes));
      }
      return this.close();
    }
  };

  UploadFileView.prototype.close = function() {
    window.removeEventListener("message", this.onUploadComplete);
    if (this.el.parentNode != null) {
      return this.el.parentNode.removeChild(this.el);
    }
  };

  return UploadFileView;

})();
