$.support.cors = true
$.originalAjax = $.ajax

# Override $.ajax to support CORS in >IE8
$.ajax = (options) ->
  delete options.beforeSend
  delete options.contentType
  $.originalAjax options
