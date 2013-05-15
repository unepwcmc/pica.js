#
# * pica.js
# * https://github.com/unepwcmc/pica.js
# *
# * Copyright (c) 2012 UNEP-WCMC
#

define [
 "lib/pica_event"
 "models/area"
 "pica_application"
]
, (PicaEvents, PicaModelsArea, PicaApplication) ->

  # This is the public API.
  pica = {}
  #pica.PicaEvents = PicaEvents
  pica.PicaModelsArea = PicaModelsArea
  pica.PicaApplication = PicaApplication

  pica

  

  
  