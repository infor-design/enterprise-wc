# ids-hyperlink

## Description

Hyperlinks open a document or navigate to a new location. See more [usage details](https://design.infor.com/components/components/hyperlink).

## Features (With Code Examples)

A standard hyperlink that opens a url in a new window:

```html
<ids-hyperlink href="http://www.example.com" target="_blank">Normal Link</ids-hyperlink>
```

A disabled hyperlink element:

```html
  <ids-hyperlink href="http://www.example.com" disabled="true" target="_blank">Disabled Link</ids-hyperlink>
```

Links can be styled in a ids-box, for use within widgets:

```html
<ids-hyperlink href="http://www.example.com" target="_blank" text-decoration="none" color="unset">
  <ids-box shadowed>
    <ids-layout-flex direction="column" justify-content="center">
      <ids-layout-flex-item>
        <ids-icon icon="stacked"></ids-icon>
      </ids-layout-flex-item>
      <ids-layout-flex-item>
        <ids-text font-size="16" font-weight="semi-bold">Purchase Order Intake Workbench</ids-text>
      </ids-layout-flex-item>
    </ids-layout-flex>
  </ids-box>
</ids-hyperlink>
```

Links can be grouped in a list, with an optional title. If used in a widget, leave the title off and use the widget title.

```html
<ids-link-list title="Link List">
  <ids-hyperlink href="http://www.example.com" target="_blank" text-decoration="none">Categories</ids-hyperlink>
  <ids-hyperlink href="http://www.example.com" target="_blank" text-decoration="none" disabled>Organization Configuration</ids-hyperlink>
  <ids-hyperlink href="http://www.example.com" target="_blank" text-decoration="none">Types</ids-hyperlink>
  <ids-hyperlink href="http://www.example.com" target="_blank" text-decoration="none">Organization Configuration</ids-hyperlink>
  <ids-hyperlink href="http://www.example.com" target="_blank" text-decoration="none">Appraisal Email Templates</ids-hyperlink>
</ids-link-list>
```

## Settings and Attributes

- `disabled` {boolean} Sets the link to `disabled`.
- `href` {string} Sets the link `href` to a url or file.
- `target` {string} Sets the links `target` attribute: '_blank' | '_self' | '_parent' | '_top' | frame name.
- `allow-empty-href` {boolean} Allows underline and styling of the link when `href` attribute is empty. Defaults to `true`.
- `col-span` {number} Can be used for box links to double the width.

## Themeable Parts

- `link` allows you to further style the link element

## States and Variations (With Code Examples)

- Disabled
- Visited
- Hover
- Active

## Responsive Guidelines

- Flows with padding and margin within the width and height of the parent container. Possibly scrolling as needed, based on parent dimensions.

## Regional Considerations

Link text should be localized in the current language. Links should flip to the opposite side in right-to-left UIs. Consider that some languages, text may be a lot longer (German). And in some cases it can't be wrapped (Thai).

## Converting from Previous Versions (Breaking Changes)

**3.x to 4.x**

- Used a css class on `<a>` tags

**4.x to 5.x**

- The Hyperlink component has been changed to a web component
- Markup has changed to a custom element `<ids-hyperlink></ids-hyperlink>` (see examples above)
- Can now be imported as a single JS file and used with encapsulated styles
- If using events, events are now plain JS events.
- The directional links have been removed/deprecated.
