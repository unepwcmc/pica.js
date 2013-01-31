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
    formFrame.src = "#{Pica.config.magpieUrl}/areas_of_interest/#{@area.get('id')}/polygons/new_upload_form/"
    @el.appendChild(formFrame)
    window.addEventListener("message", @onUploadComplete, false)

  onUploadComplete: (event) =>
    if event.origin == Pica.config.magpieUrl and event.data.polygonImportStatus?
      @successCallback(event.data.polygonImportStatus, event.data.importMessages) if @successCallback?
      @close()

  close: ->
    window.removeEventListener("message", @onUploadComplete)
    $(@el).remove()