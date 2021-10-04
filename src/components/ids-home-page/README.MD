# Ids Home Page Component

## Description

The Home Page component will set the layout to display the cards in specific order according to available space in it's container. It take care everything as laid out in the best order and use of space it can be. To keep the responsive behavior it will readjust each card size and position on the event of resize.

## Use Cases

- Use when you want organize your content in specific order.

## Terminology

- **Card**: The container to keep the content.

## Features (With Code Examples)

A normal home page used as a web component.

```html
<ids-home-page>
  <ids-card slot="card">
    <div slot="card-header">
      <ids-text>Card 1x1</ids-text>
    </div>
    <div slot="card-content"></div>
  </ids-card>
</ids-home-page>
```

A Card with three columns.

```html
<ids-home-page>
  <ids-card slot="card" colspan="3">
    <div slot="card-header">
      <ids-text>Card 3x1</ids-text>
    </div>
    <div slot="card-content"></div>
  </ids-card>
</ids-home-page>
```

A Card with double height.

```html
<ids-home-page>
  <ids-card slot="card" rowspan="2">
    <div slot="card-header">
      <ids-text>Card 1x2</ids-text>
    </div>
    <div slot="card-content"></div>
  </ids-card>
</ids-home-page>
```

No animation with cards while changing/resizing.

```html
<ids-home-page animated="false">
  <ids-card slot="card" colspan="3">
    <div slot="card-header">
      <ids-text>Card 3x1</ids-text>
    </div>
    <div slot="card-content"></div>
  </ids-card>
  <ids-card slot="card" colspan="2">
    <div slot="card-header">
      <ids-text>Card 2x1</ids-text>
    </div>
    <div slot="card-content"></div>
  </ids-card>
  <ids-card slot="card">
    <div slot="card-header">
      <ids-text>Card 1x1</ids-text>
    </div>
    <div slot="card-content"></div>
  </ids-card>
</ids-home-page>
```

The home page with custom cards height.

```html
<ids-home-page cardHeight="260">
  <ids-card slot="card" colspan="3">
    <div slot="card-header">
      <ids-text>Card 3x1</ids-text>
    </div>
    <div slot="card-content"></div>
  </ids-card>
  <ids-card slot="card" colspan="2">
    <div slot="card-header">
      <ids-text>Card 2x1</ids-text>
    </div>
    <div slot="card-content"></div>
  </ids-card>
  <ids-card slot="card">
    <div slot="card-header">
      <ids-text>Card 1x1</ids-text>
    </div>
    <div slot="card-content"></div>
  </ids-card>
</ids-home-page>
```

The home page with custom cards width.

```html
<ids-home-page cardWidth="260">
  <ids-card slot="card" colspan="3">
    <div slot="card-header">
      <ids-text>Card 3x1</ids-text>
    </div>
    <div slot="card-content"></div>
  </ids-card>
  <ids-card slot="card" colspan="2">
    <div slot="card-header">
      <ids-text>Card 2x1</ids-text>
    </div>
    <div slot="card-content"></div>
  </ids-card>
  <ids-card slot="card">
    <div slot="card-header">
      <ids-text>Card 1x1</ids-text>
    </div>
    <div slot="card-content"></div>
  </ids-card>
</ids-home-page>
```

The home page max columns.

```html
<ids-home-page cols="4">
  <ids-card slot="card" colspan="4">
    <div slot="card-header">
      <ids-text>Card 4x1</ids-text>
    </div>
    <div slot="card-content"></div>
  </ids-card>
  <ids-card slot="card" colspan="2">
    <div slot="card-header">
      <ids-text>Card 2x1</ids-text>
    </div>
    <div slot="card-content"></div>
  </ids-card>
  <ids-card slot="card">
    <div slot="card-header">
      <ids-text>Card 1x1</ids-text>
    </div>
    <div slot="card-content"></div>
  </ids-card>
  <ids-card slot="card">
    <div slot="card-header">
      <ids-text>Card 1x1</ids-text>
    </div>
    <div slot="card-content"></div>
  </ids-card>
</ids-home-page>
```

The card gap for single span, apply same for both horizontal and vertical sides.

```html
<ids-home-page gap="50">
  <ids-card slot="card" colspan="3">
    <div slot="card-header">
      <ids-text>Card 4x1</ids-text>
    </div>
    <div slot="card-content"></div>
  </ids-card>
  <ids-card slot="card">
    <div slot="card-header">
      <ids-text>Card 2x1</ids-text>
    </div>
    <div slot="card-content"></div>
  </ids-card>
  <ids-card slot="card">
    <div slot="card-header">
      <ids-text>Card 1x1</ids-text>
    </div>
    <div slot="card-content"></div>
  </ids-card>
  <ids-card slot="card">
    <div slot="card-header">
      <ids-text>Card 1x1</ids-text>
    </div>
    <div slot="card-content"></div>
  </ids-card>
</ids-home-page>
```

The card horizontal gap for single span.

```html
<ids-home-page gap-x="50">
  <ids-card slot="card" colspan="3">
    <div slot="card-header">
      <ids-text>Card 4x1</ids-text>
    </div>
    <div slot="card-content"></div>
  </ids-card>
  <ids-card slot="card">
    <div slot="card-header">
      <ids-text>Card 2x1</ids-text>
    </div>
    <div slot="card-content"></div>
  </ids-card>
  <ids-card slot="card">
    <div slot="card-header">
      <ids-text>Card 1x1</ids-text>
    </div>
    <div slot="card-content"></div>
  </ids-card>
  <ids-card slot="card">
    <div slot="card-header">
      <ids-text>Card 1x1</ids-text>
    </div>
    <div slot="card-content"></div>
  </ids-card>
</ids-home-page>
```

The card vertical gap for single span.

```html
<ids-home-page gap-y="50">
  <ids-card slot="card" colspan="3">
    <div slot="card-header">
      <ids-text>Card 4x1</ids-text>
    </div>
    <div slot="card-content"></div>
  </ids-card>
  <ids-card slot="card">
    <div slot="card-header">
      <ids-text>Card 2x1</ids-text>
    </div>
    <div slot="card-content"></div>
  </ids-card>
  <ids-card slot="card">
    <div slot="card-header">
      <ids-text>Card 1x1</ids-text>
    </div>
    <div slot="card-content"></div>
  </ids-card>
  <ids-card slot="card">
    <div slot="card-header">
      <ids-text>Card 1x1</ids-text>
    </div>
    <div slot="card-content"></div>
  </ids-card>
</ids-home-page>
```

## Settings for HomePage

- `animated` {boolean} Set to animated or not the home page cards on resize
- `cardHeight` {number} Set card height for single span
- `cardWidth` {number} Set card width for single span
- `cols` {number} Set the number of columns to display
- `gap` {number} Set card gap for single span, apply same for both horizontal and vertical sides
- `gapX` {number} Set card horizontal gap for single span
- `gapY` {number} Set card vertical gap for single span


## Settings for cards

- `colspan` {number} Set the horizontal span size (`card-width * colspan`)
- `rowspan` {number} Set the vertical span size (`card-height * rowspan`)

## Events

- `resized` Fires after the page is resized and layout is set. Detail contains the element `elem` and the home page current status as rows, columns, container-height and matrix for each block.

## Methods

- `refresh` Refresh will resize calculations to update any changes.

## Themeable Parts

- `home-page` allows you to further style the home-page element
- `cards` allows you to further style the cards container element

## States and Variations (With Code Examples)

- Animated cards on change or resize
- Custom card height/width
- Number of max columns to display
- Horizontal and vertical span size
- Card gap for single span both horizontal and vertical sides

## Keyboard Guidelines

- <kbd>Tab/Shift+Tab</kbd>: If the tab is focusable this will focus or unfocus content.

## Responsive Guidelines

- Flows the laid out in the best order and use of space it can be. It is possible to adjust columns to different size depending on how much screen and parent dimensions.

## Converting from Previous Versions

- 3.x: Home Page have all new markup and classes.
- 4.x: Home Page have all new markup and classes for web components.

## Designs

[Design Specs](https://www.figma.com/file/yaJ8mJrqRRej8oTsd6iT8P/IDS-(SoHo)-Component-Library-v4.5?node-id=760%3A771)

## Accessibility Guidelines

- The component respects element tab order which is important between the main containers

## Regional Considerations

The cards will flip to the alternate side in Right To Left mode.
