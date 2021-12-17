# Ids Counts Component

## Description

Counts are distinctive elements used to highlight high level numbers or metrics.

## Use Cases

- Use counts in dashboards and visualizations for summarizing key numeric takeaways.
- Use counts as a concise numeric data point that can link to underlying detail elsewhere on the page or site.

## Terminology

- **Counts**: UI embellishments for summarizing high level numeric information.
- **Value**: The numeric value displayed on the count component.
- **Text**:  The name or brief description of the value.
- **Compact**: When compact, the count value appears slightly smaller than usual.

## Features (With Code Examples)

A card is created using the custom `ids-counts` element. A user can place elements inside of the component to represent text. It is recommended to use ids-text components as ids-counts has functionality to manage that input specifically.

A normal Counts component

```html
<ids-counts href="#">
  <ids-text count-value>7</ids-text>
  <ids-text count-text>Active <br /> Opportunities</ids-text>
</ids-counts>
```

The same component could be made "Not Actionable" by removing the href attribute

```html
<ids-counts>
  <ids-text count-value>7</ids-text>
  <ids-text count-text>Active <br /> Opportunities</ids-text>
</ids-counts>
```

Setting the optional "Compact" attribute to "true" decreases the font size of the value

```html
<ids-counts compact="true" href="#">
  <ids-text count-value>7</ids-text>
  <ids-text count-text>Active <br /> Opportunities</ids-text>
</ids-counts>
```

The counts component also supports an optional "Color" attribute. The options for color are base (blue), caution, danger, success, warning, or a hex code with the "#"

```html
<ids-counts href="#" color="base">
  <ids-text count-value>7</ids-text>
  <ids-text count-text>Active <br /> Opportunities</ids-text>
</ids-counts>
```

Counts using just the css. Use the anchor tag for normal counts and span for non-actionable.

```html
<a class="ids-counts" color="base" href="#">
  <div class="text">7</div>
  <div class="value">Active<br>Opportunities</div>
</a>
<span class="ids-counts" color="base">
  <div class="text">7</div>
  <div class="value">Active<br>Opportunities</div>
</span>
```

## Settings and Attributes

- `color` {string} Sets the color to an internal color such as `azure`. Can also a hexadecimal color code beginning with `#`.
- `compact` {string} Use "true" to set the value font-size to 40. Omitting this attribute or using any will result in the default value of 48.
- `href` {string} The url that the count component links to.

## States and Variations (With Code Examples)

- Actionable
- Color
- Compact

## Keyboard Guidelines

- <kbd>Tab/Shift+Tab</kbd>: If the count is actionable (default) this will toggle through them in the general form order. Non-actionable counts do not get selected.
- <kbd>Enter</kbd>: This will follow the tag link.

## Responsive Guidelines

- Flows with padding and margin within the width and height of the parent container.

## Converting from Previous Versions

- 3.x: Counts have all new markup and classes.
- 4.x: Counts have all new markup and classes for web components.

## Accessibility Guidelines

- 1.4.1 Use of Color - Color is not used as the only visual means of conveying information, indicating an action, prompting a response, or distinguishing a visual element. Ensure the color tags that indicate state like OK, cancel, ect have other ways to indicate that information. This is failing.
- 1.4.3 Contrast (Minimum) - The visual presentation of text and images of text has a contrast ratio of at least 4.5:1.   Ensure the color tags pass contrast.

## Regional Considerations

Text should be localized in the current language. Consider that in some languages text may be longer (German) and in some cases it can't be wrapped (Thai).
