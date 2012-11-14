describe 'Pica.JS', ->
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
      sidebar_div = $('<div id="sidebar">')
      stub = sinon.stub($.fn, 'init')
      stub.withArgs('#sidebar').returns(sidebar_div)

      Pica.renderSidebar('#sidebar')
      assert.notEqual(sidebar_div.text().indexOf('New Area'), -1, "Sidebar doesn't contain 'New Area' text")

      $.fn.init.restore()

    it 'should create an element to load a saved Area of Interest', ->
      sidebar_div = $('<div id="sidebar">')
      stub = sinon.stub($.fn, 'init')
      stub.withArgs('#sidebar').returns(sidebar_div)

      Pica.renderSidebar('#sidebar')
      assert.notEqual(sidebar_div.text().indexOf('or load a saved Area of Interest'), -1, "Sidebar doesn't contain 'or load a saved Area of Interest' text")

      $.fn.init.restore()

    context 'when there is no data', ->
      it 'should show some initial instructions', ->
        sidebar_div = $('<div id="sidebar">')
        stub = sinon.stub($.fn, 'init')
        stub.withArgs('#sidebar').returns(sidebar_div)

        Pica.renderSidebar('#sidebar')
        assert.notEqual(sidebar_div.text().indexOf('Click on the map to start drawing your first polygon and define an Area Of Interest'), -1, "Sidebar doesn't contain introduction text")

        $.fn.init.restore()

    describe 'when there is data', ->
      it 'should create an element to delete each of the Areas'
      it 'should create a tab for each Area'
      it 'should show the name of each Layer'
      it 'should show statistics for each Layer'