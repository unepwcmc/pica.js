describe 'Pica', ->
  describe '#start()', ->
    it 'should render the map', ->
      stub = sinon.stub(Pica, 'renderMap')
      Pica.start({map: 'map'})
      assert(stub.calledWith('map'))

      Pica.renderMap.restore()

    it 'should render the sidebar', ->
      stub = sinon.stub(Pica, 'renderSidebar')
      Pica.start({sidebar: '#sidebar'})
      assert(stub.calledWith('#sidebar'))

      Pica.renderSidebar.restore()

  describe '#renderMap()', ->
    it 'should render a map with Leaflet', ->
      stub = sinon.stub(L, 'map')

      Pica.renderMap('map')
      assert(stub.calledWith('map'))

      L.map.restore()

  describe '#renderSidebar()', ->
    it 'should create a New Area element', ->
      sidebar_div = $('<div>')
      stub = sinon.stub($.fn, 'init', -> sidebar_div)

      Pica.renderSidebar()

      $.fn.init.restore()

    it 'should create an element to load a saved Area of Interest'

    context 'when there is no data', ->
      it 'should show some initial instructions'

    describe 'when there is data', ->
      it 'should create an element to delete each of the Areas'
      it 'should create a tab for each Area'
      it 'should show the name of each Layer'
      it 'should show statistics for each Layer'
