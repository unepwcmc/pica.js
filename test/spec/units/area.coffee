describe('Pica.Models.Area', ->
  describe('saving a new area', ->
    success = error = server = pica = null

    before( ->
      server = sinon.fakeServer.create()
      pica = window.TestHelpers.buildPicaApplication()
      pica.newWorkspace()
      TestHelpers.Magpie.Respond.getProjects(server)

      success = sinon.spy()
      error = sinon.spy()
      pica.currentWorkspace.currentArea.save(
        success: success
        error: error
      )
    )

    it('should send a workspace save request to magpie', ->
      expect(server.requests[0].url).to.match(
        TestHelpers.Magpie.UrlMatchers.workspaceIndex
      )
    )

    describe('when magpie responds with a workspace id', ->

      before(->
        TestHelpers.Magpie.Respond.saveWorkspace(server)
      )

      it('saves the parent workspace and sets the area.workspace_id attribute', ->
        expect(pica.currentWorkspace.get('id')).to.be.a('number')
      )

      it('should send an area save request to magpie', ->
        expect(server.requests[0].url).to.match(
          TestHelpers.Magpie.UrlMatchers.areasIndex
        )
      )

      describe('when magpie responds with an area id', ->

        before(->
          TestHelpers.Magpie.Respond.saveArea(server)
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
      server.restore()
    )
  )
)
