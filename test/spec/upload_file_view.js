describe('Pica.Views.UploadFileView', function(){

  describe('a view exists and has been rendered', function(){
    var fileView, addEventListenerSpy;

    before(function(){
      // TODO put in mapExistsHelper
      var map = L.map('map',{
        center: [24.5,54],
        zoom: 9
      });

      // TODO application exists
      var pica = new Pica.Application({
        magpieUrl: "http://magpie.unepwcmc-005.vm.brightbox.net",
        projectId: 5,
        map: map
      });
      // Create a new workspace to work in
      pica.newWorkspace();

      // create a file view
      fileView = pica.currentWorkspace.currentArea.newUploadFileView({
        success: function() {},
        error: function() {}
      });
      $('#side-panel').prepend(fileView.el);

      addEventListenerSpy = sinon.spy(window, "addEventListener");
      fileView.render();
    });

    it('creates an iframe for the file upload', function(){
      $('#side-panel iframe').length.should.equal(1);
    });

    it('listens for window events', function(){
      addEventListenerSpy.calledOnce.should.equal(true);
    });

    describe('onUploadComplete is called with a success event', function() {
      before(function(){
        sinon.spy(fileView, 'successCallback');
        sinon.spy(fileView, 'errorCallback');
        var event = {
          origin: Pica.config.magpieUrl,
          data: {polygonImportStatus: 'Successful import', importMessages: 'Imported polygon 5'}
        };
        fileView.onUploadComplete(event);
      });
      it('calls the success callback', function() {
        fileView.successCallback.calledOnce.should.equal(true);
      });
      it('does not call the error callback', function(){
        fileView.errorCallback.calledOnce.should.equal(false);
      });
      after(function() {
        fileView.successCallback.restore();
        fileView.errorCallback.restore();
      });
    });

    describe('onUploadComplete is called with an error event', function() {
      before(function(){
        sinon.spy(fileView, 'errorCallback');
        sinon.spy(fileView, 'successCallback');
        var event = {
          origin: Pica.config.magpieUrl,
          data: {polygonImportStatus: 'Imported with some errors', importMessages: 'error or something or whatever'}
        };
        fileView.onUploadComplete(event);
      });
      it('calls the error callback', function(){
        fileView.errorCallback.calledOnce.should.equal(true);
      });
      it('does not call the success callback', function(){
        fileView.successCallback.calledOnce.should.equal(false);
      });
      after(function() {
        fileView.errorCallback.restore();
        fileView.successCallback.restore();
      });
    });

    describe("onUploadComplete is called with an event from a domain that isn't the magpie address", function() {
      before(function(){
        sinon.spy(fileView, 'errorCallback');
        sinon.spy(fileView, 'successCallback');
        var event = {
          origin: "http://google.com/"
        };
        fileView.onUploadComplete(event);
      });
      it('does not call the error callback', function(){
        fileView.errorCallback.calledOnce.should.equal(false);
      });
      it('does not call the success callbacks', function(){
        fileView.successCallback.calledOnce.should.equal(false);
      });
      after(function(){
        fileView.errorCallback.restore();
        fileView.successCallback.restore();
      });
    });

  });
});
