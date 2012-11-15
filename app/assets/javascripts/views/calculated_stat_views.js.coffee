Pica.module('Views', (Views, App, Backbone, Marionette, $, _) ->

  class Views.CalculatedStatView extends Backbone.Marionette.ItemView
    template: JST['templates/calculated-stat-tmpl'],
    tagName: 'li'

  class Views.CalculatedStatsView extends Backbone.Marionette.CompositeView
    id: "calculated-stats",
    template: JST['templates/calculated-stats-tmpl'],
    itemView: Views.CalculatedStatView,
   
    appendHtml: (collectionView, itemView) ->
      collectionView.$('#calculated-stats-list').append(itemView.el)
)
