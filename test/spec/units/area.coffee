describe('Pica.Models.Area', ->
  describe('creating a new area', ->
    success = undefined
    error = undefined
    pica = window.TestHelpers.buildPicaApplication()

    before((done) ->
      pica.newWorkspace()
      
      newArea = new Pica.Models.Area
      pica.currentWorkspace.addArea(newArea)
      pica.currentWorkspace.setCurrentArea(newArea)

      success = sinon.spy(->
        done()
      )
      error = sinon.spy(->
        done()
      )
      newArea.save(
        success: success
        error: error
      )
    )

    it('saves the parent workspace and sets the area.workspace_id attribute', ->
      expect(pica.currentWorkspace.get('id')).to.be.a('number')
      expect(pica.currentWorkspace.currentArea.get('workspace_id')).to.equal(pica.currentWorkspace.get('id'))
    )
    it('saves the area', ->
      expect(pica.currentWorkspace.currentArea.get('id')).to.be.a('number')
    )
    it('calls the success callback', ->
      expect(success.calledOnce).to.equal(true)
    )
    it('does not call the error callback', ->
      expect(error.calledOnce).to.equal(false)
    )
  )
)
