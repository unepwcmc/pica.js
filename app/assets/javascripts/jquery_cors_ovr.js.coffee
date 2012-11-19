$.support.cors = true
$.originalAjax = $.ajax

# Override $.ajax to support CORS in >IE8
$.ajax = (options) ->
  delete options.beforeSend
  delete options.contentType
  options['X-Magpie-AppId'] = Pica.config.appId
  $.originalAjax options
