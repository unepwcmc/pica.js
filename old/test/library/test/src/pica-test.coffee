describe 'Pica', ->
  describe '#constructor()', ->
    beforeEach ->
      @createWorkspaceStub = sinon.stub(Pica.prototype, 'createWorkspace')
      @fetchStub = sinon.stub(Pica.prototype, 'fetch')

    afterEach ->
      @createWorkspaceStub.restore()
      @fetchStub.restore()

    it 'should call createWorkspace method', ->
      pica = new Pica()
      assert(@createWorkspaceStub.calledOnce)

    it 'should call fetch method', ->
      pica = new Pica()
      assert(@fetchStub.calledOnce)

  describe '#renderMap()', ->
    it 'should create a new Map'

  describe '#renderSidepanel()', ->
    it 'should create a new Sidepanel'

  describe '#createWorkspace()', ->
    it 'should create a new Workspace'

  describe '#getWorkspaceIdFromUrl()', ->
    describe 'When there is a workspace_id on the URL', ->
      it 'should return it', ->
        stub = sinon.stub(Pica.prototype, 'getLocationHash').returns('#workspace/1')

        pica = new Pica()
        assert.equal(pica.getWorkspaceIdFromUrl(), 1)

        stub.restore()

    describe "When there isn't a workspace_id on the URL", ->
      it 'should return NULL', ->
        stub = sinon.stub(Pica.prototype, 'getLocationHash').returns('')

        pica = new Pica()
        assert.equal(pica.getWorkspaceIdFromUrl(), null)

        stub.restore()

  describe '#fetch()', ->
    it 'should make an ajax call', ->
      server = sinon.fakeServer.create()
      server.respondWith("GET", "http://magpie.com/api/v1/applications/1.json", [200, {"Content-Type": "application/json"}, '{"layers": [{"id": 1, "display_name": "Mangroves"}]}'])

      stub = sinon.stub(Pica.prototype, 'parse')

      pica = new Pica({server_url: 'http://magpie.com/api/v1'})
      pica.fetch()
      server.respond()
      assert(stub.calledWith({layers: [{id: 1, display_name: "Mangroves"}]}))

      server.restore()

    it "should not make an ajax call if there isn't a server_url", ->
      spy = sinon.spy($, 'ajax')

      pica = new Pica()
      pica.fetch()
      assert.fail($.ajax.calledOnce)

      $.ajax.restore()

  describe '#parse()', ->
    it 'should not throw an error'
    it 'should save layers'

  describe '#getLayers()', ->
    it 'should return the list of layers for the application'

describe 'Map', ->
  describe '#constructor()', ->
    beforeEach ->
      @mapStub = sinon.stub()
      @leafletStub = sinon.stub(window.L, 'map').returns(@mapStub)
      @defineMapEventHandlersStub = sinon.stub(Map.prototype, 'defineMapEventHandlers')

    afterEach ->
      @leafletStub.restore()
      @defineMapEventHandlersStub.restore()

    it 'should create a new Leaflet map', ->
      new Map({dom_id: 'map-id'})
      assert(@leafletStub.calledWith('map-id'), 'creates a new Leaflet map')

    it 'should call defineMapEventHandlers method', ->
      map = new Map()
      assert(@defineMapEventHandlersStub.calledWith(@mapStub), 'calls defineMapEventHandlers method')

  describe '#defineMapEventHandlers()', ->
    it 'should enable Leaflet.Polygon.Draw tool'
    it "should create listener to 'draw:poly-created' event on map"

  describe '#addPolygon()', ->
    it 'should add event polygon to map', ->
      stub = sinon.stub()
      leafletStub = sinon.stub(window.L, 'map').returns(@mapStub)
      polygonDrawEvent = {poly: {addTo: stub}}

      map = new Map()
      map.addPolygon(polygonDrawEvent)
      assert(stub.calledOnce)

      leafletStub.restore()

    it 'should call addPolygon on the current area of interest'
