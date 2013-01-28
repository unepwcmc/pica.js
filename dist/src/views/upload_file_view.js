
Pica.Views.UploadFileView = (function() {

  function UploadFileView(options) {
    if (options.callbacks != null) {
      this.successCallback = options.callbacks.success;
      this.errorCallback = options.callbacks.error;
    }
    this.area = options.area;
    this.el = document.createElement("div");
    this.render();
  }

  UploadFileView.prototype.render = function() {
    var formFrame;
    formFrame = document.createElement('iframe');
    formFrame.src = "" + Pica.config.magpieUrl + "/workspaces/" + (this.area.get('workspace_id')) + "/areas_of_interest/" + (this.area.get('id')) + "/polygons/upload_file_url";
    return this.el.appendChild(formFrame);
  };

  UploadFileView.prototype.close = function() {
    this.polygonDraw.disable();
    return Pica.config.map.off('draw:circle-created');
  };

  return UploadFileView;

})();
