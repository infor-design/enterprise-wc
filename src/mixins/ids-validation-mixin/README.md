# Ids Validation Mixin

This mixin add functionality for validation to the component. This includes a add/remove message function api.  Also triggers the `validate` event when evaluated and passes an `isValid` argument for the current state.

To implement the validation mixin:

1. Import `IdsValidationMixin` and add to the component-base.js
1. Add `IdsValidationMixin` to the @mixes comment section
1. Make sure you attributes extend `return [...super.attributes` in the `attributes` property because `attributes.VALIDATE` and `attributes.VALIDATION_EVENTS` are added.
1. Make sure the `connectedCallback` calls `super.connectedCallback();`
1. You might need to change the default events from `blur` to other events. You can do that in the getter for example:

```js
get validationEvents() { return this.getAttribute(attributes.VALIDATION_EVENTS) || 'change'; }
```

1. You may need to include the validation css and make adjustments

```scss
@import '../../themes/mixins/ids-validation-mixin';

.validation-message {
  margin-top: 10px;
}
```

## Set Messages Manually

Validation messages can be set manually to the component.

### Set Thru Markup

Set a validation message thru html markup.

```html
<!-- Error type -->
<ids-input
  label="Test Message"
  value="Some text"
  validation-message="Something is wrong do not continue"
  validation-type="error"
  validation-id="error1"
></ids-input>

<!-- Alert type -->
<ids-input
  label="Test Message"
  value="Some text"
  validation-message="Warning the value may be incorrect"
  validation-type="alert"
  validation-id="alert1"
></ids-input>

<!-- Success type -->
<ids-input
  label="Test Message"
  value="Some text"
  validation-message="This value is correct"
  validation-type="success"
  validation-id="success1"
></ids-input>

<!-- Info type -->
<ids-input
  label="Test Message"
  value="Some text"
  validation-message="Random information about this field"
  validation-type="info"
  validation-id="info1"
></ids-input>

<!-- Icon type default (user-profile) -->
<ids-input
  label="Test Message (default icon)"
  value="Some text"
  validation-message="Something about your user profile"
  validation-type="icon"
  validation-id="icon1"
></ids-input>

<!-- Icon type custom (mail) -->
<ids-input
  label="Test Message (custom icon)"
  value="Some text"
  validation-message="Something about your mail information"
  validation-type="icon"
  validation-id="icon2"
  validation-icon="mail"
></ids-input>
```
### Set Thru JavaScript

Add/Remove a single message.

```html
<ids-input label="Manually message" id="v1"></ids-input>
```

```js
// Get element
const input: any = document.querySelector('#v1');

// Add single message (types: 'error', 'info', 'alert', 'warn', 'icon')
input.addValidationMessage({
  message: 'Something is wrong do not continue',
  type: 'error',
  id: 'error1'
});

// Remove single message
input.removeValidationMessage({ id: 'error1' });
```

Add/Remove a multiple messages.

```html
<ids-input label="Manually messages" id="v1"></ids-input>
```

```js
// Get element
const input: any = document.querySelector('#v1');

// Add multiple messages
input.addValidationMessage([{
  message: 'Something is wrong do not continue',
  type: 'error',
  id: 'error-multi'
}, {
  message: 'Something else is also wrong do not continue',
  type: 'error',
  id: 'error-multi-2'
}, {
  message: 'Warning the value may be incorrect',
  type: 'alert',
  id: 'alert-multi'
}, {
  message: 'This value is correct',
  type: 'success',
  id: 'success-multi'
}, {
  message: 'Random information about this field',
  type: 'info',
  id: 'info-multi'
}, {
  message: 'Something about your user profile',
  type: 'icon',
  id: 'icon-default-multi'
}, {
  message: 'Something about your mail information',
  type: 'icon',
  id: 'icon-custom-multi',
  icon: 'mail'
}]);

// Remove multiple messages by id (array of multiple objects)
input.removeValidationMessage([
  { id: 'alert-multi' },
  { id: 'success-multi' },
  { id: 'info-multi' }
]);

// Remove multiple messages by type (single object), will remove all `error` type
input.removeValidationMessage({ type: 'error' });

// Remove all validation messages
input.removeAllValidationMessages();
```

## Rules can be use with validation

There are built in validation rules can be use with the mixin as list below.

- `Required` - Check empty state on current value.
- `Email` - General email validation logic.

```html
<ids-input label="Required Validation" validate="required"></ids-input>
<ids-input label="Email Validation" validate="email"></ids-input>
<ids-input label="Email and Required Validation" validate="email required"></ids-input>
```

## Custom Rules

If need more then built-in validation it can attach custom validation rules.

Add/Remove a single validation rule.

```html
<ids-input label="Custom Validation" id="v1"></ids-input>
```

```js
// Unique ID to use with rule
const ruleId = 'my-custom-uppercase';

// Custom Rule (uppercase)
const customRule = {
  check: (input: any) => {
    const val = input.value;
    return /^[A-Z]*$/.test(val);
  },
  message: 'Only uppercase letters allowed',
  type: 'error',
  id: ruleId
};

// Get element
const input: any = document.querySelector('#v1');

// Attach single rule
input.addValidationRule(customRule);

// Remove single rule
input.removeValidationRule(ruleId);
```

Add/Remove multiple custom validation rules.

```html
<ids-input label="Custom Validation" id="v1"></ids-input>
```

```js
// Unique IDs to use with each rule
const ruleId1 = 'no-numbers';
const ruleId2 = 'no-special-characters';

// Custom Rule (no-numbers)
const customRule1 = {
  check: (input: any) => {
    const val = input.value;
    return !(/[\d]+/.test(val));
  },
  message: 'No numbers allowed',
  type: 'error',
  id: ruleId1
};
// Custom Rule (no-special-characters)
const customRule2 = {
  check: (input: any) => {
    const val = input.value;
    return !(/[!@#\\$%\\^\\&*\\)\\(+=._-]+/.test(val));
  },
  message: 'No special characters allowed',
  type: 'error',
  id: ruleId2
};

// Get element
const input: any = document.querySelector('#v1');

// Attach multiple rules
input.addValidationRule([customRule1, customRule2]);

// Remove multiple rule
input.removeValidationRule([ruleId1, ruleId2]);
```
