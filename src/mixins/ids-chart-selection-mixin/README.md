# Ids Chart Selection Mixin

This mixin adds selection feature to charts. This includes getters/setters for the selectable settings.

1. Include the import for IdsChartSelectionMixin in the `mix` list.
1. Set the boolean value for `this.DEFAULT_SELECTABLE` option in component constructor.
1. Add getters for chart elements that get selection `get selectionElements(): Array<SVGElement> {}`.
1. Add `setSelection(index: number|string, isLegendClick?: boolean)` method for selection logic to use with chart component.
1. Add selection style rules to the sass file.
