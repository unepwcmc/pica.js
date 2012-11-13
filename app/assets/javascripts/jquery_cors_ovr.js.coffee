$.originalAjax = $.ajax

# Override $.ajax to support CORS in >IE8
$.ajax = (options) ->
  if $.browser.msie and window.XDomainRequest
    url = options.url + "?" + $.param(query)
    
    # Use Microsoft XDR
    xdr = new XDomainRequest()
    xdr.open options.type, url
    xdr.onprogress = ->

    xdr.onerror = ->

    xdr.onload = ->
      JSON = $.parseJSON(xdr.responseText)
      JSON = $.parseJSON(data.firstChild.textContent)  if JSON is null or typeof (JSON) is "undefined"
      success.call context, JSON

    xdr.send()
  else
    $.originalAjax
      type: options.type
      url: options.url
      dataType: options.dataType
      data: options.query
      success: (data) ->
        success.call context, data
      crossDomain: true
