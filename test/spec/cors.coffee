describe "Pica.Models.Workspace", ->
  describe "when saving to a working magpie server", ->
    success = undefined
    error = undefined
    before (done) ->
      
      # TODO application exists
      pica = new Pica.Application(
        magpieUrl: window.TESTS.magpieServer
        projectId: 8
        map: TestHelpers.map
      )
      
      # Create a new workspace to work in
      pica.newWorkspace()
      success = sinon.spy(->
        done()
      )
      error = sinon.spy((a, b, theError) ->
        done()
      )
      
      # create a file view
      fileView = pica.currentWorkspace.save(
        success: success
        error: error
      )

    it "calls the success callback", ->
      expect(success.calledOnce).to.equal true

    it "does not call the error callback", ->
      expect(error.calledOnce).to.equal false

describe 'Pica.Models.Polygon', ->

  describe 'saving a new polygon', ->

    success = error = server = pica = magpieServer = null

    before (done) ->
      pica = new Pica.Application(
        magpieUrl: window.TESTS.magpieServer
        projectId: 8
        map: TestHelpers.map
      )
 
      pica.newWorkspace()

      success = sinon.spy(->
        done()
      )
      error = sinon.spy((a, b, theError) ->
        done()
      )
      currentArea = pica.currentWorkspace.currentArea
      currentArea.createPolygon()
      currentArea.currentPolygon.save(
        success: success
        error: error
      )

    it('saves the parent workspace and sets the area.workspace_id attribute', ->
      expect(pica.currentWorkspace.get('id')).to.be.a('number')
    )
  
    it('sets the polygon.area_id attribute', ->
      expect(
        pica.currentWorkspace.currentArea.currentPolygon.get('area_id'))
          .to.equal(pica.currentWorkspace.currentArea.get('id'))
    )
    it('saves the area', ->
      expect(pica.currentWorkspace.currentArea.get('id'))
        .to.be.a('number')
    )

    it('saves the polygon', ->
      expect(pica.currentWorkspace.currentArea.currentPolygon
        .get('id')).to.be.a('number')
    )

    it('calls the success callback', ->
      expect(success.calledOnce).to.equal(true)
    )
    it('does not call the error callback', ->
      expect(error.calledOnce).to.equal(false)
    )

