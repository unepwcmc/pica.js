describe 'PicaData.JS', ->
  describe '#fetch()', ->
    before ->
      @server = sinon.fakeServer.create()

    after ->
      @server.restore()

    it 'should reset the data from the server', ->
      @server.respondWith("GET", "all.json", [200, {"Content-Type": "application/json"}, '{"id": 1}'])

      callback = sinon.spy()

      picaData = new PicaData()
      picaData.fetch({success: callback})
      @server.respond()

      sinon.assert.calledWith(callback, {id: 1})

    it 'should use the config.url'
