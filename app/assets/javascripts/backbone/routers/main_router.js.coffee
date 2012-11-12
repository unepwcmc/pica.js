class PicaJs.Routers.MainsRouter extends Backbone.Router
  initialize: (options) ->

  routes:
    "index": "index"
  
  index: ->
    @view = new PicaJs.Views.Mains.IndexView()
    $("#mains").html(@view.render().el)

