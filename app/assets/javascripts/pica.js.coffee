window.Pica = new Backbone.Marionette.Application()

Pica.addRegions
  main: "#map"
  sidePanel: "#side-panel"

Pica.on "initialize:after", ->
  Backbone.history.start()
