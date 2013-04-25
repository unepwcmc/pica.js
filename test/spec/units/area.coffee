describe 'Pica.Models.Area', ->

  describe 'saving a new area', ->

    success = error = server = pica = magpieServer = null

    before ->
      magpieServer = new window.TestHelpers.FakeMagpieServer()
      # When we create a new pica application, we make a first ajax
      # request ( calling @fetch ).
      pica = window.TestHelpers.buildPicaApplication()
      # At this point `magpieServer.server.requests.length == 1`
      pica.newWorkspace()
      # Forcing a response from our fake magpie server.
      magpieServer.respondTo('projectIndex')
      success = sinon.spy()
      error = sinon.spy()
      # Here a new request is getting fired.
      # See Pica.Model.sync in pica_model.js.coffee
      pica.currentWorkspace.currentArea.save(
        success: success
        error: error
      )
      # At this point `magpieServer.server.requests.length == 2`

    after ->
      # We need to restore the server or it will interfere with tests 
      # in different modules.
      magpieServer.server.restore()


    it('should send a workspace save request to magpie', ->
      expect(magpieServer.hasReceivedRequest('workspaceSave')).to.be.ok()
    )

    it('should have received 2 requests', ->
      expect(magpieServer.server.requests.length).to.be(2)
    )

    describe('when magpie responds with a workspace id', ->

      before(->
        magpieServer.respondTo('workspaceSave')
        magpieServer.respondTo('projectIndex')
        magpieServer.respondTo('workspaceSave')
      )

      it('saves the parent workspace and sets the area.workspace_id attribute', ->
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
          expect(pica.currentWorkspace.currentArea.get('workspace_id'))
            .to.equal(pica.currentWorkspace.get('id'))
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


