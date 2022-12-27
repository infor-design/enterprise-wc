# Ids Tooltip Mixin

This mixin adds functionality to display a tooltip on an item.

1. Include the import for IdsTooltipMixin in the `mix` list.

When using it...

1. Test it by adding for example `tooltip="Additional Information"` on the component.
1. Add `attributes.TOOLTIP` to the attributes.
1. Consider adding a test to tooltip tests.
1. Use the `beforeTooltipShow` callback if needed for any special configuration specific to the component.

See `ids-list-box/ids-list-box-option.js` for a good example.
