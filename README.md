# Pica API
## Pica
### Methods
#### new(config)
Creates a new instance of pica, taking in configuration options:

    magpieUrl: Address of your magpie server
    appId: ID of your application
    map: leaflet map object

#### workspace()
Returns the current workspace

#### setWorkspace(id)
* id - id of the workspace

Gets the workspace from the server


## Workspace
### Methods
#### currentArea()
Returns the current area for the workspace

#### setArea(id)
Returns the current area for the workspace

#### areas()
Returns an array areas currently in memory for this workspace

#### fetchAreas(callback)
* callback - called success, passes in areas in format of areas()

Fetch all the areas from the server, pass results to callback


## Areas
### Methods
#### polygons()
Array of polygon objects currently in memory

#### fetchPolygons(callback)
* callback - called success, passes in areas in format of polygons()

Fetch all the polygons from the server, pass results to callback

#### showPolysOnMapView()
Show current polygons on the map, returns a ShowPolysView

#### drawNewPolygonView(successCallback)
* successCallback - called after the user has finished drawing

Adds a drawing tool to the map, and returns a PolygonEditView

#### stats()
Array of calculated_stat objects

#### fetchStats(callback)
* callback - called success, passes in areas in format of stats()

Fetch all the calculated_stats from the server, pass results to callback

#### setName(name)
* name - name to set

sets the name of the area, and persists to magpie

### Events
#### area:statsCalculated
* stats - array of calculated_stat objects
triggered whenever stats are fetched from the server, either on user request, or when polygons change

## ShowPolysView
### close()
Remove the current polygons from the map

## PolygonEditView
### close()
Stops drawing and removes the view from the map

