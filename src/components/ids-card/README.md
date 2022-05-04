# Ids Card Component

## Description

A card is a UI design pattern that groups related information in a flexible-size container visually resembling a playing card. Cards are also known as widgets when used in a home page tile layout. The card's actions in the toolbar should depend on what is inside the card.

## Use Cases

- Cards are good for grouping information, for example in a homepage dashboard layout
- Cards allow for flexible layout, and can be used in smaller and larger sizes.
- Cards contain various forms of content and actions. Elements like input texts, images, charts, can be displayed inside a card.

## Terminology

- **Card**: UI design pattern that groups related information that resembles a card
- **Widget**: Card and widget are sometimes used interchangeably.
- **Group Action**: A special toolbar inside the card content area that can be used to act on the content.

## Themeable Parts

- `card` allows you to further style the main card element
- `header` allows you to further style the card header element
- `content` allows you to further style the card content element

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

## Settings and Attributes

- `autoHeight` {boolean} Makes the card the same height as its inner content
- `actionable` {boolean} It will make the card act as a button
- `height` {number} It will make the card have a fixed height (used primarily on actionable cards)

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
