class Pica.Views.UploadFileView extends Pica.Events
  constructor: (options) ->
    if options.callbacks?
      @successCallback = options.callbacks.success
      @errorCallback = options.callbacks.error
    @area = options.area
    @el = document.createElement("div")

    @area.getAreaId(success:@render)

  render: =>
    formFrame = document.createElement('iframe')
    formFrame.src = "#{Pica.config.magpieUrl}/" +
      "areas_of_interest/#{@area.get('id')}/polygons/new_upload_form/"
    formFrame.className = "pica-upload-form"
    @el.appendChild(formFrame)
    window.addEventListener("message", @onUploadComplete, false)

  onUploadComplete: (event) =>
    magpieUrl = Pica.config.magpieUrl
    polygonImportStatus = event.data.polygonImportStatus
    if event.origin == magpieUrl and event.data.polygonImportStatus?
      if polygonImportStatus == 'Successful import' and @successCallback?
        @successCallback(polygonImportStatus, event.data.importMessages)
      else if @errorCallback?
        @errorCallback(polygonImportStatus, event.data.importMessages)
      @close()

  close: ->
    window.removeEventListener("message", @onUploadComplete)
    $(@el).remove()
