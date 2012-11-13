var assert = chai.assert;

describe('Pica', function(){
  describe('#new()', function(){
    it('should return an object', function(){
      var pica = Pica.new();
      assert.typeOf(pica, 'object');
    })
  })
})
