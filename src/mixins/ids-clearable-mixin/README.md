# Ids Clearable Mixin

This mixin adds a clear button (x icon) to an input element and binds the click and key events to clear the text in the input when clicked. It will trigger the `cleared` event when the contents of the input element are cleared and a `contents-checked` event fires when the contents of input are being checked for empty.

To implement the clearable mixin:

1. Import `IdsClearableMixin`
1. Add `IdsClearableMixin` to the mixes() section
1. Add `IdsClearableMixin` to the @mixes comment section
1. Make sure you attributes extend `return [...super.attributes` in the `attributes` property because `attributes.CLEARABLE` is added.
1. Make sure the `connectedCallback` calls `super.connectedCallback();`

See ids-textarea as an example.
