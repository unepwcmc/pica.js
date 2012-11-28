/* == AreaView.js == 
Render an area's stats as they are calculated */

window.PicaExample || (window.PicaExample = {});
window.PicaExample.AreaView = (function() {

  AreaView.prototype.render = function(area) {
    var stat, stats, _i, _len;
    stats = area.get('results');
    if (typeof(stats) !== 'undefined') {
      $(this.targetElement).html('');
      for (_i = 0, _len = stats.length; _i < _len; _i++) {
        stat = stats[_i];
        $(this.targetElement).append(stat.display_name + ": " + stat.value + stat.unit + "<br/>");
      }
    }
  };

  function AreaView(targetElement) {
    var _this = this;
    this.targetElement = targetElement;
    // Listen for the 'sync' event on the area, which is triggered when stats are updated
    pica.currentWorkspace.currentArea.on("sync", function(area) {
      _this.render(area);
    });
  };

  return AreaView;
})();
