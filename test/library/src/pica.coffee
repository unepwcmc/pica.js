window.Pica =
  truth: -> true

  start: (options = {}) ->
    L.map(options.map) if options.map
    @renderSidebar()

  renderSidebar: ->
