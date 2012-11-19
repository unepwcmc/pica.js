class Pica.Models.Polygon extends Pica.Events
  setGeomFromPoints: (points) ->
    points = for point in points 
      [point.lng, point.lat]

    points.push points[0]

    @geometry = [[points]]

  save: (options) ->
    alert('Persist polygon here, triggering requestAreaId if required')
    options.success()
