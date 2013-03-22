
describe("Pica.Views.UploadFileView", function() {
  return describe("a view exists and has been rendered", function() {
    var addEventListenerSpy, fileView;
    fileView = void 0;
    addEventListenerSpy = void 0;
    before(function() {
      var map, pica;
      map = L.map("map", {
        center: [24.5, 54],
        zoom: 9
      });
      pica = new Pica.Application({
        magpieUrl: "http://magpie.unepwcmc-005.vm.brightbox.net",
        projectId: 5,
        map: map
      });
      pica.newWorkspace();
      fileView = pica.currentWorkspace.currentArea.newUploadFileView({
        success: function() {},
        error: function() {}
      });
      $("#side-panel").prepend(fileView.el);
      addEventListenerSpy = sinon.spy(window, "addEventListener");
      return fileView.render();
    });
    it("creates an iframe for the file upload", function() {
      return expect($("#side-panel iframe").length).to.equal(1);
    });
    it("listens for window events", function() {
      return expect(addEventListenerSpy.calledOnce).to.equal(true);
    });
    describe("onUploadComplete is called with a success event", function() {
      before(function() {
        var event;
        sinon.spy(fileView, "successCallback");
        sinon.spy(fileView, "errorCallback");
        event = {
          origin: Pica.config.magpieUrl,
          data: {
            polygonImportStatus: "Successful import",
            importMessages: "Imported polygon 5"
          }
        };
        return fileView.onUploadComplete(event);
      });
      it("calls the success callback", function() {
        return expect(fileView.successCallback.calledOnce).to.equal(true);
      });
      it("does not call the error callback", function() {
        return expect(fileView.errorCallback.calledOnce).to.equal(false);
      });
      return after(function() {
        fileView.successCallback.restore();
        return fileView.errorCallback.restore();
      });
    });
    describe("onUploadComplete is called with an error event", function() {
      before(function() {
        var event;
        sinon.spy(fileView, "errorCallback");
        sinon.spy(fileView, "successCallback");
        event = {
          origin: Pica.config.magpieUrl,
          data: {
            polygonImportStatus: "Imported with some errors",
            importMessages: "error or something or whatever"
          }
        };
        return fileView.onUploadComplete(event);
      });
      it("calls the error callback", function() {
        return expect(fileView.errorCallback.calledOnce).to.equal(true);
      });
      it("does not call the success callback", function() {
        return expect(fileView.successCallback.calledOnce).to.equal(false);
      });
      return after(function() {
        fileView.errorCallback.restore();
        return fileView.successCallback.restore();
      });
    });
    return describe("onUploadComplete is called with an event from a domain that isn't the magpie address", function() {
      before(function() {
        var event;
        sinon.spy(fileView, "errorCallback");
        sinon.spy(fileView, "successCallback");
        event = {
          origin: "http://google.com/"
        };
        return fileView.onUploadComplete(event);
      });
      it("does not call the error callback", function() {
        return expect(fileView.errorCallback.calledOnce).to.equal(false);
      });
      it("does not call the success callbacks", function() {
        return expect(fileView.successCallback.calledOnce).to.equal(false);
      });
      return after(function() {
        fileView.errorCallback.restore();
        return fileView.successCallback.restore();
      });
    });
  });
});
