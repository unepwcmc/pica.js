window.Pica =
  start: (options = {}) ->
    @renderMap(options.map)
    @renderSidebar(options.sidebar)

  renderMap: (id) ->
    L.map(id) if id?

  renderSidebar: (selector) ->
    $(selector).append('<a href="#">New Area</a>')
    $(selector).append('<a href="#">or load a saved Area of Interest</a>')
    $(selector).append('Click on the map to start drawing your first polygon and define an Area Of Interest')
