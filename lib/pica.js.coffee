#
# * pica.js
# * https://github.com/unepwcmc/pica.js
# *
# * Copyright (c) 2012 UNEP-WCMC
#

window.Pica = {}
Pica.Models = {}
Pica.Views = {}

class Pica.Application
  constructor: (@config) ->
    Pica.config = @config

    $.support.cors = true

    $.ajaxSetup
      headers:
        'X-Magpie-AppId': Pica.config.appId

  newWorkspace: () ->
    @currentWorkspace = new Pica.Models.Workspace()
