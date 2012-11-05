Pica.Views ||= {}

class Pica.Views.NewPolygonView extends Pica.Views.MapEditView
  events: 
    'click #analyse': 'createPolygon'

  initialize: () ->
    @polygon = new Pica.Models.Polygon()

  createPolygon: () ->
    # Post geoJSON to magpie
    @polygon.save

    PICA.router.navigate("/analysis/#{@polygon.get('analysis_id')}/polygon/#{@polygon.get('id')}")

  render: =>
    return this
