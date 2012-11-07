(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Pica.Views || (Pica.Views = {});

  Pica.Views.CalculatedLayerStatView = (function(_super) {

    __extends(CalculatedLayerStatView, _super);

    function CalculatedLayerStatView() {
      CalculatedLayerStatView.__super__.constructor.apply(this, arguments);
    }

    CalculatedLayerStatView.prototype.template = '#calculated-layer-stat-tmpl';

    CalculatedLayerStatView.prototype.tagName = 'li';

    return CalculatedLayerStatView;

  })(Backbone.Marionette.ItemView);

}).call(this);
