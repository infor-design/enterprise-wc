# Ids Dropdown Component

## Description

The Dropdown allows users to select from a list. Similar to an Html Select element but with with styling. Displays one or more selectable values in a menu that is collapsed by default. A user can select an actionable value.

## Use Cases

- Use when you need to let the user select something from a list of values
- Use when you want users to contribute data to your website and let them organize their content themselves.
- Best used when users do not require a view of all possible values at all times.

## Terminology

- **List Box**: The Ux element that holds the items in the dropdown
- **List Box Option**: The dropdown options but contained in a list box

## Features (With Code Examples)

For a normal tag used as a web component you should set an id and a value. The value should match one of the `ids-list-box-option` in the `ids-list-box`.

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

Its also possible to show icons in the dropdown list. To do this add an `ids-icon` and `span` to each list box `ids-list-box-option`. For symmetry icons should be on all options.

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

Its also possible to show tooltips on the dropdown container or dropdown options. If you set it on the `ids-dropdown` you will see the tooltip on hover of the closed dropdown. If you set it on the options, when these are selected it will change the container tooltip to the selected one.

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
<ids-dropdown id="dropdown-7" label="Dropdown Using Ajax" value="AK">
  <ids-list-box>
    <ids-list-box-option value="AK" id="AK">Alaska</ids-list-box-option>
 </ids-list-box>
</ids-dropdown>
```

For the JS part set the `beforeShow` callback to an async function that returns a promise.

```js
// Use the asynchronous `beforeshow` callback to load contents
const getContents = () => new Promise((resolve) => {
  const xhr = new XMLHttpRequest();
  xhr.open('get', '/data/states.json', true);
  xhr.onload = () => {
    const status = xhr.status;
    if (status === 200) {
      resolve(JSON.parse(xhr.responseText));
    }
  };
  xhr.send();
});

const dropdownAsync = document.querySelector('#dropdown-7');
dropdownAsync.beforeShow = async function beforeShow() {
  return getContents();
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

## Settings

- `dirtyTracker` {boolean} Sets the dirty tracking feature on to indicate a changed
- `disabled` {boolean} Sets dropdown to disabled
- `label` {string} Sets the label text
- `language` {string} Sets the language for RTL and inner labels
- `labelRequired` {boolean} Sets the validation required indicator on label text, it's default to `true`
- `maxlength` {number | string} Maximum characters allowed in textarea
- `placeholder` {string} Sets the placeholder text
- `size` {'sm ' | 'md' | 'lg' | 'full' | string} Sets the size (width)
- `readonly` {boolean} Sets to readonly state
- `validate` {'required' | string} Sets the validation routine to use
- `validationEvents` {'blur' | string} Sets the validation events to use
- `value` {string} Sets option to the matching option by the `value` attribute
- `id` {string} Sets the `id` attribute
- `tooltip` {string} Sets the tooltip on the dropdown container
- `mode` {'light' | 'dark' | 'contrast' | string} Set the theme mode
- `version` {'new' | 'classic' | string} Set the theme version
- `selectedIndex` {number} Sets the the selected option by index

## Events

- `change` Fires when an option is selected / changed
- `focus` Fires at the time the dropdown is focused

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

## Converting from Previous Versions

- 3.x: Dropdown have all new markup and classes.
- 4.x: Dropdown have all new markup and classes for web components.
- 5.x: Dropdown is now a custom web element with all new classes

## Designs

[Design Specs 4.5](https://www.figma.com/file/yaJ8mJrqRRej8oTsd6iT8P/IDS-(SoHo)-Component-Library-v4.5?node-id=760%3A771)
[Design Specs 4.6](https://www.figma.com/file/ok0LLOT9PP1J0kBkPMaZ5c/IDS_Component_File_v4.6-(Draft))

## Accessibility Guidelines

The dropdown list has been coded to act similar to the [aria readonly combobox](http://whatsock.com/Templates/Comboboxes/Native%20Inputs,%20Editable%20and%20Readonly/index.htm). With some variations due to having to deal with shadowDom.

## Regional Considerations

Labels should be localized in the current language. The dropdown icons will flip to the alternate side in Right To Left mode. Consider that in some languages text may be a lot longer (German). And in some cases it cant be wrapped (Thai).
