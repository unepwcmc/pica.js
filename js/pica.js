(function() {
  define(["lib/pica_event", "models/area", "pica_application"], function(PicaEvents, PicaModelsArea, PicaApplication) {
    var pica;

    pica = {};
    pica.PicaModelsArea = PicaModelsArea;
    pica.PicaApplication = PicaApplication;
    return pica;
  });

}).call(this);
