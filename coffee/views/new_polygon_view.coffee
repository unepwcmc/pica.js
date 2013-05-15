define [

],  ->

  class PicaViewsNewPolygonView
    constructor: (@options) ->
      if @options.callbacks?
        @successCallback = @options.callbacks.success
        @errorCallback = @options.callbacks.error
  
      @polygon = @options.polygon
  
      # Turn on Leaflet.draw polygon tool
      @polygonDraw = new L.Polygon.Draw(@options.map, {})
      @polygonDraw.enable()
  
      @options.map.on 'draw:poly-created', (e) =>
        mapPolygon = e.poly
        @createPolygon mapPolygon
  
    createPolygon: (mapPolygon) ->
      @polygon.setGeomFromPoints(mapPolygon.getLatLngs())
      @polygon.save(
        success: () =>
          @close()
          @successCallback() if @successCallback?
        error: (xhr, textStatus, errorThrown) =>
          @close()
          @errorCallback.apply(@, arguments) if @errorCallback?
      )
  
    close: () ->
      @polygonDraw.disable()
      @options.map.off('draw:poly-created')
