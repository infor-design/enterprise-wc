# Ids Text Component

## Description

This component styles tabs which serve as navigation points and
way to highlight which section/content in a page you are currently
focused on.

## Use Cases

- When you need to add a series of navigatable headers and vertical
space is a priority.

## Features (With Code Examples)

A normal text element used as a web component in size 16px.

```html
<ids-tabs>
    <ids-tabs>
        <ids-tab>Example One</ids-tab>
    </ids-tab>
</ids-tabs>
```

URI-Hashing-Enabled tab

```html
<ids-tabs uri-hashing="true">Disabled Text</ids-text>
```

TODO: phase i examples

## Settings and Attributes

`IdsTabs`
- `disabled` {boolean} disables all tabs.
- `value` {string} set which tab is currently selected. If tab children
do not have a value, will fall back to being a 0-based index. Otherwise, it can
also be any string as long as there are relevant matches for the values.
- `orientation` {'horizontal' | 'vertical'} defaults to horizontal; controls
the direction/axis tabs are flowed on.

`IdsTab`
- `disabled` {boolean} allows you to disable a tab among a set of tabs.
- `value` {string | number} the value which when the parent `ids-tabs` also
has an equivalent for, selects this tab.

## Themeable Parts

TODO

## States and Variations (With Code Examples)

TODO

## Keyboard Guidelines

TODO

## Responsive Guidelines

- Flows with padding and margin within the width and height of the parent container. Possibly scrolling as needed based on parent dimensions.

## Converting from Previous Versions

TODO

## Accessibility Guidelines

TODO

## Regional Considerations

Text within tabs should be localized in the current language. They should also should flip to the alternate side in Right To Left mode. Consider that in some languages text may be a lot longer (German). And in some cases it cant be wrapped (Thai).
