(function() {
  define(["mocha", "workspaceSpec", "areaSpec", "picaSpec", "polygonSpec", "showLayerViewSpec", "uploadFileViewSpec"], function(mocha, workspaceSpec, areaSpec, picaSpec, polygonSpec, showLayerViewSpec, uploadFileViewSpec) {
    'use strict';    return mocha.run();
  });

}).call(this);
