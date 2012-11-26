class Pica.Model extends Pica.Events
  url: () ->

  get: (attribute) ->
    @attributes ?= {}
    @attributes[attribute]

  set: (attribute, value) ->
    @attributes ?= {}
    @attributes[attribute] = value

  sync: (options = {}) ->
    callback = options.success || () ->

    # Extend callback to add returned data as model attributes
    options.success = (data, textStatus, jqXHR) =>
      if data.id?
        @parse(data)
        @trigger('sync', @)

      callback(@, textStatus, jqXHR)

    dataType = "json"

    data = @attributes
    data = JSON.stringify(data) if options.type == 'post'

    # Send nothing for delete, and set contentType, otherwise JQuery will try to parse it on return
    if options.type == 'delete'
      data = null
      dataType = "text"

    $.ajax(
      $.extend(
        options,
        dataType: dataType
        contentType: "application/json"
        data: data
      )
    )
  
  # Parse the data that is returned from the server
  parse: (data) ->
    for attr, val of data
      @set(attr, val)

  save: (options = {}) ->
    options.url = if @url().create? then @url().create else @url()
    options.type = 'post'
    @sync(options)

  fetch: (options = {}) ->
    options.url = if @url().read? then @url().read else @url()
    @sync(options)

  delete: (options = {}) ->
    options.url = if @url().read? then @url().read else @url()
    options.type = 'delete'
    originalCallback = options.success
    options.success = =>
      @trigger('delete')
      originalCallback() if originalCallback
    @sync(options)
