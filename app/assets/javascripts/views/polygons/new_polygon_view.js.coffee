Pica.module('Views', (Views, App, Backbone, Marionette, $, _) ->

  class Views.NewPolygonView extends Pica.Views.MapEditView
    template: JST["templates/new-polygon-view"]
    events: 
      'click input': 'createPolygon'

    initialize: (polygon, map) ->
      @polygon = polygon
      @map = map
      @map.on('click', @startPolygon)

    startPolygon: (event) =>
      @map.off('click', @startPolygon)
      @mapPolygon = L.polygon([event.latlng])
      @mapPolygon.editing.enable()
      @mapPolygon.addTo(@map)

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
