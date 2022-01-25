# Ids Attributes Mixin

This mixin adds attribute getter/setter helper functionality to components

1. Include the import for IdsAttributesMixin in the `*-base.js` file.

When using it...

1. Test it by adding for example `this.attr('auto-close', true)` to the component's constructor.
2. This should add `this.autoClose` to the Web Component, and `auto-close="true"` to the element-tag
3. Consider adding a test to ids-button tests.

See `ids-button/ids-button.js` for a good example.
