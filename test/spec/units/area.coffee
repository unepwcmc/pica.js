describe('Pica.Models.Area', ->
  describe('saving a new area', ->
    success = error = server = null
    server = sinon.fakeServer.create()
    pica = window.TestHelpers.buildPicaApplication()
    pica.newWorkspace()
    TestHelpers.MagpieRespond.getProjects(server)

    before((done) ->
      
      newArea = new Pica.Models.Area
      console.log "built area"
      console.log server.requests.length
      pica.currentWorkspace.addArea(newArea)
      console.log "added to workspace"
      console.log server.requests.length
      pica.currentWorkspace.setCurrentArea(newArea)
      console.log "set as current"
      console.log server.requests.length

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
      done()
    )

    it('should send a workspace save request to magpie', ->
      console.log "saved, remaining: "
      console.log server.requests.length
      server.request
    )

    describe('when magpie responds with a workspace id', ->

      it('saves the parent workspace and sets the area.workspace_id attribute', ->
        expect(pica.currentWorkspace.get('id')).to.be.a('number')
      )

      it('should send an area save request to magpie')

      describe('when magpie responds with an area id', ->

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
