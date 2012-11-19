window.Pica = {}
Pica.Models = {}
Pica.Views = {}

class Pica.Application
  constructor: (@config) ->
    Pica.config = @config

  newWorkspace: () ->
    @currentWorkspace = new Pica.Models.Workspace()

