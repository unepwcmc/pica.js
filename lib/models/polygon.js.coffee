class Pica.Models.Polygon extends Pica.Model
  constructor: () ->
    @attributes = {}

  setGeomFromPoints: (points) ->
    points = for point in points
      [point.lng, point.lat]

    points.push points[0]

    @set('geometry', [[points]])

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
            options.error(@, {error: "Could not save area, so cannot save polygon"}, jqXHR) if options.error?
        error: () =>
          console.log "Unable to save polygon:"
          console.log error
      )
