# IDS Multiselect

## Description
Ids Multiselect is similar to Ids Dropdown except it allows the end user to select more than one option from a list. Selected items can be displayed as dismissible tags or a comma separated string.

## Use Cases

- Use when you want a user to select one or more options from a list of values

## Terminology

- **List Box**: The Ux element that holds the items in the dropdown
- **List Box Option**: The dropdown options but contained in a list box

## Settings and Attributes

IdsMultiselect inherits most of it's settings from ids-dropdown, please refer to that document [here](../ids-dropdown/README.md) for more details. Below are listed new settings or ones that have been modified or are different from ids-dropdown:

- `disabled` {boolean} Sets multiselect to disabled including dismisiable tags
- `tags` {boolean} sets whether to use tags to display selected values
- `value` {Array} Sets the selected options to match the items in the array. This is no longer set as an attribute but as a property `document.querySelector('ids-multiselect').value = ['al', 'ar', 'ca']`
- `max` {number} Sets maximum number of selected options
- `selectedIndex` no longer provides functionality in ids-multiselect
- `placeholder` sets the placeholder text for the input field

## Features (With Code Examples)

A basic example of a multiselect in action.

```html
<ids-multiselect id="dropdown-1" label="Test Dropdown">
  <ids-list-box>
    <ids-list-box-option id="al" value="al"><ids-checkbox label="Alabama"></ids-checkbox></ids-list-box-option>
    <ids-list-box-option id="ak" value="ak"><ids-checkbox label="Alaska"></ids-checkbox></ids-list-box-option>
    <ids-list-box-option id="az" value="az"><ids-checkbox label="Arizona"></ids-checkbox></ids-list-box-option>
    <ids-list-box-option id="ar" value="ar"><ids-checkbox label="Arkansas"></ids-checkbox></ids-list-box-option>
    <ids-list-box-option id="ca" value="ca"><ids-checkbox label="California"></ids-checkbox></ids-list-box-option>
    <ids-list-box-option id="co" value="co"><ids-checkbox label="Colorado"></ids-checkbox></ids-list-box-option>
  </ids-list-box>
</ids-multiselect>
```

Example with a maximum selection

```html
<ids-multiselect id="dropdown-1" label="Test Dropdown" max="3">
  <ids-list-box>
    <ids-list-box-option id="al" value="al"><ids-checkbox label="Alabama"></ids-checkbox></ids-list-box-option>
    <ids-list-box-option id="ak" value="ak"><ids-checkbox label="Alaska"></ids-checkbox></ids-list-box-option>
    <ids-list-box-option id="az" value="az"><ids-checkbox label="Arizona"></ids-checkbox></ids-list-box-option>
    <ids-list-box-option id="ar" value="ar"><ids-checkbox label="Arkansas"></ids-checkbox></ids-list-box-option>
    <ids-list-box-option id="ca" value="ca"><ids-checkbox label="California"></ids-checkbox></ids-list-box-option>
    <ids-list-box-option id="co" value="co"><ids-checkbox label="Colorado"></ids-checkbox></ids-list-box-option>
  </ids-list-box>
</ids-multiselect>
```

Example with tags

```html
<ids-multiselect id="dropdown-1" label="Test Dropdown" max="3" tags="true">
  <ids-list-box>
    <ids-list-box-option id="al" value="al"><ids-checkbox label="Alabama"></ids-checkbox></ids-list-box-option>
    <ids-list-box-option id="ak" value="ak"><ids-checkbox label="Alaska"></ids-checkbox></ids-list-box-option>
    <ids-list-box-option id="az" value="az"><ids-checkbox label="Arizona"></ids-checkbox></ids-list-box-option>
    <ids-list-box-option id="ar" value="ar"><ids-checkbox label="Arkansas"></ids-checkbox></ids-list-box-option>
    <ids-list-box-option id="ca" value="ca"><ids-checkbox label="California"></ids-checkbox></ids-list-box-option>
    <ids-list-box-option id="co" value="co"><ids-checkbox label="Colorado"></ids-checkbox></ids-list-box-option>
  </ids-list-box>
</ids-multiselect>
```

With selected options initially. Add `selected` attribute to the selected options in the list.

```html
<ids-multiselect id="dropdown-1" label="Test Dropdown" max="3" dirty-tracker="true">
  <ids-list-box>
    <ids-list-box-option id="al" value="al" selected><ids-checkbox label="Alabama"></ids-checkbox></ids-list-box-option>
    <ids-list-box-option id="ak" value="ak"><ids-checkbox label="Alaska"></ids-checkbox></ids-list-box-option>
    <ids-list-box-option id="az" value="az"><ids-checkbox label="Arizona"></ids-checkbox></ids-list-box-option>
    <ids-list-box-option id="ar" value="ar" selected><ids-checkbox label="Arkansas"></ids-checkbox></ids-list-box-option>
    <ids-list-box-option id="ca" value="ca"><ids-checkbox label="California"></ids-checkbox></ids-list-box-option>
    <ids-list-box-option id="co" value="co"><ids-checkbox label="Colorado"></ids-checkbox></ids-list-box-option>
  </ids-list-box>
</ids-multiselect>
```

Example with a placeholder

```html
<ids-multiselect id="dropdown-1" placeholder="Select states" label="Test Dropdown">
  <ids-list-box>
    <ids-list-box-option id="al" value="al"><ids-checkbox label="Alabama"></ids-checkbox></ids-list-box-option>
    <ids-list-box-option id="ak" value="ak"><ids-checkbox label="Alaska"></ids-checkbox></ids-list-box-option>
    <ids-list-box-option id="az" value="az"><ids-checkbox label="Arizona"></ids-checkbox></ids-list-box-option>
    <ids-list-box-option id="ar" value="ar"><ids-checkbox label="Arkansas"></ids-checkbox></ids-list-box-option>
    <ids-list-box-option id="ca" value="ca"><ids-checkbox label="California"></ids-checkbox></ids-list-box-option>
    <ids-list-box-option id="co" value="co"><ids-checkbox label="Colorado"></ids-checkbox></ids-list-box-option>
  </ids-list-box>
</ids-multiselect>
```