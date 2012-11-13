window.Pica =
  start: (options = {}) ->
    @renderMap(options.map)
    @renderSidebar(options.sidebar)

  renderMap: (id) ->
    L.map(id) if id?

  renderSidebar: (selector) ->
