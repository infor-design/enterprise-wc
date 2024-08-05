# ids-dropdown

## Description

The ids-dropdown is similar to a `<select>` HTML element, with advanced selection and filtering features. See more [usage details](https://design.infor.com/components/components/dropdown).

## Terminology

- **Dropdown** The UX element that lives in the page and is actionable, activating the list
- **Dropdown List** The UX element that contains and places the list within the page
- **List Box**: The UX element that wraps the items in the dropdown
- **List Box Option**: UX elements representing dropdown options, contained by the List Box

## Features (With Code Examples)

Dropdown elements should be defined with `id` and `value` attributes. The value should match one of the `value` attributes contained by one of its `ids-list-box-option` elements.  When your application renders, the referenced value will cause the corresponding `ids-list-box-option` to appear selected:

```html
<ids-dropdown id="dropdown-2" label="Readonly Dropdown" value="opt3">
  <ids-list-box>
    <ids-list-box-option value="opt1" id="opt1">Option One</ids-list-box-option>
    <ids-list-box-option value="opt2" id="opt2">Option Two</ids-list-box-option>
    <ids-list-box-option value="opt3" id="opt3">Option Three</ids-list-box-option>
    <ids-list-box-option value="opt4" id="opt4">Option Four</ids-list-box-option>
    <ids-list-box-option value="opt5" id="opt5">Option Five</ids-list-box-option>
    <ids-list-box-option value="opt6" id="opt6">Option Six</ids-list-box-option>
  </ids-list-box>
</ids-dropdown>
```

To show icons in the dropdown list, add an `ids-icon` and `span` to each list box `ids-list-box-option`.

```html
<ids-dropdown id="dropdown-5" label="Dropdown with Icons" value="opt2">
  <ids-list-box>
    <ids-list-box-option value="opt1" id="opt1">
      <ids-icon icon="user-profile"></ids-icon>
      <span>Option One</span>
    </ids-list-box-option>
    <ids-list-box-option value="opt2" id="opt2">
      <ids-icon icon="project"></ids-icon>
      <span>Option Two</span>
    </ids-list-box-option>
    <ids-list-box-option value="opt3" id="opt3">
      <ids-icon icon="purchasing"></ids-icon>
      <span>Option Three</span>
    </ids-list-box-option>
    <ids-list-box-option value="opt4" id="opt4">
      <ids-icon icon="quality"></ids-icon>
      <span>Option Four</span></ids-list-box-option>
    <ids-list-box-option value="opt5" id="opt5">
      <ids-icon icon="rocket"></ids-icon>
      <span>Option Five</span>
    </ids-list-box-option>
    <ids-list-box-option value="opt6" id="opt6">
      <ids-icon icon="roles"></ids-icon>
      <span>Option Six</span>
    </ids-list-box-option>
  </ids-list-box>
</ids-dropdown>
```

Show tooltips on the dropdown container or options. By setting it on `ids-dropdown`, you will see the tooltip on hover for the closed dropdown. If set on the options, the tooltip will display the selected item.

```html
<ids-dropdown id="dropdown-6" label="Dropdown with Tooltips" tooltip="Additional Info" value="opt2">
  <ids-list-box>
    <ids-list-box-option value="opt1" id="opt1" tooltip="Additional Info on Option One">Option One</ids-list-box-option>
    <ids-list-box-option value="opt2" id="opt2" tooltip="Additional Info on Option Two">Option Two</ids-list-box-option>
    <ids-list-box-option value="opt3" id="opt3" tooltip="Additional Info on Option Three">Option Three</ids-list-box-option>
    <ids-list-box-option value="opt4" id="opt4" tooltip="Additional Info on Option Four">Option Four</ids-list-box-option>
    <ids-list-box-option value="opt5" id="opt5" tooltip="Additional Info on Option Five">Option Five</ids-list-box-option>
    <ids-list-box-option value="opt6" id="opt6" tooltip="Additional Info on Option Six">Option Six</ids-list-box-option>
  </ids-list-box>
</ids-dropdown>
```

Sometimes you might want to load the dropdown with Ajax. To do this setup the initial html. in order for the selected element to show. This must be pre-populated.

```html
<ids-dropdown id="dropdown-7" label="Dropdown Using Ajax" value="ak">
  <ids-list-box>
    <ids-list-box-option value="ak" id="ak">Alaska</ids-list-box-option>
 </ids-list-box>
</ids-dropdown>
```

For the JS part set the `beforeShow` callback to an async function that returns a promise.

```js
// Use the asynchronous `beforeshow` callback to load contents
const dropdownAsync = document.querySelector('#dropdown-7');

dropdownAsync.beforeShow = async function beforeShow() {
  const url = '/data/states.json';
  const res = await fetch(url);
  const data = await res.json();
  return data;
};
```

The promise should resolve and return data with id, value and label info.

```js
{
  "id": "AS",
  "value": "AS",
  "label": "American Samoa"
}
```

For groups you should add `group-label` attribute to `ids-list-box-option` to indicate group start, all group items should be below.

```html
<ids-dropdown id="dropdown-groups" label="Dropdown With Groups" value="opt3">
  <ids-list-box>
    <ids-list-box-option group-label>Group 1</ids-list-box-option>
    <ids-list-box-option value="opt1group1">Option One</ids-list-box-option>
    <ids-list-box-option value="opt2group1">Option Two</ids-list-box-option>
    <ids-list-box-option group-label>Group 2</ids-list-box-option>
    <ids-list-box-option value="opt1group2">Option One</ids-list-box-option>
    <ids-list-box-option value="opt2group2">Option Two</ids-list-box-option>
  </ids-list-box>
</ids-dropdown>
```

In some situations, it may be preferable to separate the IdsDropdownList element from its in-page parent element.  This can be done using the `list` attribute, and simply referencing the dropdown list by its `id` attribute.  This might be necessary for reasons such as breaking out of CSS stacking context.  Note that in this situation, it's necessary to also manually define the event handling and [Popup Interactions](https://github.com/infor-design/enterprise-wc/blob/main/src/mixins/ids-popup-interactions-mixin/ids-popup-interactions-mixin.ts) that cause the IdsDropdownList to activate, making this ideal for custom IdsDropdown configurations:

```html
<ids-dropdown id="dropdown-1" list="separate-list" label="Dropdown (list is adjacent)" value="blank" dirty-tracker="true" allow-blank="true"></ids-dropdown>
<ids-dropdown-list id="separate-list">
  <ids-list-box>
    <ids-list-box-option value="blank" id="blank"><span></span></ids-list-box-option>
    <ids-list-box-option value="opt1" id="opt1-d8"><span>Option One</span></ids-list-box-option>
    <ids-list-box-option value="opt2" id="opt2-d8"><span>Option Two</span></ids-list-box-option>
  </ids-list-box>
</ids-dropdown-list>
```

## Settings

- `allowBlank` {boolean} Sets whether option list should include 'blank' option
- `colorVariant` {string} set the current color variant.
- `compact` {boolean} sets the component to be compact mode.
- `dirtyTracker` {boolean} Sets the dirty tracking feature on to indicate a changed
- `disabled` {boolean} Sets dropdown to disabled
- `fieldHeight` {string} defines the field height. See [Ids Field Height Mixin](https://github.com/infor-design/enterprise-wc/blob/main/src/mixins/ids-field-height-mixin/README.md) for more information.
- `label` {string} Sets the label text
- `language` {string} Sets the language for RTL and inner labels
- `labelRequired` {boolean} Sets the validation required indicator on label text, it's default to `true`
- `labelState` {string} indicates that a label is hidden (note that for accessibility reasons, `label` should still be specified). See [Ids Label State Mixin](https://github.com/infor-design/enterprise-wc/blob/main/src/mixins/ids-label-state-mixin/README.md) for more information.
- `list` {string} ID selector used to reference/connect to an external IdsDropdownList component (used in some scenarios like IdsDataGrid filters)
- `maxlength` {number | string} Maximum characters allowed in textarea
- `noMargins` {boolean} sets whether or not no-margins around the component.
- `placeholder` {string} Sets the placeholder text
- `size` {'sm' | 'md' | 'lg' | 'full' | string} Sets the size (width)
- `readonly` {boolean} Sets to readonly state
- `validate` {'required' | string} Sets the validation routine to use
- `validationEvents` {'blur' | string} Sets the validation events to use
- `value` {string} Sets option to the matching option by the `value` attribute
- `id` {string} Sets the `id` attribute
- `tooltip` {string} Sets the tooltip on the dropdown container
- `selectedIndex` {number} Sets the the selected option by index
- `typeahead` {true | false} - Enable/disable typeahead functionality
- `clearable` {true | false} - Whether or not the value can be cleared with Backspace/Delete
- `clearable-text` {string} - Sets the blank option custom text. The text will not be added to the input when the option is selected
- `show-loading-indicator` {boolean} - Whether or not to show loading indicator (replaces trigger button). Defaults to false.

## Events

- `change` Fires when an option is selected / changed
- `focus` Fires at the time the dropdown is focused
- `selected` Fires when a value is selected
- `focus` Fires when the field gets focus
- `selected` Fires when a value is selected
- Some event listeners for popup `show`, `hide` events can be added to `popup` property

```js
const dropdown = document.querySelector('ids-dropdown');

dropdown.popup.addEventListener('show');
dropdown.popup.addEventListener('hide');
```

## Methods

- `beforeShow` {Promise<string>} An async function that fires as the dropdown is opening allowing you to set contents
- `toggle` {void} Toggles the dropdown list open/closed state
- `open` {void} Opens the dropdown list
- `close` {void} Closes the dropdown list
- `options` {Array<HTMLElement>} Returns the currently available options
- `selectedOption` {HTMLElement} Returns the selected option DOM element
- `selectedIndex` {number} Sets the the selected option by index

## Themeable Parts

- `trigger-field` - allows you to further style  the trigger field container
- `input` - allows you to further style  the input in the trigger field container
- `trigger-button` - allows you to further style the trigger field button
- `icon` - allows you to further style the trigger field icon
- `popup` - allows you to further style the dropdown popup

## States and Variations

- Valid/Invalid
- Required
- Readonly
- Open/Closed
- Disabled
- Dirty

## Keyboard Guidelines

- <kbd>Tab/Shift + Tab</kbd>: Moves focus into and out of the dropdown input. If the list is open, this will close the list, selecting the current item, and moving to the next focusable element
- <kbd>Alt + Down Arrow / Down Arrow</kbd>: Opens the dropdown list and moves focus to the selected option. If nothing is selected, then focus moves to the first option in the list. If the combobox is not editable nothing will happen.
- <kbd>Enter</kbd>: Selects the currently highlighted item in the list, updates the input field, highlights the selected item in the dropdown list, closes the dropdown list, and returns focus to the input field.
- <kbd>Escape</kbd>: Closes the dropdown list, returns focus to the edit field, and does not change the current selection.
- <kbd>AnyKey</kbd>: Typing a letter opens the list and filters to the items that start with that letter

## Responsive Guidelines

- The dropdown `<input>` should size to the parent container and the `<label>` should remain on the top.

## Converting from Previous Versions (Breaking Changes)

**3.x to 4.x**
- Dropdown have all new markup and classes.

**4.x to 5.x**
- The dropdown component has been changed to a web component and renamed to ids-editor.
- Markup has changed to a custom element `<ids-dropdown></ids-dropdown>`
- If using events, events are now plain JS events (change event when changed)
- API is significantly different
- No longer uses a select element

## Designs

[Design Specs 4.5](https://www.figma.com/file/yaJ8mJrqRRej8oTsd6iT8P/IDS-(SoHo)-Component-Library-v4.5?node-id=760%3A771)
[Design Specs 4.6](https://www.figma.com/file/ok0LLOT9PP1J0kBkPMaZ5c/IDS_Component_File_v4.6-(Draft))

## Accessibility Guidelines

The dropdown list has been coded to act similar to the [aria readonly combobox](http://whatsock.com/Templates/Comboboxes/Native%20Inputs,%20Editable%20and%20Readonly/index.htm). With some variations due to having to deal with shadowDom.

## Regional Considerations

Labels should be localized in the current language. The dropdown icons will flip to the alternate side in Right To Left mode. Consider that in some languages text may be a lot longer (German). And in some cases it cant be wrapped (Thai).
