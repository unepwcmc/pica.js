(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Pica.Collections || (Pica.Collections = []);

  Pica.Collections.CalculatedLayerStats = (function(_super) {

    __extends(CalculatedLayerStats, _super);

    function CalculatedLayerStats() {
      CalculatedLayerStats.__super__.constructor.apply(this, arguments);
    }

    CalculatedLayerStats.prototype.model = Pica.Models.CalculatedLayerStat;

    return CalculatedLayerStats;

  })(Backbone.Collection);

}).call(this);
