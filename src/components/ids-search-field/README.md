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

## Responsive Guidelines

- Because this component is simply an `ids-input` wrapped inside an `ids-trigger-field`, it will depend on the styling of those two components

## Converting from Previous Version

### Converting from 4.x

```html
<!-- 4.x search field example -->
<div class="field">
  <label for="searchfield">Search</label>
  <input id="searchfield" name="searchfield" class="searchfield" data-options= "{'clearable': 'true'}" placeholder="Type a search term"/>
</div>

<!-- this is the equivalent web component -->
<ids-search-field label="Search" placeholder="Type a seardch term"></ids-search-field>