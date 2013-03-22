describe "Pica.Views.UploadFileView", ->
  describe "a view exists and has been rendered", ->
    fileView = undefined
    addEventListenerSpy = undefined
    before ->
      
      # TODO put in mapExistsHelper
      map = L.map("map",
        center: [24.5, 54]
        zoom: 9
      )
      
      # TODO application exists
      pica = new Pica.Application(
        magpieUrl: "http://magpie.unepwcmc-005.vm.brightbox.net"
        projectId: 5
        map: map
      )
      
      # Create a new workspace to work in
      pica.newWorkspace()
      
      # create a file view
      fileView = pica.currentWorkspace.currentArea.newUploadFileView(
        success: ->

        error: ->
      )
      $("#side-panel").prepend fileView.el
      addEventListenerSpy = sinon.spy(window, "addEventListener")
      fileView.render()

    it "creates an iframe for the file upload", ->
      $("#side-panel iframe").length.should.equal 1

    it "listens for window events", ->
      addEventListenerSpy.calledOnce.should.equal true

    describe "onUploadComplete is called with a success event", ->
      before ->
        sinon.spy fileView, "successCallback"
        sinon.spy fileView, "errorCallback"
        event =
          origin: Pica.config.magpieUrl
          data:
            polygonImportStatus: "Successful import"
            importMessages: "Imported polygon 5"

        fileView.onUploadComplete event

      it "calls the success callback", ->
        fileView.successCallback.calledOnce.should.equal true

      it "does not call the error callback", ->
        fileView.errorCallback.calledOnce.should.equal false

      after ->
        fileView.successCallback.restore()
        fileView.errorCallback.restore()


    describe "onUploadComplete is called with an error event", ->
      before ->
        sinon.spy fileView, "errorCallback"
        sinon.spy fileView, "successCallback"
        event =
          origin: Pica.config.magpieUrl
          data:
            polygonImportStatus: "Imported with some errors"
            importMessages: "error or something or whatever"

        fileView.onUploadComplete event

      it "calls the error callback", ->
        fileView.errorCallback.calledOnce.should.equal true

      it "does not call the success callback", ->
        fileView.successCallback.calledOnce.should.equal false

      after ->
        fileView.errorCallback.restore()
        fileView.successCallback.restore()


    describe "onUploadComplete is called with an event from a domain that isn't the magpie address", ->
      before ->
        sinon.spy fileView, "errorCallback"
        sinon.spy fileView, "successCallback"
        event = origin: "http://google.com/"
        fileView.onUploadComplete event

      it "does not call the error callback", ->
        fileView.errorCallback.calledOnce.should.equal false

      it "does not call the success callbacks", ->
        fileView.successCallback.calledOnce.should.equal false

      after ->
        fileView.errorCallback.restore()
        fileView.successCallback.restore()
