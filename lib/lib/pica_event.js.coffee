class Pica.Events
  on: (event, callback) ->
    @events ||= {}
    @events[event] ||= []
    @events[event].push callback

  off: (event, callback) ->
    return unless @events?

    if event?
      if @events[event]?
        if callback?
          for index, eventCallback in @events[event]
            delete @events[event][index] if eventCallback == callback
        else
          delete @events[event]
    else
      @events = []

  trigger: (event, args) ->
    if @events? && @events[event]?
      for callback in @events[event]
        callback.apply(@, [].concat(args))
