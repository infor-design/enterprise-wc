# Ids Chart Legend Mixin

This mixin adds a legend for charts (or anything that may need one). This includes getters/setters for the legend settings.

1. Include the import for IdsChartLegendMixin in the `mix` list.
1. Set the legendPlacement option as needed (defaults to `none`, can also be `top`, `left`, `bottom`, or `right`)
1. Call `this.legendTemplate()` to put the legend in the template.
1. Add the import to the sass file `@import '../../themes/mixins/ids-chart-legend-mixin';` to get the styles.
