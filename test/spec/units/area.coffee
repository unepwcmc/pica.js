describe('Pica.Models.Area', ->
  describe('creating a new area', ->
    before(->
      pica = window.TestHelpers.buildPicaApplication()
      pica.newWorkspace()
    )
    it('saves the parent workspace and sets the area.workspace_id attribute')
    it('saves the area')
    it('calls the success callback')
  )
)
