# Ids Search Field

## Description

A specific composition of existing components [Trigger Field](../ids-trigger-field/README.md) and [Input](../ids-input/README.md) meant for searching purposes. This is ideally placed in a header or at the top of a page so that users can search by typing on an input field.

## Use Cases

- Searching for a product on a market place

## Settings

- `label` { string } title to describe the type of input
- `value` { string } text value of the input
- `placeholder` { string } text hint to show when input is empty
- `disabled` { boolean } disallow editing input and tabbing interaction
- `readonly` { boolean } disallow editing input
- `categories` { string[] } an array of text that dictates what appears in the categories dropdown
- `category` { string } sets the initial text that appears in the categories dropdown menu
- `selectedCategories` { string[] } returns an array of currently selected categories
- `action` { string } if set, an action button will appear on the search field, and this button fires the "search" event
- `multiple` { boolean } if true, this will allow multiple categories to be selected in the category menu

## Events
- `search` - Fires when the category action-button is clicked or when the `Enter` key is pressed.
- `selected` - Fires after a Category is selected.
- `deselected` - Fires after a Category is deselected.
- `change` - Fires when the search field's input field is changed
- `input` - Fires when typing in the search field's input field

## Features (With Code Samples)

Using a custom label and initial value
```html
<ids-search-field label="Pokemon" value="Pikachu"></ids-search-field>
```

Using a custom Placeholder
```html
<ids-search-field label="Pokemon" placeholder="Type any Pokemon name"></ids-search-field>
```

Disabled state
```html
<ids-search-field disabled label="Pokemon" placeholder="Snorlax" value=""></ids-search-field>
```

Read-only state
```html
    <ids-search-field readonly label="Pokemon" value="Lapras"></ids-search-field>
```

Search field with Categories
```html
  <ids-search-field label="Categories" category="Files" clearable></ids-search-field>
```
```js
document.querySelector('ids-search-field[category]')?.categories = ['Images', 'Documents', 'Audio', 'Video'];
```

Search field with Categories that specifies that multiple can be selected
```html
  <ids-search-field label="Categories - Multiple" category="Files" multiple></ids-search-field>
```
```js
document.querySelector('ids-search-field[multiple]')?.categories = ['Images', 'Documents', 'Audio', 'Video'];
```

Search field with short version Categories dropdown menu (category attribute not set)
```html
  <ids-search-field label="Categories - Short"  id="categories-short"></ids-search-field>
```
```js
document.querySelector('#categories-short')?.categories = ['Images', 'Documents', 'Audio', 'Video'];
```

## Responsive Guidelines

- Because this component is simply an `ids-input` wrapped inside an `ids-trigger-field`, it will depend on the styling of those two components

## Converting from Previous Versions (Breaking Changes)

**3.x to 4.x**

- Searchfield is a new component added in v4.0.0
- Searchfield is invoked with `$('#my-element').searchfield();`

**4.x to 5.x**

- Search Field is now a custom element `<ids-search-field></ids-search-field>`
- Search Field extends IdsTriggerField and IdsInput, holding all functionality of those components

### Converting from 4.x

```html
<!-- 4.x search field example -->
<div class="field">
  <label for="searchfield">Search</label>
  <input id="searchfield" name="searchfield" class="searchfield" data-options= "{'clearable': 'true'}" placeholder="Type a search term"/>
</div>

<!-- this is the equivalent web component -->
<ids-search-field label="Search" placeholder="Type a seardch term"></ids-search-field>
