# Pica.js

Coffeescript Library for implementing Magpie stats in your web applications

## Demo

A [demo][demo] is available on this repository's Github Page.

[demo]: http://unepwcmc.github.com/pica.js/example/

### Deploying the Demo

The demo application can be deployed to Github Pages by building the
library using `grunt` then committing and merging the changes with the
`gh-pages` branch.

## Development

Running `grunt watch` monitors `lib/` and `example/` for changes and
auto compiles the Javascript, etc. Point your browser to
`example/index.html` to view your changes.

Because of the limitations of cross domain behavior when opening files with file:// in a browser,
you'll probably want to run a super simple python web server

    python -m SimpleHTTPServer

Then hit up http://localhost:8000/example/

## Usage example
The source code for the demo app is in the example folder. It's commented and should be fairly easy to follow. Start in the script tag in example/index.html.

Check the API docs below for reference.

## API Documentation

## Pica.Application

### Attributes

#### currentWorkspace

The current workspace

### Methods

#### new(options)

options:

* **area**:
* **magpieUrl**: Address of your magpie server
* **appId**: ID of your application
* **map**: leaflet map object

Creates a new instance of pica

#### newWorkspace()
Create a new workspace

#### setWorkspace(id)
* id - id of the workspace

Gets the workspace from the server


## Workspace

### Attributes 

#### currentArea
The current area for the workspace

### Methods

#### setArea(id)
Returns the current area for the workspace

#### areas()
Returns an array areas currently in memory for this workspace

#### fetchAreas(callback)
* callback - called success, passes in areas in format of areas()

Fetch all the areas from the server, pass results to callback

## Areas

### Attributes 

#### polygons
Array of polygon objects currently in memory

### Methods

#### showPolysOnMapView()
Show current polygons on the map, returns a ShowPolysView

#### drawNewPolygonView(successCallback)
* successCallback - called after the user has finished drawing

Adds a drawing tool to the map, and returns a PolygonEditView

#### setName(name)
* name - name to set

sets the name of the area, and persists to magpie


### Events

#### sync
**eventParams**

* area - the area that synced
triggered whenever the area is synced with the server

## ShowAreaPolygonsView
Show current polygons for the given area. Redraws polygons as the polygons related
to the map change.

### Attributes
#### area
The area to show polygons for.

### Methods
#### constructor(options)

**options:**

* **area**: The Area to show polygons for

#### close()
Remove the polygons from the map, remove all bindings

### Events
#### polygonClick -> (polygon, event)
Trigged when a polygon is clicked on, passes the polygon that was clicked and the leaflet event object

## NewPolygonView
#### constructor(options)
**options:**

* area: 


#### close()
Stops drawing and removes the view from the map

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](http://gruntjs.com/).

_Also, please don't edit files in the "dist" subdirectory as they are generated via grunt. You'll find source code in the "lib" subdirectory!_

## Release History
_(Nothing yet)_

## License
Copyright (c) 2012 UNEP-WCMC
