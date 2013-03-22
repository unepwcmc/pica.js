
describe('Pica.Models.Area', function() {
  return describe('creating a new area', function() {
    before(function() {
      var pica;
      pica = window.TestHelpers.buildPicaApplication();
      return pica.newWorkspace();
    });
    it('saves the parent workspace and sets the area.workspace_id attribute');
    it('saves the area');
    return it('calls the success callback');
  });
});
