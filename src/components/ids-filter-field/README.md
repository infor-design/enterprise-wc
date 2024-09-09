# ids-filter-field

## Description

We include a filter field component that helps layout an input next to a menu button with filter operators. It expects an input component
such as IdsInput, IdsDatePicker, IdsTimePicker, IdsDropdown, or IdsLookup to be slotted in.

## Class Hierarchy

- IdsFilterField
  - IdsElement
- Mixins
  IdsEventsMixin
  IdsLabelStateMixin

## Use Cases

- When you want an input with a default or customized menu of filter operators to emit `change` events together.

## Features (With Code Examples)

Add an IdsFilterField to the page and inside its slot add one input component.

```html
<ids-filter-field label="Text">
  <ids-input></ids-input>
</ids-filter-field>
```

Example usage with dropdown input

```html
<ids-filter-field label="Dropdown">
  <ids-dropdown value="opt2">
    <ids-list-box>
      <ids-list-box-option value="opt1">Option One</ids-list-box-option>
      <ids-list-box-option value="opt2">Option Two</ids-list-box-option>
      <ids-list-box-option value="opt3">Option Three</ids-list-box-option>
      <ids-list-box-option value="opt4">Option Four</ids-list-box-option>
      <ids-list-box-option value="opt5">Option Five</ids-list-box-option>
      <ids-list-box-option value="opt6">Option Six</ids-list-box-option>
    </ids-list-box>
  </ids-dropdown>
</ids-filter-field>
```

Example setting custom operators list
```js
  const filterField = document.querySelector('ids-filter-field');
  filterField.operators = [
    {
      text: 'Equals',
      value: 'equals',
      icon: 'filter-equals',
      selected: true
    },
    {
      text: 'Does not equal',
      value: 'does-not-equal',
      icon: 'filter-does-not-equal',
      selected: false
    }
  ];
```

## Settings and Attributes

  - `label` {string} This adds a label to the filter field
  - `size` {string} set the input size, it will set `md` as defaults
  - `value` {string} sets the value of the slotted input component
  - `operator` {string} sets the filter operator value

## Events
  - `change` Fires when input value or operator selection is changed. Event details object provides operator value, input value, and input element reference.
