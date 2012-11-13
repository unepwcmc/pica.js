var assert = chai.assert;

describe('Pica', function(){
  describe('#start()', function(){
    it('should render a map', function() {
      var stub = sinon.stub(L, 'map', function(id) {});

      Pica.start({map: 'map'});
      assert(stub.calledWith('map'));

      L.map.restore();
    })
  })
})
