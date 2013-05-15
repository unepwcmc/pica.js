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

Install the Node package for the grunt command line interface globally.
```sh
   # You might want to use nvm here:
   # https://github.com/creationix/nvm
   # And once you have a Node Version Manager setup:
   npm install -g grunt-cli
   # Alternatively:
   sudo npm install -g grunt-cli
```

Start the build (will install dependencies and build).
```sh
   npm install
```

Running `grunt watch` monitors `coffee/` and `example/` for changes and
auto compiles the Javascript, etc. Point your browser to
`example/index.html` to view your changes.

Because of the limitations of cross domain behavior when opening files with file:// in a browser,
you'll probably want to run a super simple python web server

    python -m SimpleHTTPServer

Then hit up http://localhost:8000/example/

## AMD modules

This is a version of Pica that relies on the [Asynchronous Module Definition](https://github.com/amdjs/amdjs-api/wiki/AMD) specification 
and more specifically on the [requirejs](https://github.com/jrburke/requirejs) implementation of it.

  
To build a new AMD compatible pica.js distribution file with the [requirejs optimizer](http://requirejs.org/docs/optimization.html):
```sh
   grunt requirejs
```
The files are saved in `dist/`, 
according to the instructions in `Gruntfile requirejs-task`.
`pica.js` exposes a variable named `pica` that points to an object, containing Pica's public interface.
If Pica is used outside of an AMD environment it will still work, but the variable `pica` will be a global.
To see or modify Pica's public interface look into `coffee/pica.coffee`.

The AMD configuration is split between `coffee/app.coffee` and the `Gruntfile`, 
that uses `coffee/app.coffee` as the `mainConfigFile` upon wich it builds the distribution files.
For a complete description of all configuration options in the requirejs optimizer look into: [example.build.js](https://github.com/jrburke/r.js/blob/master/build/example.build.js).





## Usage example
The source code for the demo app is in the example folder. It's commented and should be fairly easy to follow. Start in the script tag in example/index.html.

Check the API docs below for reference.

## API Documentation

## Pica.Application

### Attributes

#### currentWorkspace

The current workspace

#### layers

List of tile layers used in the application

### Methods

#### new(options)

options:

* **area**:
* **magpieUrl**: String, address of your magpie server.
* **appId**: Number, ID of your application.
* **map**: Object, Leaflet map object.
* **delegateLayerControl**: Boolean (optional), if true Pica will be responsible for rendering a Leatlet Layer Control.
* **extraOverlays**: Object (optional), extra layers to be added in the Layer Control.

Creates a new instance of pica.
Code example:

```coffee
  # Create a leaflet map.
  map = L.map("map",
    center: [54, 24.5]
    zoom: 4
  )
  # Add a base layer.
  tileLayer = new L.TileLayer(baseTileLayerUrl).addTo(map)
  # Extra layers for Pica.
  overlayMaps =
    "Boundaries and Places": L.tileLayer(placesTileLayerUrl)
  # Create a new instance of pica, with the given options.
  window.pica = new Pica.Application(
    magpieUrl: "http://10.1.1.138:3000"
    projectId: 2
    map: map
    delegateLayerControl: yes
    extraOverlays: overlayMaps
  )
```

#### newWorkspace()
Create a new workspace

#### setWorkspace(id)
* id - id of the workspace

Gets the workspace from the server

#### showTileLayers()

Returns a new Pica.Views.ShowLayersView for the app

### Events
#### sync

Triggered when the layers are fetched from the server

#### syncStarted

Triggered when the app begins any ajax syncing event on a model

#### syncFinished

Triggered when the app finishes any ajax syncing event on a model (success or error)


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

#### drawNewPolygonView(callbacks)
* callbacks -
    optional object with keys:
      * success - function which will be called when new polygon is saved
      * error - function which will be called if polygon fails to save, passing the error to the callback

Adds a drawing tool to the map, and returns a Pica.Views.PolygonEditView

#### drawNewCircleView(callbacks)
* callbacks -
    optional object with keys:
      * success - function which will be called when new polygons is saved
      * error - function which will be called if polygon fails to save, passing the error to the callback

Adds a drawing tool to the map, and returns a Pica.Views.CircleEditView

#### newUploadFileView(callbacks)
* callbacks -
    optional object with keys:
      * success - function which will be called when polygons are generated
      * error - function which will be called if polygon fails to save, passing the error to the callback

Returns an Pica.Views.UploadFileView

#### setName(name)
* name - name to set

sets the name of the area, and persists to magpie

### Events

#### sync
**eventParams**

* area - the area that synced
triggered whenever the area is synced with the server

## Pica.Views.ShowAreaPolygonsView
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

## Pica.Views.NewPolygonView
Adds a polygon draw tool to the map, 
### Methods
#### constructor(options)
**options:**

* polygon: the polygon to draw the geometry for
* callbacks: takes an error and success callback options


#### close()
Stops drawing and removes the view from the map

## Pica.Views.UploadFileView
Generates a DOM element with an upload form for supported geometry files. Build one of these for your
area with area.newUploadFileView
### Attributes
#### el
The DOM element containing the upload file form

### Methods
#### constructor(options)
**options:**

* area: The area the polygons will be drawn for
* callback: The area the polygons will be drawn for

#### close()
Destroy this.el and remove all bindings

## Pica.Views.ShowLayersView
Adds the app's tile layers to the map. Create one using app.showTileLayers()
### Methods

#### close()
Remove the tile layers from the map

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](http://gruntjs.com/).

_Also, please don't edit files in the "dist" subdirectory as they are generated via grunt. You'll find source code in the "lib" subdirectory!_

## Release History
_(Nothing yet)_

## License
Copyright (c) 2012 UNEP-WCMC
