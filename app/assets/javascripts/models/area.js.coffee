class Pica.Models.Area extends Pica.Events
  constructor: () ->
    @polygons = []

  addPolygon: (polygon) ->
    polygon.on('requestAreaId', @save)
    @polygons.push(polygon)
  
  drawNewPolygonView: (finishedCallback) ->
    @currentPolygon = new Pica.Models.Polygon()
    @addPolygon(@currentPolygon)
    new Pica.Views.NewPolygonView(
      finishedCallback: finishedCallback
      polygon: @currentPolygon
    )

  save: () ->

