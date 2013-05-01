describe 'Pica.Application', ->

  describe '.createWorkspace', ->
    pica = magpieServer = null

    before ->
      magpieServer = new window.TestHelpers.FakeMagpieServer()
      pica = window.TestHelpers.buildPicaApplication()

      pica.newWorkspace()

    after ->
      magpieServer.server.restore()

    it 'creates a new workspace at .currentWorkspace', ->
      if pica.currentWorkspace.constructor.name?
        expect(pica.currentWorkspace.constructor.name).to.equal('Workspace')
      else
        # Do a more naive tests in IE, because it's rubbish
        expect(pica.currentWorkspace).to.not.equal(null)

    it 'gives the new workspace a references to itself in .currentWorkspace.app', ->
      expect(pica.currentWorkspace.app).to.equal(pica)
