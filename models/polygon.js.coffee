Pica.Models ||= []

class Pica.Models.Polygon extends Backbone.Model
  url: () ->
    "#{window.PICA.magpieAddress}/polygon"
