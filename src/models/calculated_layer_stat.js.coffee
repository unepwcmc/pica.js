Pica.Models ||= []

class Pica.Models.CalculatedLayerStat extends Backbone.Model
  url: () ->
    "#{window.PICA.magpieAddress}/polygon"
