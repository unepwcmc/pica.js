Pica.module('Views', (Views, App, Backbone, Marionette, $, _) ->

  class Views.NewPolygonView extends Pica.Views.MapEditView
    template: JST["templates/new-polygon-view"]
    events: 
      'click input': 'createPolygon'

    initialize: (polygon) ->
      @polygon = polygon

      (new L.Polygon.Draw(Pica.map, {})).enable()

      Pica.map.on 'draw:poly-created', (e) =>
        @mapPolygon = e.poly
        @mapPolygon.addTo(Pica.map)

    createPolygon: () ->
      @polygon.setGeomFromPoints(@mapPolygon.getLatLngs())
      @polygon.save(
        @polygon.attributes,
        {success: (model, response, options) ->
          Pica.vent.trigger("polygon:Created", model)
        }
      )

      #window.open("#/analysis/#{@polygon.get('analysis_id')}/polygon/#{@polygon.get('id')}")

    render: =>
      @$el.html(@template())
      return this
)
