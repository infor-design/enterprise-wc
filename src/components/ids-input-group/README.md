# Ids Input Group Component

## Description

The IDS Input Group Component consists of group of input components displayed `inline-block`.
It accepts any combination of IDS Form Components (ex. Input, Timepicker, Datepicker, Checkbox).
It also allows setting an `IdsGroupValidationRule` to check against the slotted collection of input components.

## Type IdsGroupValidationRule
```js
type IdsGroupValidationRule = {
  /** The localized message text */
  message: string;

  /** Custom group validation callback */
  check: (inputComponents: Array<any>) => boolean;
};
```

## Features (With Code Examples)

HTML Code

```html
<ids-input-group>
  <ids-input name="firstname" label="First Name" type="text"></ids-input>
  <ids-input name="lastname" label="Last Name" type="text"></ids-input>
</ids-input-group>
```

JS Code
```js
function findInputByName(formInputs: Array<any>, inputName: string) {
  return formInputs.find((input) => input.getAttribute('name') === inputName);
}

const noDuplicateNamesRule: IdsGroupValidationRule = {
  message: 'Multiple employees share your name. Your company email will contain a serial number.',
  check: (inputComponents: Array<any>) => {
    const EXISTING_EMPLOYEES = ['John Smith', 'Jane Doe'];
    const firstName = findInputByName(inputComponents, 'firstname').value;
    const lastName = findInputByName(inputComponents, 'lastname').value;
    const fullName = `${firstName} ${lastName}`;

    return EXISTING_EMPLOYEES.indexOf(fullName) === -1;
  }
};

const inputGroup = document.querySelector<IdsInputGroup>('ids-input-group');
inputGroup.addGroupValidationRule(noDuplicateNamesRule);
```

## Methods

- `addGroupValidationRule(groupRule: IdsGroupValidationRule)` Sets group validation rule
