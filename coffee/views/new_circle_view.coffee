define [], ->

  class PicaViewsNewCircleView
    constructor: (@options) ->
      if @options.callbacks?
        @successCallback = @options.callbacks.success
        @errorCallback = @options.callbacks.error
  
      @polygon = @options.polygon
      @polygon.set('geometry', {type:'Circle'})
  
      # Turn on Leaflet.draw polygon tool
      @polygonDraw = new L.Circle.Draw(@options.map, {})
      @polygonDraw.enable()
  
      @options.map.on 'draw:circle-created', (e) =>
        @createPolygon e.circ
  
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
      @options.map.off('draw:circle-created')
