# Ids Validation Mixin

This mixin add functionality for validation to the component. This includes a add/remove message function api.  Also triggers the `validate` event when evaluated and passes an `isValid` argument for the current state.

To implement the validation mixin:

1. Import `IdsValidationMixin`
1. Add `IdsValidationMixin` to the mixes() section
1. Add `IdsValidationMixin` to the @mixes comment section
1. Make sure you attributes extend `return [...super.attributes` in the `attributes` property because `attributes.VALIDATE` and `attributes.VALIDATION_EVENTS` are added.
1. Make sure the `connectedCallback` calls `super.connectedCallback();`
1. You might need to change the default events from `blur` to other events. You can do that in the getter for example:

```js
get validationEvents() { return this.getAttribute(attributes.VALIDATION_EVENTS) || 'change'; }
```

1. You may need to include the validation css and make adjustments

```scss
@import '../../mixins/sass/ids-validation-mixin';

.validation-message {
  margin-top: - 10px;
}
```
