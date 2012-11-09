(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Pica.module('Views', function(Views, App, Backbone, Marionette, $, _) {
    return Views.NewPolygonView = (function(_super) {

      __extends(NewPolygonView, _super);

      function NewPolygonView() {
        this.render = __bind(this.render, this);
        this.startPolygon = __bind(this.startPolygon, this);
        NewPolygonView.__super__.constructor.apply(this, arguments);
      }

      NewPolygonView.prototype.template = '#new-polygon-view-tmpl';

      NewPolygonView.prototype.events = {
        'click input': 'createPolygon'
      };

      NewPolygonView.prototype.initialize = function(polygon, map) {
        this.polygon = polygon;
        this.map = map;
        return this.map.on('click', this.startPolygon);
      };

      NewPolygonView.prototype.startPolygon = function(event) {
        this.map.off('click', this.startPolygon);
        this.mapPolygon = L.polygon([event.latlng]);
        this.mapPolygon.editing.enable();
        return this.mapPolygon.addTo(this.map);
      };

      NewPolygonView.prototype.createPolygon = function() {
        return Pica.vent.trigger("polygon:Created", this.polygon);
      };

      NewPolygonView.prototype.render = function() {
        var compiledTemplate;
        compiledTemplate = _.template($(this.template).html());
        this.$el.html(compiledTemplate());
        return this;
      };

      return NewPolygonView;

    })(Pica.Views.MapEditView);
  });

}).call(this);
