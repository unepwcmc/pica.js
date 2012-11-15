class PicaData
  fetch: (options) ->
    $.getJSON 'all.json', (data) ->
      options.success(data)

window.PicaData = PicaData
