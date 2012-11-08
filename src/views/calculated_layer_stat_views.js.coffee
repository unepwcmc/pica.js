Pica.module('Views', (Views, App, Backbone, Marionette, $, _) ->

  class Views.CalculatedLayerStatView extends Backbone.Marionette.ItemView
    template: '#calculated-layer-stat-tmpl',
    tagName: 'li'

  class Views.CalculatedLayerStatsView extends Backbone.Marionette.CompositeView
    id: "calculated-layer-stats",
    template: "#calculated-layer-stats-tmpl",
    itemView: Views.CalculatedLayerStatView,
   
    appendHtml: (collectionView, itemView) ->
      collectionView.$('#calculated-layer-stats-list').append(itemView.el)
)
