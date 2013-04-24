describe('Pica.Models.Area', ->
  describe('saving a new area', ->
    success = error = server = pica = null
    magpieServer = new TestHelpers.FakeMagpieServer()

    before( ->
      pica = window.TestHelpers.buildPicaApplication()
      pica.newWorkspace()
      magpieServer.respondTo('projectIndex')

      success = sinon.spy()
      error = sinon.spy()
      pica.currentWorkspace.currentArea.save(
        success: success
        error: error
      )
    )

    it('should send a workspace save request to magpie', ->
      expect(magpieServer.hasReceivedRequest('workspaceSave')).to.be.ok()
    )

    describe('when magpie responds with a workspace id', ->

      before(->
        console.log "Reponding to save workspace"
        magpieServer.respondTo('workspaceSave')
        magpieServer.respondTo('projectIndex')
        magpieServer.respondTo('workspaceSave')
      )

      it('saves the parent workspace and sets the area.workspace_id attribute', ->
        console.log "gon' check if workspace id is a number"
        expect(pica.currentWorkspace.get('id')).to.be.a('number')
      )

      it('should send an area save request to magpie', ->
        expect(magpieServer.hasReceivedRequest('areaSave')).to.be.ok()
      )

      describe('when magpie responds with an area id', ->

        before(->
          magpieServer.respondTo('areaSave')
          magpieServer.respondTo('areaSave')
        )

        it('sets the area.workspace_id attribute', ->
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
    after(->
      magpieServer.server.restore()
    )
  )
)
