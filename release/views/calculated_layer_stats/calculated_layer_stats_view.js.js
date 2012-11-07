(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Pica.Views || (Pica.Views = {});

  Pica.Views.CalculatedLayerStatsView = (function(_super) {

    __extends(CalculatedLayerStatsView, _super);

    function CalculatedLayerStatsView() {
      CalculatedLayerStatsView.__super__.constructor.apply(this, arguments);
    }

    CalculatedLayerStatsView.prototype.tagName = "ul";

    CalculatedLayerStatsView.prototype.id = "calculated_layer_stats";

    CalculatedLayerStatsView.prototype.template = "#calculated_layer_stats_tmpl";

    CalculatedLayerStatsView.prototype.itemView = Pica.Views.CalculatedLayerStatView;

    CalculatedLayerStatsView.prototype.appendHtml = function(collectionView, itemView) {
      return collectionView.$el.append(itemView.el);
    };

    return CalculatedLayerStatsView;

  })(Backbone.Marionette.CompositeView);

}).call(this);
