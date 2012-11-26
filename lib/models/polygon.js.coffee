class Pica.Models.Polygon extends Pica.Model
  constructor: () ->
    @attributes = {}

  isComplete: () ->
    return @get('geometry')?

  setGeomFromPoints: (points) ->
    points = for point in points
      [point.lng, point.lat]

    points.push points[0]

    @set('geometry', [[points]])

  geomAsLatLngArray: () ->
    latLngs = []

    if @isComplete()
      for point in @get('geometry')[0][0]
        latLngs.push(new L.LatLng(point[1], point[0]))

    return latLngs

  url: () ->
    read: "#{Pica.config.magpieUrl}/polygons/#{@get('id')}"
    create: "#{Pica.config.magpieUrl}/areas_of_interest/#{@get('area_id')}/polygons"

  save: (options) =>
    options ||= {}

    if @get('area_id')?
      super options
    else
      @trigger('requestAreaId',
        success: (area, textStatus, jqXHR) =>
          @set('area_id', area.get('id'))
          if @get('area_id')
            successCallback = options.success
            @save options
          else
            options.error(@, {error: "Could not save area, so cannot save polygon"}, jqXHR) if options.error?
        error: (error) =>
          console.log "Unable to save polygon:"
          console.log error
      )
