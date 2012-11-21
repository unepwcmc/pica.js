#= require jquery
#= require jquery_ujs
#= require jquery_cors_ovr
#= require bootstrap
#= require leaflet
#= require leaflet.draw
#= require pica
#= require_tree ./lib
#= require_tree ./models
#= require_tree ./views

$(() ->
  map = L.map('map').setView([0, 0], 2)
  tileLayerUrl = 'http://carbon-tool.cartodb.com/tiles/ne_countries/{z}/{x}/{y}.png'
  tileLayer = new L.TileLayer(tileLayerUrl, {
    maxZoom: 18
  }).addTo map

  # Initialise Pica and create a new workspace
  pica = new Pica.Application(
    magpieUrl: "http://magpie.unepwcmc-005.vm.brightbox.net"
    appId: 3
    map: map
  )
  pica.newWorkspace()

  # Start drawing a polygon for our new workspace
  pica.currentWorkspace.currentArea.drawNewPolygonView (polygon) ->
    AreaView "#side-panel"


  # == AreaView.js == 
  #Render an area's stats as they are calcualted 
  AreaView = ((targetElement) ->
    
    # Render area's stats
    render = (stats) ->
      stat = undefined
      _i = 0
      _len = stats.length
      $(targetElement).empty()

      while _i < _len
        stat = stats[_i]
        $(targetElement).append stat.name + ": " + stat.value + stat.unit + "<br/>"
        _i++

    () ->
      # Listen to area:statsCalculated event, and re-render when it happens
      pica.currentWorkspace.currentArea.on "area:statsCalculated", render
      console.log('user AreaView, waiting for area:statsCalculated')
  )()
)
