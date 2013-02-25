describe('Pica.Views.UploadFileView', function(){
  describe('when a view exists and has been rendered', function(){

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
      var fileView = pica.currentWorkspace.currentArea.newUploadFileView();
      $('#side-panel').prepend(fileView.el);
      fileView.render();
    });
    it('creates an iframe for the file upload', function(){
      $('#side-panel iframe').length.should.equal(1);
    });

    describe('when an upload complete message is triggered', function(){
      before(function(){
        window.postMessage({polygonImportStatus: 'Complete', importMessages: 'Something goes here'}, '*');
      });
      it('fires the callback');
    });
  });
});
