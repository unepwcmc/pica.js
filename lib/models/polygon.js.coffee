class Pica.Models.Polygon extends Pica.Model
  constructor: (options = {}) ->
    @attributes = if options.attributes? then options.attributes else {}

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
            @save options
          else
            options.error(@, {error: "Unable to get area id, so cannot save polygon"}, jqXHR) if options.error?
        error: (jqXHR, textStatus, errorThrown) =>
          console.log "Unable to save polygon:"
          console.log arguments
          options.error(jqXHR, textStatus, {error: "Unable to obtain areaId, cannot save polygon", parentError: errorThrown}) if options.error?
      )
