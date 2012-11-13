describe 'Pica', ->
  describe '#truth()', ->
    it 'should return Boolean true', ->
      assert(Pica.truth())

  describe '#start()', ->
    it 'should render a map', ->
      stub = sinon.stub(L, 'map', (id) -> )

      Pica.start({map: 'map'})
      assert(stub.calledWith('map'));

      L.map.restore()

    it 'should call the renderSidebar method', ->
      spy = sinon.spy(Pica, 'renderSidebar')
      Pica.start()
      assert.equal(spy.callCount, 1)

  describe '#renderSidebar()', ->
    it 'should create an element to create a New Area'
    it 'should create an element to load a saved Area of Interest'

    describe 'when there is data', ->
      it 'should create an element to delete each of the Areas'
      it 'should create a tab for each Area'
      it 'should show the name of each Layer'
      it 'should show statistics for each Layer'
