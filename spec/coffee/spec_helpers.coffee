
define [
  "jquery"
  "sinon"
  "specData"
  "leaflet"
  "pica_application"
], ($, sinon, specData, L, PicaApplication) ->
  'use strict'

  testHelpers = {}

  testHelpers.map or= L.map("map",
    center: [24.5, 54]
    zoom: 9
  )

  testHelpers.defaultOptions = 
    map: testHelpers.map
    magpieUrl: "http://magpie.unepwcmc-005.vm.brightbox.net"
    projectId: 5
  
  testHelpers.buildPicaApplication = (options={}) ->
    defaultOptions = testHelpers.defaultOptions
    ops = $.extend {}, defaultOptions, options
    new PicaApplication ops
  

  class testHelpers.FakeMagpieServer
  
    constructor: ->
      @server = sinon.fakeServer.create()
  
    routes:
      projectIndex:
        method: 'GET'
        matcher: /.*projects\/\d+\.json/
        response: specData.FAKE_PROJECT_INDEX_RESPONSE
      workspaceIndex:
        method: 'GET'
        matcher: /.*workspaces.json/
      workspaceSave:
        method: 'POST'
        matcher: /.*workspaces.json/
        response: {areas_of_interest: [], id: 590}
      areasIndex:
        method: 'GET'
        matcher: /.*areas_of_interest.json/
      areaSave:
        method: 'POST'
        matcher: /.*areas_of_interest.json/
        response: {id: 5, name: ""}
      polygonSave:
        method: 'POST'
        matcher: /.*polygons.json/
        response: specData.FAKE_POLYGON_RESPONSE
  
    respondTo: (routeName) ->
      if @hasReceivedRequest(routeName)
        @server.requests[0].respond(
          200,
          { "Content-Type": "application/json" },
          JSON.stringify(@routes[routeName].response)
        )
        @server.requests.splice(0,1)
      else
        throw new Error "server hasn't received a #{routeName} request"
  
    hasReceivedRequest: (routeName) ->
      routeDetails = @routes[routeName]
      @server.requests[0].url.match(routeDetails.matcher) and
        routeDetails.method == @server.requests[0].method

  testHelpers
