describe('Pica.Models.Workspace', function(){
  describe('when saving to a working magpie server', function(){
    var success, error;
    before(function(done){
      // TODO put in mapExistsHelper
      var map = L.map('map',{
        center: [24.5,54],
        zoom: 9
      });

      // TODO application exists
      var pica = new Pica.Application({
        magpieUrl: window.TESTS.magpieServer,
        projectId: 5,
        map: map
      });
      // Create a new workspace to work in
      pica.newWorkspace();

      success = sinon.spy(function(){
        done();
      });
      error = sinon.spy(function(a,b,theError){
        done();
      });

      // create a file view
      var fileView = pica.currentWorkspace.save({
        success: success,
        error: error
      });
    });

    it('calls the success callback', function(){
      expect(success.calledOnce).to.equal(true);
    });
    it('does not call the error callback', function(){
      expect(error.calledOnce).to.equal(false);
    });
  });
});