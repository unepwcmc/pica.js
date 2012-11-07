(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Pica.Models || (Pica.Models = []);

  Pica.Models.CalculatedLayerStat = (function(_super) {

    __extends(CalculatedLayerStat, _super);

    function CalculatedLayerStat() {
      CalculatedLayerStat.__super__.constructor.apply(this, arguments);
    }

    CalculatedLayerStat.prototype.url = function() {
      return "" + window.PICA.magpieAddress + "/polygon";
    };

    return CalculatedLayerStat;

  })(Backbone.Model);

}).call(this);
