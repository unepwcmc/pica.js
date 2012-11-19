$.support.cors = true
$.originalAjax = $.ajax

# Override $.ajax to support CORS in >IE8
$.ajax = (options) ->
  options.headers ||= {}
  options.headers['X-Magpie-AppId'] = Pica.config.appId

  $.originalAjax options
