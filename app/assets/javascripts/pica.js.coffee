window.Pica = new Backbone.Marionette.Application()

Pica.addInitializer((options) ->
  @config = options
)

Pica.addRegions
  main: "#map"
  sidePanel: "#side-panel"
