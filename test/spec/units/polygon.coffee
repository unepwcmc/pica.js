describe 'Pica.Models.Polygon', ->
  describe '.constructor', ->
    describe 'when given a pica application', ->
      pica = polygon = null
      before ->
        pica = {config: "I'm only a mock!"}
        polygon = new Pica.Models.Polygon(pica)
        
      it 'stores a references to the given pica application', ->
        expect(polygon.app).to.equal(pica)

    describe 'when not given a pica application', ->
      it 'throws an error', ->
        expect(->
          new Pica.Models.Polygon()
        ).to.throwException((e)->
          expect(e).to.be.equal('Cannot create a Pica.Model without specifying a Pica.Application')
        )

  describe 'saving a new polygon', ->

    success = error = server = pica = magpieServer = null

    before ->
      magpieServer = new window.TestHelpers.FakeMagpieServer()
      # When we create a new pica application, we make a first ajax
      # request ( calling @fetch ).
      pica = window.TestHelpers.buildPicaApplication()
      # At this point `magpieServer.server.requests.length == 1`
      pica.newWorkspace()
      # Forcing a response from our fake magpie server.
      # This also `pops` the request from the `magpieServer.requests array.
      magpieServer.respondTo('projectIndex')
      # At this point `magpieServer.server.requests.length == 0`
      success = sinon.spy()
      error = sinon.spy()
      currentArea = pica.currentWorkspace.currentArea
      currentArea.createPolygon()
      currentArea.currentPolygon.save(
        success: success
        error: error
      )
    
    after ->
      # We need to restore the server or it will interfere with tests
      # in different modules.
      magpieServer.server.restore()

    it 'sends a workspace save request to magpie', ->
      expect(magpieServer.hasReceivedRequest('workspaceSave')).to.be.ok()

    it 'receives 1 request', ->
      expect(magpieServer.server.requests.length).to.be(1)

    describe 'when magpie responds with a workspace id', ->
    
      before ->
        magpieServer.respondTo('workspaceSave')
    
      it 'saves the parent workspace and sets the area.workspace_id attribute', ->
        expect(pica.currentWorkspace.get('id')).to.be.a('number')
    
      it 'should send an area save request to magpie', ->
        expect(magpieServer.hasReceivedRequest('areaSave')).to.be.ok()

    
      describe 'when magpie responds with an area id', ->
    
        before ->
          magpieServer.respondTo('areaSave')
    
        it 'sets the polygon.area_id attribute', ->
          expect(
            pica.currentWorkspace.currentArea.currentPolygon.get('area_id'))
              .to.equal(pica.currentWorkspace.currentArea.get('id'))

        it 'saves the area', ->
          expect(pica.currentWorkspace.currentArea.get('id'))
            .to.be.a('number')

        it 'should send polygon save request to magpie', ->
          expect(magpieServer.hasReceivedRequest('polygonSave')).to.be.ok()

        describe 'when magpie responds with an area id', ->

          before ->
            magpieServer.respondTo('polygonSave')

          it 'saves the polygon', ->
            expect(pica.currentWorkspace.currentArea.currentPolygon
              .get('id')).to.be.a('number')

          it 'calls the success callback', ->
            expect(success.calledOnce).to.equal(true)

          it 'does not call the error callback', ->
            expect(error.calledOnce).to.equal(false)
