define [
  "lib/pica_event"
], (PicaEvents) ->

  class PicaModel extends PicaEvents
    throwIfNoApp: ->
      unless @app?
        throw "Cannot create a PicaModel without specifying a PicaApplication"
  
    url: () ->
  
    get: (attribute) ->
      @attributes ?= {}
      @attributes[attribute]
  
    set: (attribute, value) ->
      @attributes ?= {}
      @attributes[attribute] = value
      @trigger('change')
  
    sync: (options = {}) ->
      successCallback = options.success || () ->
  
      # Extend callback to add returned data as model attributes.
      options.success = (data, textStatus, jqXHR) =>
        #data = JSON.parse(data) unless 'object' == typeof data
        if data.id?
          @parse(data)
          @trigger('sync', @)
  
        @app.notifySyncFinished()
        successCallback(@, textStatus, jqXHR)
  
      errorCallback = options.error || () ->
  
      # Extend callback to add returned data as model attributes.
      options.error = (data, textStatus, jqXHR) =>
        @app.notifySyncFinished()
        errorCallback(@, textStatus, jqXHR)
  
      if options.type == 'post' or options.type == 'put'
        data = @attributes
        data = JSON.stringify(data) if options.type == 'post'
  
      # Send nothing for delete, and set contentType,
      # otherwise JQuery will try to parse it on return.
      if options.type == 'delete'
        data = null
  
      @app.notifySyncStarted()
  
      $.ajax(
        $.extend(
          options,
          contentType: "application/json"
          dataType: "json"
          data: data
        )
      )
    
    # Parse the data that is returned from the server.
    parse: (data) ->
      for attr, val of data
        @set(attr, val)
  
    save: (options = {}) =>
      if @get('id')?
        options.url = if @url().read? then @url().read else @url()
        options.type = 'put'
      else
        options.url = if @url().create? then @url().create else @url()
        options.type = 'post'
      sync = @sync(options)
      sync.done => console.log("saving #{@constructor.name} #{@get('id')}")
      sync
      
    fetch: (options = {}) =>
      options.url = if @url().read? then @url().read else @url()
      console.log("fetching #{@constructor.name} #{@get('id')}")
      @sync(options)
  
    destroy: (options = {}) =>
      options.url = if @url().read? then @url().read else @url()
      options.type = 'delete'
      originalCallback = options.success
      options.success = =>
        @trigger('delete')
        console.log("deleted #{@constructor.name} #{@get('id')}")
        originalCallback() if originalCallback
        @off()
      @sync(options)
  