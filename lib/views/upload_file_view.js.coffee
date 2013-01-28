class Pica.Views.UploadFileView
  constructor: (options) ->
    if options.callbacks?
      @successCallback = options.callbacks.success
      @errorCallback = options.callbacks.error
    @area = options.area
    @el = document.createElement("div")

    @render()

  render: ->
    formFrame = document.createElement('iframe')
    formFrame.src = "#{Pica.config.magpieUrl}/workspaces/#{@area.get('workspace_id')}/areas_of_interest/#{@area.get('id')}/polygons/upload_file_url"
    @el.appendChild(formFrame)

  close: ->
    @polygonDraw.disable()
    Pica.config.map.off('draw:circle-created')