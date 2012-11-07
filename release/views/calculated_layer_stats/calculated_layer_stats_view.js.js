(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Pica.Views || (Pica.Views = {});

  Pica.Views.CalculatedLayerStatsView = (function(_super) {

    __extends(CalculatedLayerStatsView, _super);

    function CalculatedLayerStatsView() {
      CalculatedLayerStatsView.__super__.constructor.apply(this, arguments);
    }

    CalculatedLayerStatsView.prototype.id = "calculated-layer-stats";

    CalculatedLayerStatsView.prototype.template = "#calculated-layer-stats-tmpl";

    CalculatedLayerStatsView.prototype.itemView = Pica.Views.CalculatedLayerStatView;

    CalculatedLayerStatsView.prototype.appendHtml = function(collectionView, itemView) {
      return collectionView.$('#calculated-layer-stats-list').append(itemView.el);
    };

    return CalculatedLayerStatsView;

  })(Backbone.Marionette.CompositeView);

}).call(this);
