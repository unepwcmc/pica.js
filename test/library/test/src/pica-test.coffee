describe 'Pica', ->
  describe '#constructor()', ->
    it 'should create a Workspace', ->
      stub = sinon.stub(Pica.prototype, 'createWorkspace')

      pica = new Pica()
      assert(stub.calledOnce)

      stub.restore()

    it 'should render the Map with map_id and workspace params', ->
      workspace = sinon.stub()

      renderMapStub = sinon.stub(Pica.prototype, 'renderMap')
      createWorkspaceStub = sinon.stub(Pica.prototype, 'createWorkspace').returns(workspace)

      pica = new Pica({map_id: 'mapId'})
      assert(renderMapStub.calledWith('mapId', workspace))

      renderMapStub.restore()
      createWorkspaceStub.restore()

    it 'should render the Sidepanel with sidepanel_id and workspace params', ->
      workspace = sinon.stub()

      renderSidepanelStub = sinon.stub(Pica.prototype, 'renderSidepanel')
      createWorkspaceStub = sinon.stub(Pica.prototype, 'createWorkspace').returns(workspace)

      pica = new Pica({sidepanel_id: 'sidepanelId'})
      assert(renderSidepanelStub.calledWith('sidepanelId', workspace))

      renderSidepanelStub.restore()
      createWorkspaceStub.restore()

    describe 'when there is a workspace_id on the URL', ->
      it 'should pass it to createWorkspace', ->
        getWorkspaceIdFromUrlStub = sinon.stub(Pica.prototype, 'getWorkspaceIdFromUrl').returns(1)
        createWorkspaceStub = sinon.stub(Pica.prototype, 'createWorkspace')

        pica = new Pica()
        assert(createWorkspaceStub.calledWith(1))

        getWorkspaceIdFromUrlStub.restore()
        createWorkspaceStub.restore()

  describe '#getWorkspaceIdFromUrl()', ->
    describe 'when there is a workspace_id on the URL', ->
      it 'should return it', ->
        stub = sinon.stub(window.location, 'hash').returns('#workspace/1')

        pica = new Pica()
        assert.equal(pica.getWorkspaceIdFromUrl(), 1)

        stub.restore()

    describe "when there isn't a workspace_id on the URL", ->
      it 'should return NULL', ->
        stub = sinon.stub(window.location, 'hash').returns('')

        pica = new Pica()
        assert.equal(pica.getWorkspaceIdFromUrl(), null)

        stub.restore()
