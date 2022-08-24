# Ids Field Height Mixin

This mixin add functionality for setting the `compact` and `field-height` attributes to the component.

To implement the validation mixin:

1. Import `IdsFieldHeightMixin` and add to the component-base.js
1. Add `IdsFieldHeightMixin` to the @mixes comment section
1. Make sure the template includes the `compact` and `field-height` attributes.
1. Implement the `onFieldHeightChange` function to set the attributes on the necessary container.
