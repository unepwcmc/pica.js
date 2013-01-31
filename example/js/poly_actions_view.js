/* == PolyActionsView.js == 
Show options dialog when a polygon is clicked */

window.PicaExample || (window.PicaExample = {});
window.PicaExample.PolyActionsView = (function() {
  PolyActionsView.prototype.render = function(area) {
    this.el = $(document.createElement('div'));
    this.el.attr('class', 'polyActions');
    this.el.css('position', 'absolute');
    this.el.css('left', this.event.containerPoint.x);
    this.el.css('top', this.event.containerPoint.y);
    this.el.css('height', '50px');
    this.el.css('width', '300px');
    this.el.html('<input type="submit" value="Delete polygon ' + this.polygon.get('id') + '?"/>');
    $('body').append(this.el);
  };

  PolyActionsView.prototype.deletePolygon = function(event) {
    var _this = this;
    console.log(this.polygon)
    console.log(this.polygon.destroy)
    this.polygon.destroy({
      success: function() {_this.close();}
    });
  };

  PolyActionsView.prototype.addBindings = function() {
    var _this = this;
    this.el.find('input').on('click', function(){
      _this.deletePolygon(arguments);
    });
    // close when clicking elsewhere
    $('body').click(function() {_this.close();})
    this.el.click(function(e) {e.stopPropagation();})
  };

  PolyActionsView.prototype.close = function() {
    var _this = this;
    $('body').off('click', function() {_this.close();})
    this.el.unbind();
    this.el.remove();
  };

  function PolyActionsView(polygon, event, mapPolygon) {
    var _this = this;
    this.polygon = polygon;
    this.event = event;
    this.mapPolygon = mapPolygon;
    this.render();
    this.addBindings();
  };

  return PolyActionsView;
})();
