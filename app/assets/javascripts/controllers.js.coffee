Pica.module('Controllers', (Controllers, App, Backbone, Marionette, $, _) ->

  class Controllers.MainRouter extends Backbone.Router
    routes:
      "new_polygon": "newPolygon"
      "analysis/:analysis_id/polygon/:id": "polygonShow"
      ".*": "start"

    initialize: (options) ->
      @controller = options.controller


    polygonShow: (analysis_id, id) =>
      @controller.showPolygon(id)

  class Controllers.MainController extends Marionette.Controller
    initialize: (options) ->
      @map = L.map('map').setView([0, 0], 2)
      tileLayerUrl = 'http://carbon-tool.cartodb.com/tiles/ne_countries/{z}/{x}/{y}.png'
      tileLayer = new L.TileLayer(tileLayerUrl, {
        maxZoom: 18
      }).addTo @map

      drawControl = new L.Control.Draw
        position: 'topleft',
        circle: false
        polyline: false
        rectangle: false
        marker: false

      @map.addControl drawControl

      drawnItems = new L.LayerGroup()

      @map.on('draw:poly-created', (e) ->
        drawnItems.addLayer(e.poly))

      @map.on('draw:rectangle-created', (e) ->
        drawnItems.addLayer(e.rect))

      @map.on('draw:circle-created', (e) ->
        drawnItems.addLayer(e.circ))

      @map.on('draw:marker-created', (e) ->
        e.marker.bindPopup('A popup!')
        drawnItems.addLayer(e.marker))

      @map.addLayer(drawnItems)

    start: () ->
      @drawNewPolygon()

    drawNewPolygon: () ->
      Pica.sidePanel.show(new Pica.Views.NewPolygonView(new Pica.Models.Polygon(), @map))
      
      Pica.vent.on("polygon:Created", @showPolygon)

    showPolygon: (polygon) ->
      Pica.router.navigate("/analysis/#{polygon.get('analysis_id')}/polygon/#{polygon.get('id')}")

      @layerStatList = new Pica.Collections.CalculatedLayerStatList(
        polygonId: polygon.get('id')
        polygonGeoJSON: polygon.get('geom')
      )
      @layerStatList.fetch(
        success: (collection, response, options) =>
          @calculatedLayerStatsView = new Pica.Views.CalculatedLayerStatsView(
            collection: collection
          )
          Pica.sidePanel.show(@calculatedLayerStatsView)
        error: () =>
          console.log 'fetch failed'
      )


  # App entry point
  Controllers.addInitializer ->
    controller = new Controllers.MainController()
    Pica.router = new Controllers.MainRouter(controller: controller)

    controller.start()
)
