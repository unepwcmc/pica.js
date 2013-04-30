describe 'Pica.Models.Area', ->
  describe '.constructor', ->
    describe 'when given a pica application', ->
      pica = area = null
      before ->
        pica = {config: "I'm only a mock!"}
        area = new Pica.Models.Area(pica)
        
      it 'stores a references to the given pica application', ->
        expect(area.app).to.equal(pica)

    describe 'when not given a pica application', ->
      it 'throws an error', ->
        expect(->
          new Pica.Models.Area()
        ).to.throwException((e)->
          expect(e).to.be.equal('Cannot create a Pica.Model without specifying a Pica.Application')
        )

  describe '.createPolygon', ->
    area = null
    before ->
      area = new Pica.Models.Area({config: "I'm a mock!"})
      area.createPolygon()

    it 'creates a new polygon and stores it in .currentPolygon', ->
      expect(area.currentPolygon).not.to.be(undefined)

  describe '.save', ->

    success = error = server = pica = magpieServer = null

    before ->
      magpieServer = new window.TestHelpers.FakeMagpieServer()
      # When we create a new pica application, we make a first ajax
      # request ( calling @fetch ).
      pica = window.TestHelpers.buildPicaApplication()
      pica.newWorkspace()
      # Forcing a response from our fake magpie server.
      # This also `pops` the request from the `magpieServer.requests array.
      magpieServer.respondTo('projectIndex')
      # At this point `magpieServer.server.requests.length == 0`
      success = sinon.spy()
      error = sinon.spy()
      # Here a new request is getting fired.
      # See Pica.Model.sync in pica_model.js.coffee
      pica.currentWorkspace.currentArea.save(
        success: success
        error: error
      )
      # At this point `magpieServer.server.requests.length == 1`

    after ->
      # We need to restore the server or it will interfere with tests
      # in different modules.
      magpieServer.server.restore()


    it('should send a workspace save request to magpie', ->
      expect(magpieServer.hasReceivedRequest('workspaceSave')).to.be.ok()
    )

    describe('when magpie responds with a workspace id', ->

      before(->
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
        )

        it('sets the area.workspace_id attribute', ->
          expect(pica.currentWorkspace.currentArea.get('workspace_id'))
            .to.equal(pica.currentWorkspace.get('id'))
        )
        it('saves the area', ->
          expect(pica.currentWorkspace.currentArea.get('id'))
            .to.be.a('number')
        )
        it('calls the success callback', ->
          expect(success.calledOnce).to.equal(true)
        )
        it('does not call the error callback', ->
          expect(error.calledOnce).to.equal(false)
        )
      )
    )


