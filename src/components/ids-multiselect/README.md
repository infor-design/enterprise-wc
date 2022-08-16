# IDS Multiselect

## Description
Ids Multiselect is similar to IdDropdown except it allows the end user to select more than one option from a list. Selected items can be displayed as dismissible tags or a comma separated string.

## Use Cases

- Use when you want a user to select one or more options from a list of values

## Terminology

- **List Box**: The Ux element that holds the items in the dropdown
- **List Box Option**: The dropdown options but contained in a list box

## Features (With Code Examples)

A basic example of a multiselect in action.

```html
<ids-multiselect id="dropdown-1" disabled="false" label="Test Dropdown">
    <ids-list-box class="options" id="options">
        <ids-list-box-option id="al" value="al"><ids-checkbox label="Alabama" class="justify-center"></ids-checkbox></ids-list-box-option>
        <ids-list-box-option id="ak" value="ak"><ids-checkbox label="Alaska" class="justify-center"></ids-checkbox></ids-list-box-option>
        <ids-list-box-option id="az" value="az"><ids-checkbox label="Arizona" class="justify-center"></ids-checkbox></ids-list-box-option>
        <ids-list-box-option id="ar" value="ar"><ids-checkbox label="Arkansas" class="justify-center"></ids-checkbox></ids-list-box-option>
        <ids-list-box-option id="ca" value="ca"><ids-checkbox label="California" class="justify-center"></ids-checkbox></ids-list-box-option>
        <ids-list-box-option id="co" value="co"><ids-checkbox label="Colorado" class="justify-center"></ids-checkbox></ids-list-box-option>
    </ids-list-box>
</ids-multiselect>
```

an example with a maximum selection

```html

<ids-multiselect id="dropdown-1" disabled="false" label="Test Dropdown" max="3">
    <ids-list-box class="options" id="options">
        <ids-list-box-option id="al" value="al"><ids-checkbox label="Alabama" class="justify-center"></ids-checkbox></ids-list-box-option>
        <ids-list-box-option id="ak" value="ak"><ids-checkbox label="Alaska" class="justify-center"></ids-checkbox></ids-list-box-option>
        <ids-list-box-option id="az" value="az"><ids-checkbox label="Arizona" class="justify-center"></ids-checkbox></ids-list-box-option>
        <ids-list-box-option id="ar" value="ar"><ids-checkbox label="Arkansas" class="justify-center"></ids-checkbox></ids-list-box-option>
        <ids-list-box-option id="ca" value="ca"><ids-checkbox label="California" class="justify-center"></ids-checkbox></ids-list-box-option>
        <ids-list-box-option id="co" value="co"><ids-checkbox label="Colorado" class="justify-center"></ids-checkbox></ids-list-box-option>
    </ids-list-box>
</ids-multiselect>

```

an example with tags

```html
<ids-multiselect id="dropdown-1" disabled="false" label="Test Dropdown" max="3" tags="true">
    <ids-list-box class="options" id="options">
        <ids-list-box-option id="al" value="al"><ids-checkbox label="Alabama" class="justify-center"></ids-checkbox></ids-list-box-option>
        <ids-list-box-option id="ak" value="ak"><ids-checkbox label="Alaska" class="justify-center"></ids-checkbox></ids-list-box-option>
        <ids-list-box-option id="az" value="az"><ids-checkbox label="Arizona" class="justify-center"></ids-checkbox></ids-list-box-option>
        <ids-list-box-option id="ar" value="ar"><ids-checkbox label="Arkansas" class="justify-center"></ids-checkbox></ids-list-box-option>
        <ids-list-box-option id="ca" value="ca"><ids-checkbox label="California" class="justify-center"></ids-checkbox></ids-list-box-option>
        <ids-list-box-option id="co" value="co"><ids-checkbox label="Colorado" class="justify-center"></ids-checkbox></ids-list-box-option>
    </ids-list-box>
</ids-multiselect>
```

prepopulating selected options

```html
<ids-multiselect id="dropdown-1" label="Test Dropdown" max="3" dirty-tracker="true">
    <ids-list-box class="selected-options" id="selected-options">
            <ids-list-box-option id="nj" value="nj" tooltip="The State of New Jersey"><ids-checkbox checked="true" label="New Jersey" class="justify-center"></ids-checkbox></ids-list-box-option>
    </ids-list-box>
    <ids-list-box class="options" id="options">
        <ids-list-box-option id="al" value="al" tooltip="The State of Alabama"><ids-checkbox label="Alabama" class="justify-center"></ids-checkbox></ids-list-box-option>
        <ids-list-box-option id="ak" value="ak" tooltip="The State of Alaska"><ids-checkbox label="Alaska" class="justify-center"></ids-checkbox></ids-list-box-option>
        <ids-list-box-option id="az" value="az" tooltip="The State of Arizona"><ids-checkbox label="Arizona" class="justify-center"></ids-checkbox></ids-list-box-option>
        <ids-list-box-option id="ar" value="ar" tooltip="The State of Arkansas"><ids-checkbox label="Arkansas" class="justify-center"></ids-checkbox></ids-list-box-option>
        <ids-list-box-option id="ca" value="ca" tooltip="The State of California"><ids-checkbox label="California" class="justify-center"></ids-checkbox></ids-list-box-option>
        <ids-list-box-option id="co" value="co" tooltip="The State of Colorado"><ids-checkbox label="Colorado" class="justify-center"></ids-checkbox></ids-list-box-option>
    </ids-list-box>
</ids-multiselect>
```

## Settings and Attributes

IdsMultiselect inherits most of it's settings from ids-dropdown, please refer to that document [here](../ids-dropdown/README.md) for more details. Below are listed new settings or ones that have been modified or are different from ids-dropdown:

- `disabled` {boolean} Sets multiselect to disabled including dismisiable tags
- `tags` {boolean} sets whether to use tags to display selected values
- `value` {Array} Sets the selected options to match the items in the array. this is no longer set as an Attribute but as a Property.
- `selectedIndex` no longer provides functionality in ids-multiselect
