# Ids Home Page Component

## Description

Homepages hold combinations of widgets that are tailored to the needs of a user’s workflow. The Home Page component will set the layout to display the widgets in specific order according to available space in it's container. It take care everything as laid out in the best order and use of space that is possible. To keep the responsive behavior it will readjust each widget size and position on the event of resize.

## Use Cases

- Use when you want organize your content in specific order.
- A homepage is an admin or end-user configured page made up of widgets that are relevant to the workflow of a general role or an individual. Widgets can be resized to create layouts best-suited for the data within the widget or homepage.

## Terminology

- **Widget**: The container to keep the content.

## Features (With Code Examples)

A normal home page used as a web component.

```html
<ids-home-page>
  <ids-widget slot="widget">
    <div slot="widget-header">
      <ids-text>Widget 1x1</ids-text>
    </div>
    <div slot="widget-content"></div>
  </ids-widget>
</ids-home-page>
```

A Widget with three columns.

```html
<ids-home-page>
  <ids-widget slot="widget" colspan="3">
    <div slot="widget-header">
      <ids-text>Widget 3x1</ids-text>
    </div>
    <div slot="widget-content"></div>
  </ids-widget>
</ids-home-page>
```

A Widget with double height.

```html
<ids-home-page>
  <ids-widget slot="widget" rowspan="2">
    <div slot="widget-header">
      <ids-text>Widget 1x2</ids-text>
    </div>
    <div slot="widget-content"></div>
  </ids-widget>
</ids-home-page>
```

No animation with widgets while changing/resizing.

```html
<ids-home-page animated="false">
  <ids-widget slot="widget" colspan="3">
    <div slot="widget-header">
      <ids-text>Widget 3x1</ids-text>
    </div>
    <div slot="widget-content"></div>
  </ids-widget>
  <ids-widget slot="widget" colspan="2">
    <div slot="widget-header">
      <ids-text>Widget 2x1</ids-text>
    </div>
    <div slot="widget-content"></div>
  </ids-widget>
  <ids-widget slot="widget">
    <div slot="widget-header">
      <ids-text>Widget 1x1</ids-text>
    </div>
    <div slot="widget-content"></div>
  </ids-widget>
</ids-home-page>
```

The home page with custom widgets height.

```html
<ids-home-page widgetHeight="260">
  <ids-widget slot="widget" colspan="3">
    <div slot="widget-header">
      <ids-text>Widget 3x1</ids-text>
    </div>
    <div slot="widget-content"></div>
  </ids-widget>
  <ids-widget slot="widget" colspan="2">
    <div slot="widget-header">
      <ids-text>Widget 2x1</ids-text>
    </div>
    <div slot="widget-content"></div>
  </ids-widget>
  <ids-widget slot="widget">
    <div slot="widget-header">
      <ids-text>Widget 1x1</ids-text>
    </div>
    <div slot="widget-content"></div>
  </ids-widget>
</ids-home-page>
```

The home page with custom widgets width.

```html
<ids-home-page widgetWidth="260">
  <ids-widget slot="widget" colspan="3">
    <div slot="widget-header">
      <ids-text>Widget 3x1</ids-text>
    </div>
    <div slot="widget-content"></div>
  </ids-widget>
  <ids-widget slot="widget" colspan="2">
    <div slot="widget-header">
      <ids-text>Widget 2x1</ids-text>
    </div>
    <div slot="widget-content"></div>
  </ids-widget>
  <ids-widget slot="widget">
    <div slot="widget-header">
      <ids-text>Widget 1x1</ids-text>
    </div>
    <div slot="widget-content"></div>
  </ids-widget>
</ids-home-page>
```

The home page max columns.

```html
<ids-home-page cols="4">
  <ids-widget slot="widget" colspan="4">
    <div slot="widget-header">
      <ids-text>Widget 4x1</ids-text>
    </div>
    <div slot="widget-content"></div>
  </ids-widget>
  <ids-widget slot="widget" colspan="2">
    <div slot="widget-header">
      <ids-text>Widget 2x1</ids-text>
    </div>
    <div slot="widget-content"></div>
  </ids-widget>
  <ids-widget slot="widget">
    <div slot="widget-header">
      <ids-text>Widget 1x1</ids-text>
    </div>
    <div slot="widget-content"></div>
  </ids-widget>
  <ids-widget slot="widget">
    <div slot="widget-header">
      <ids-text>Widget 1x1</ids-text>
    </div>
    <div slot="widget-content"></div>
  </ids-widget>
</ids-home-page>
```

The widget gap for single span, apply same for both horizontal and vertical sides.

```html
<ids-home-page gap="50">
  <ids-widget slot="widget" colspan="3">
    <div slot="widget-header">
      <ids-text>Widget 4x1</ids-text>
    </div>
    <div slot="widget-content"></div>
  </ids-widget>
  <ids-widget slot="widget">
    <div slot="widget-header">
      <ids-text>Widget 2x1</ids-text>
    </div>
    <div slot="widget-content"></div>
  </ids-widget>
  <ids-widget slot="widget">
    <div slot="widget-header">
      <ids-text>Widget 1x1</ids-text>
    </div>
    <div slot="widget-content"></div>
  </ids-widget>
  <ids-widget slot="widget">
    <div slot="widget-header">
      <ids-text>Widget 1x1</ids-text>
    </div>
    <div slot="widget-content"></div>
  </ids-widget>
</ids-home-page>
```

The widget horizontal gap for single span.

```html
<ids-home-page gap-x="50">
  <ids-widget slot="widget" colspan="3">
    <div slot="widget-header">
      <ids-text>Widget 4x1</ids-text>
    </div>
    <div slot="widget-content"></div>
  </ids-widget>
  <ids-widget slot="widget">
    <div slot="widget-header">
      <ids-text>Widget 2x1</ids-text>
    </div>
    <div slot="widget-content"></div>
  </ids-widget>
  <ids-widget slot="widget">
    <div slot="widget-header">
      <ids-text>Widget 1x1</ids-text>
    </div>
    <div slot="widget-content"></div>
  </ids-widget>
  <ids-widget slot="widget">
    <div slot="widget-header">
      <ids-text>Widget 1x1</ids-text>
    </div>
    <div slot="widget-content"></div>
  </ids-widget>
</ids-home-page>
```

The widget vertical gap for single span.

```html
<ids-home-page gap-y="50">
  <ids-widget slot="widget" colspan="3">
    <div slot="widget-header">
      <ids-text>Widget 4x1</ids-text>
    </div>
    <div slot="widget-content"></div>
  </ids-widget>
  <ids-widget slot="widget">
    <div slot="widget-header">
      <ids-text>Widget 2x1</ids-text>
    </div>
    <div slot="widget-content"></div>
  </ids-widget>
  <ids-widget slot="widget">
    <div slot="widget-header">
      <ids-text>Widget 1x1</ids-text>
    </div>
    <div slot="widget-content"></div>
  </ids-widget>
  <ids-widget slot="widget">
    <div slot="widget-header">
      <ids-text>Widget 1x1</ids-text>
    </div>
    <div slot="widget-content"></div>
  </ids-widget>
</ids-home-page>
```

## Settings for HomePage

- `animated` {boolean} Set to animated or not the home page widgets on resize
- `widgetHeight` {number} Set widget height for single span
- `widgetWidth` {number} Set widget width for single span
- `cols` {number} Set the number of columns to display
- `gap` {number} Set widget gap for single span, apply same for both horizontal and vertical sides
- `gapX` {number} Set widget horizontal gap for single span
- `gapY` {number} Set widget vertical gap for single span


## Settings for widgets

- `colspan` {number} Set the horizontal span size (`widget-width * colspan`)
- `rowspan` {number} Set the vertical span size (`widget-height * rowspan`)

## Events

- `resized` Fires after the page is resized and layout is set. Detail contains the element `elem` and the home page current status as rows, columns, container-height and matrix for each block.

## Methods

- `refresh` Refresh will resize calculations to update any changes.

## Themeable Parts

- `home-page` allows you to further style the home-page element
- `widgets` allows you to further style the widgets container element

## States and Variations (With Code Examples)

- Animated widgets on change or resize
- Custom widget height/width
- Number of max columns to display
- Horizontal and vertical span size
- Widget gap for single span both horizontal and vertical sides

## Keyboard Guidelines

- <kbd>Tab/Shift+Tab</kbd>: If the tab is focusable this will focus or unfocus content.

## Responsive Guidelines

- Flows the laid out in the best order and use of space it can be. It is possible to adjust columns to different size depending on how much screen and parent dimensions.

## Converting from Previous Versions (Breaking Changes)

**3.x to 4.x**

- Home Page has all new markup and classes.

**4.x to 5.x**

- The HomePage component has been changed to a web component
- Markup has changed to a custom element `<ids-home-page></ids-home-page>` (see examples above)
- Can now be imported as a single JS file and used with encapsulated styles
- If using events, events are now plain JS events.
- The hero example must be created manually by styling a widget

## Accessibility Guidelines

- The component respects element tab order which is important between the main containers

## Regional Considerations

The widgets will flip to the alternate side in Right To Left mode.
