describe 'Pica', ->
  describe '#constructor()', ->
    it 'should call createWorkspace method', ->
      stub = sinon.stub(Pica.prototype, 'createWorkspace')

      pica = new Pica()
      assert(stub.calledOnce)

      stub.restore()

    it 'should call fetch method', ->
      stub = sinon.stub(Pica.prototype, 'fetch')

      pica = new Pica()
      assert(stub.calledOnce)

      stub.restore()

  describe '#createWorkspace()', ->
    it 'should create a new Workspace'

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

  describe '#parse()', ->
    it 'should save layers'

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
