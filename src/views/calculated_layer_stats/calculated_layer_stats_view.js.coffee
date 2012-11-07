Pica.Views ||= {}

class Pica.Views.CalculatedLayerStatsView extends Backbone.Marionette.CompositeView
  id: "calculated-layer-stats",
  template: "#calculated-layer-stats-tmpl",
  itemView: Pica.Views.CalculatedLayerStatView,
 
  appendHtml: (collectionView, itemView) ->
    collectionView.$('#calculated-layer-stats-list').append(itemView.el)
