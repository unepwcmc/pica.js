Pica.module('Views', (Views, App, Backbone, Marionette, $, _) ->

  class Views.NewPolygonView extends Pica.Views.MapEditView
    template: '#new-polygon-view-tmpl'
    events: 
      'click input': 'createPolygon'

    initialize: (map) ->
      @polygon = new Pica.Models.Polygon()
      @map = map
      @map.on('click', @startPolygon)

    startPolygon: (event) =>
      @map.off('click', @startPolygon)
      @mapPolygon = L.polygon([event.latlng])
      @mapPolygon.editing.enable()
      @mapPolygon.addTo(@map)

    createPolygon: () ->
      # TODO: actually save
      Pica.vent.trigger("routeTo:polygonShow", @polygon)

    render: =>
      compiledTemplate = _.template($(@template).html())

      @$el.html(compiledTemplate())
      return this
)
