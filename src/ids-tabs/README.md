# Ids Tabs Component

## Description

Tabs are a navigation element used to allow users to easily access different areas of a site or different parts of an individual page. A user can navigate between page sections with a tab. Best for communicating different views of the data, or offering navigation between related data.
way to highlight which section/content in a page you are currently
focused on.

## Use Cases

- Used when need information to be highly scannable and to simplify navigation.
- Used when a page needs a more organized structure.

## Features (With Code Examples)

A normal default horizontal tab component.

```html
<ids-tabs value="one">
    <ids-tab value="one">Example One</ids-tab>
    <ids-tab value="two">Example Two</ids-tab>
    <ids-tab value="three">Example Three</ids-tab>
</ids-tabs>
```

A vertical tabs component.
```html
<ids-tabs value="one" orientation="vertical">
    <ids-tab value="one">Example One</ids-tab>
    <ids-tab value="two">Example Two</ids-tab>
    <ids-tab value="three">Example Three</ids-tab>
</ids-tabs>
```

TODO: phase i examples

## Settings and Attributes

### Tab Container Settings (`ids-tabs`)
- `disabled` {boolean} disables all tabs.
- `value` {string} set which tab is currently selected. If tab children
do not have a value, will fall back to being a 0-based index. Otherwise, it can
also be any string as long as there are relevant matches for the values.
- `orientation` {'horizontal' | 'vertical'} defaults to horizontal; controls
the direction/axis tabs are flowed on.

### Individual Tabs Settings (`ids-tab`)
- `disabled` {boolean} allows you to disable a tab among a set of tabs.
- `value` {string | number} the value which when the parent `ids-tabs` also
has an equivalent for, selects this tab.

## Themeable Parts

TODO

## States and Variations (With Code Examples)

TODO

## Keyboard Guidelines

- TAB should move off of the component to the next focusable element on page.
- SHIFT + TAB should move to previous focusable element on the page.
- Direction keys (UP/DOWN for vertical, LEFT/RIGHT for horizontal) should move between tabs
- ENTER should select a tab.

## Responsive Guidelines

- Flows with padding and margin within the width and height of the parent container. Possibly scrolling as needed based on parent dimensions.

## Converting from Previous Versions

TODO

## Accessibility Guidelines

TODO

## Regional Considerations

Text within tabs should be localized in the current language. They should also should flip to the alternate side in Right To Left mode. Consider that in some languages text may be a lot longer (German). And in some cases it cant be wrapped (Thai).
