# Pica.js

Coffeescript Library for implementing Magpie stats in your web applications

## Demo

A [demo][demo] is available on this repository's Github Page.

[demo]: http://unepwcmc.github.com/pica.js/example/

## Development

Running `grunt watch` monitors `lib/` and `example/` for changes and
auto compiles the Javascript, etc. Point your browser to
`example/index.html` to view your changes.

## API Documentation

## Pica.Application

### Methods

#### new(config)
Creates a new instance of pica, taking in configuration options:

    magpieUrl: Address of your magpie server
    appId: ID of your application
    map: leaflet map object

#### currentWorkspace()
Returns the current workspace

#### newWorkspace()
Create a new workspace

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

#### close()
Remove the current polygons from the map

## PolygonEditView

#### close()
Stops drawing and removes the view from the map

## Examples

In this simple example we will create an app which builds a new workspace, allows the user to draw a new polygon, 
then renders the calculated stats for that polygon

```
// Initialise Pica and create a new workspace
pica = new Pica({
  magpieUrl: '…',
  appId: 3,
  map: new L.Map('#map')
});
pica.newWorkspace();

// Start drawing a polygon for our new workspace
pica.currentWorkspace().currentArea().drawNewPolygonView(function(polygon){
  AreaView('#pica-content');
});

/* == AreaView.js == 
Render an area's stats as they are calcualted */
AreaView = (function(targetElement) {

  // Render area's stats
  var render = function(stats) {
    var stat, _i, _len;

    $(targetElement).empty();

    for (_i = 0, _len = stats.length; _i < _len; _i++) {
      stat = stats[_i];
      $(targetElement).append(stat.name + ': ' + stat.value + stat.unit + '<br/>');
    }
  };

  return function() {
    // Listen to area:statsCalculated event, and re-render when it happens
    pica.currentWorkspace().currentArea().bind('area:statsCalculated', render);
  };
})();

```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](http://gruntjs.com/).

_Also, please don't edit files in the "dist" subdirectory as they are generated via grunt. You'll find source code in the "lib" subdirectory!_

## Release History
_(Nothing yet)_

## License
Copyright (c) 2012 UNEP-WCMC
