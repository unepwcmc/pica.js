window.TestHelpers = {}

TestHelpers.map ||= L.map("map",
  center: [24.5, 54]
  zoom: 9
)

TestHelpers.buildPicaApplication = ->

  new Pica.Application(
    magpieUrl: "http://magpie.unepwcmc-005.vm.brightbox.net",
    projectId: 5,
    map: TestHelpers.map
  )

class TestHelpers.FakeMagpieServer
  constructor: ->
    @server = sinon.fakeServer.create()

  routes:
    projectIndex:
      method: 'GET'
      matcher: /.*projects\/\d+\.json/
      response: {"id":5,"name":"my_polygon","layers":[{"id":1,"display_name":"Protected Areas","tile_url":"http://184.73.201.235/blue/{z}/{x}/{y}","is_displayed":true}]}
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

  respondTo: (routeName) ->
    if @hasReceivedRequest(routeName)
      @server.requests[0].respond(
        200,
        { "Content-Type": "application/json" },
        JSON.stringify(@routes[routeName].response)
      )
      @server.requests.splice(0,1)
    else
      throw "server hasn't received a #{routeName} request"

  hasReceivedRequest: (routeName) ->
    routeDetails = @routes[routeName]
    @server.requests[0].url.match(routeDetails.matcher) and
      routeDetails.method == @server.requests[0].method
