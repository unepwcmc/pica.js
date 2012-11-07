Pica.Views ||= {}

class Pica.Views.CalculatedLayerStatsView extends Backbone.Marionette.CompositeView
  tagName: "ul",
  id: "calculated_layer_stats",
  template: "#calculated_layer_stats_tmpl",
  itemView: Pica.Views.CalculatedLayerStatView,
 
  appendHtml: (collectionView, itemView) ->
    collectionView.$el.append(itemView.el)
