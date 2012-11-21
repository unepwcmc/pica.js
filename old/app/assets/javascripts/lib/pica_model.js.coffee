class Pica.Model extends Pica.Events
  url: () ->


  get: (attribute) ->
    @attributes[attribute]

  set: (attribute, value) ->
    @attributes[attribute] = value


  sync: (options = {}) ->
    callback = options.success || () ->

    # Extend callback to add returned data as model attributes
    options.success = (data, textStatus, jqXHR) =>
      if data.id?
        for attr, val of data
          @set(attr, val)

        callback(@, textStatus, jqXHR)

    $.ajax(
      $.extend(
        options,
        dataType: 'json'
        data: @attributes
      )
    )

  save: (options = {}) ->
    options.url = if @url().create? then @url().create else @url()
    options.type = 'post'
    @sync(options)

  fetch: (options = {}) ->
    options.url = if @url().read? then @url().read else @url()
    @sync(options)
