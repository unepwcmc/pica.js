(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Pica.Views || (Pica.Views = {});

  Pica.Views.DrawOrLoadView = (function(_super) {

    __extends(DrawOrLoadView, _super);

    function DrawOrLoadView() {
      this.render = __bind(this.render, this);
      DrawOrLoadView.__super__.constructor.apply(this, arguments);
    }

    DrawOrLoadView.prototype.el = '#start_modal';

    DrawOrLoadView.prototype.initialize = function() {};

    DrawOrLoadView.prototype.render = function() {
      return this;
    };

    return DrawOrLoadView;

  })(Backbone.View);

}).call(this);
