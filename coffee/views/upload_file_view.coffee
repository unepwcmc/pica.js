define [
  "lib/pica_event"
], (PicaEvents) ->

  class PicaViewsUploadFileView extends PicaEvents
    constructor: (@options) ->
      if options.callbacks?
        @successCallback = @options.callbacks.success
        @errorCallback = @options.callbacks.error
      @area = @options.area
      @el = document.createElement("div")
  
      @area.getAreaId(success:@render)
  
    render: =>
      formFrame = document.createElement('iframe')
      formFrame.src = "#{@options.magpieUrl}/areas_of_interest/#{@area.get('id')}/polygons/new_upload_form/"
      formFrame.className = "pica-upload-form"
      @el.appendChild(formFrame)
      window.addEventListener("message", @onUploadComplete, false)
  
    onUploadComplete: (event) =>
      if event.origin == @options.magpieUrl and event.data.polygonImportStatus?
        if event.data.polygonImportStatus == 'Successful import' and @successCallback?
          @successCallback(event.data.polygonImportStatus, event.data.importMessages)
        else if @errorCallback?
          @errorCallback(event.data.polygonImportStatus, event.data.importMessages)
        @close()
  
    close: ->
      window.removeEventListener("message", @onUploadComplete)
      $(@el).remove()
