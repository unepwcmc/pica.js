$.originalAjax = $.ajax

# Override $.ajax to support CORS in >IE8
$.ajax = (options) ->
  if $.browser.msie and window.XDomainRequest
    url = options.url + "?" + $.param(data)
    
    # Use Microsoft XDR
    xdr = new XDomainRequest()
    xdr.open options.type, url
    xdr.onprogress = ->

    xdr.onerror = ->

    xdr.onload = ->
      JSON = $.parseJSON(xdr.responseText)
      JSON = $.parseJSON(data.firstChild.textContent)  if JSON is null or typeof (JSON) is "undefined"
      options.success.call options.context, JSON

    xdr.send()
  else
    $.originalAjax
      type: options.type
      url: options.url
      dataType: options.dataType
      data: options.data
      success: (data) ->
        options.success.call options.context, data
      crossDomain: true
