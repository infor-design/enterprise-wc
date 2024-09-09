# ids-card

## Description

A card is an element that groups related information in a flexible container. See more [usage details](https://design.infor.com/components/components/card).

## Terminology

- **Card**: UI design pattern that groups related information that resembles a card
- **Widget**: Card and widget are sometimes used interchangeably.
- **Group Action**: A special toolbar inside the card content area that can be used to act on the content.

## Themeable Parts

- `card` allows you to further style the main card element
- `header` allows you to further style the card header element
- `content` allows you to further style the card content element
- `footer` allows you to further style the card footer element

## Features (With Code Examples)

A card is created by using the custom `ids-card` element. A card has two content slots, one for the header area which usually contains title and a small number of action buttons. The card content area can contain whatever content you like. This content should be responsive.

```html
<ids-card>
  <div slot="card-header">
    <ids-text font-size="20" type="h2">Card Title One</ids-text>
  </div>
  <div slot="card-content">
  </div>
</ids-card>
```

A card can be an actionable with the behavior of a button.

```html
<ids-card actionable="true">
  <div slot="actionable-text">
    <ids-text font-size="16" type="p">Actionable Button Card</ids-text>
  </div>
</ids-card>
```

A card can be a draggable with custom drag-size and drag-styling.

```html
<ids-card draggable drop-target="droppable-panel" width="100%" fixed="true" drag-width="200px" drag-height="400px" drop-width="200px" drop-height="400px">
    <img src="datagrid-icon.png">
    <ids-text slot="card-header" font-size="16">Form</ids-text>
</ids-card>
```

A card can be a draggable that can be stacked.

```html
<ids-card draggable stacked="true" fixed="true" drag-width="200px" drag-height="400px" drop-width="200px" drop-height="400px" width="100%">
    <img src="datagrid-icon.png">
    <ids-text slot="card-header" font-size="16">Form</ids-text>
</ids-card>
```

A card with footer element.

```html
<ids-card>
  <div slot="card-header">
    <ids-text font-size="20" type="h2">Card Title One</ids-text>
  </div>
  <div slot="card-content">
  </div>
  <div slot="card-footer">
  </div>
</ids-card>
```

A card with footer element and vertical no-padding.

```html
<ids-card>
  <div slot="card-header">
    <ids-text font-size="20" type="h2">Card Title One</ids-text>
  </div>
  <div slot="card-content">
  </div>
  <div slot="card-footer" no-padding>
  </div>
</ids-card>
```
## Class Hierarchy

- IdsCard
  - IdsBox
    - IdsElement
- Mixins
  IdsHideFocusMixin
  IdsEventsMixin
  IdsSelectionMixin

## Settings and Attributes

- `autoHeight` {boolean} Makes the card the same height as its inner content
- `actionable` {boolean} It will make the card act as a button (can also act as a link)
- `autoFit` {boolean} Makes the card the same dimensions as the parent element
- `height` {number} It will make the card have a fixed height (used primarily on actionable cards)
- `href` {number} Sets the href attribute for actionable cards that are hyperlinks
- `noHeader` {boolean} Hides the header area
- `backgroundColor` {string} Set the background-color of the card
- `width` {number} Sets the default width of the card
- `dragWidth` {number} Sets the width of the card when being dragged
- `dragHeight` {number} Sets the height of the card when being dragged
- `dragBgColor` {string} Set the background-color of the card while its being dragged
- `dropped` {boolean} Whethere the card has been dropped or not
- `dropWidth` {number} Set the width that the card should be once it's dropped
- `dropHeight` {number} Set the height that the card should be once it's dropped
- `dropBgColor` {string} Set the background-color that the card should be once it's dropped
- `fixed` {boolean} If true, the dragged card will remain in its original place while a shadow of the card will be dragged.
- `stacked` {boolean} If true, the dragged card can be dropped (i.e. stacked) on top of another card.

NOTE: See also `ids-box` settings as some of these will also work on cards.

## States and Variations (With Code Examples)

- Group Action
- Sizes
- Hover
- Disabled
- Focus
- Pressed/Active/Selected

## Keyboard Guidelines

- <kbd>Tab/Shift+Tab</kbd>: If the card has focusable elements, tab will toggle through them in the general form order. If the header contains a toolbar. Arrow keys should be used between buttons on the toolbars

## Responsive Guidelines

- Depending on the container in the responsive grid, the width of the card follows the layout of the grid. However, when using in a home page a special algorithm is used to both keep the tab order and fill in the gaps most efficiently depending on the card dimensions.

## Accessibility Guidelines

- 1.4.1 Use of Color - Color is not used as the only visual means of conveying information, indicating an action, prompting a response, or distinguishing a visual element. Ensure the color tags that indicate state like OK, cancel, ect have other ways to indicate that information. This is failing.
- 1.4.3 Contrast (Minimum) - The visual presentation of text and images of text has a contrast ratio of at least 4.5:1.   Ensure the color tags pass contrast.

## Regional Considerations

Titles should be localized in the current language. All elements will flip to the alternate side in Right To Left mode. Consider that in some languages text may be a lot longer (German). And in some cases it cant be wrapped (Thai). For some of these cases text-ellipsis is supported.

## Converting from Previous Versions (Breaking Changes)

**3.x to 4.x**
- Cards have all new markup and classes.

**4.x to 5.x**
- Markup has changed to a custom element `<ids-card></ids-card>` and has slots for the header and body content
- Can now be imported as a single JS file and used with encapsulated styles.
- The Card/Widget component has been changed to a web component and renamed to ids-card.
- The expandable card feature is deprecated
