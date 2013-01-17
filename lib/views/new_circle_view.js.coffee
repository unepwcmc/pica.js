class Pica.Views.NewCircleView
  constructor: (options) ->
    if options.callbacks?
      @successCallback = options.callbacks.success
      @errorCallback = options.callbacks.error

    @polygon = options.polygon
    @polygon.set('geometry', {type:'Circle'})

    # Turn on Leaflet.draw polygon tool
    @polygonDraw = new L.Circle.Draw(Pica.config.map, {})
    @polygonDraw.enable()

    Pica.config.map.on 'draw:circle-created', (e) =>
      mapCircle = e.circ
      @createPolygon mapCircle

  createPolygon: (mapCircle) ->
    @polygon.setGeomFromCircle(mapCircle.getLatLng(), mapCircle.getRadius())
    @polygon.save(
      success: =>
        @close()
        @successCallback() if @successCallback?
      error: (xhr, textStatus, errorThrown) =>
        @close()
        @errorCallback.apply(@, arguments) if @errorCallback?
    )

  close: () ->
    @polygonDraw.disable()
    Pica.config.map.off('draw:poly-created')
