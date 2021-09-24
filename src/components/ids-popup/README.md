# Ids Popup Component

The IDS Popup Component allows for the placement of any HTML content in a fixed/absolute-positioned container anywhere on a page.  The component provides API for setting coordinates, or aligning the container in relation to a "parent" element on the page.  Additional API exists for modifying alignment, visibility, and controlling animation.

This component is a building-block component for many "placeable" IDS Components, such as the [Popup Menu](../ids-popup-menu/README.md) and [Modal](../ids-modal/README.md)

## Use Cases

- Placing HTML content using X/Y coordinates
- Placing HTML content against a target element and using X/Y offsets

## Terminology

### Alignment

**Align Target** Defines an external element that serves as a "triggering" element for the Popup.
**Align Edge** Also called the "primary alignment", given two alignment values, the first one is the edge of an Align Target that the Popup will be placed against immediately. For example "bottom" will cause the Popup to be aligned at the bottom of the Align Target.
**Primary Alignment** See "Align Edge"
**Secondary Alignment** Given two alignment values, the secondary alignment is optional, and will cause the Popup to line up the given edge with the Align Target's given edge.  For example, given `top, left`, the secondary alignment will cause the Popup to align primarily to the top of the Align Target, but will also line up both the Popup and the Align Targets' left edges.

### Other

**Arrow** Popups can optionally display arrows that can point to content when used with an Align Target.
**Arrow Target** The element that a Popup's Arrow will point toward.  This defaults to an Align Target, but can also be defined separately.
**Bleeds** Determines when Popups are allowed to exist outside their defined Containing Element.  A Popup that does not bleed will remain contained, no matter what coordinates/offsets are provided.
**Containing Element** Popups are confined to a contained area inside of a page.  This area may be the entire document body,
an [IDS Container](../ids-container/README.md), or a custom-defined element.  If bleeding is disabled, the Popup will never cross the boundaries of the container.
**Coordinates** When placed directly in a page (not aligned against an element), a Popup uses its provided x/y values as coordinates as if plotted on a graph.
**Offsets** When placed against a parent element, a Popup uses its provided x/y values as offsets from the base position detected.
**Type** Defines the style of Popup that can be used.  There are several different display types, the most common one being `menu`.

## Themeable Parts

- `popup` allows you to further style or adjust the outer popup element
- `arrow` allows you to adjust the arrow element

## Features (with code samples)

Creating a Context-menu style that would open on click might look like the following:

```html
<ids-popup id="my-popup" x="0" y="10" align="top, left">
  <div slot="content">My Popup</div>
</ids-popup>
```

To create a Popup that appears to align itself against a button, you could do the following:

```html
<ids-popup id="my-popup" x="10" y="10" align="top, left" alignTarget="#my-button">
  <div slot="content">My Popup</div>
</ids-popup>

...

<ids-button id="my-button">
  <span slot="text">My Button</span>
</ids-button>
```

### Using Visibility

Display the Popup using the `visible` attribute:

```html
<ids-popup id="my-popup"  x="10" y="10" align="top, left" alignTarget="#my-button" visible="true">
    <div slot="content">My Popup</div>
</ids-popup>
```

Programatically, you can use the `visible` JS property:

```js
const popup = document.querySelector('#my-popup');
popup.visible = true;
```

... or explicity call `show()` or `hide()` methods:

```js
const popup = document.querySelector('#my-popup');
await popup.show();

// close
await popup.hide();
```

When the Popup is visible, it's possible to tell the Popup to re-render its position by using `place()`:

```js
const popup = document.querySelector('#my-popup');
await popup.place();
```

### Place

The Popup's coordinates/offsets can be set individually.  The action of using the x/y setters will change the stored position internally, but will not automatically be rendered.  Also, the position will not be rendered if the Popup is not visible.

To intially set a Popup's position, you can use the following:

```js
const popup = document.querySelector('#my-popup');
popup.x = 100;
popup.y = 200;
await popup.show();
await popup.place();
```

It's also possible to set both coordinate values, make the Popup visible, and render the placement in one pass using `setPosition()`:

```js
const popup = document.querySelector('#my-popup');
popup.setPosition(100, 200, true, true);
```

### Position Styles

There are three position styles:

`fixed` - Uses simpler algorithms using `position: fixed;` and ignores container scrolling.
`absolute` - Uses `position: fixed;` and accounts for container scrolling.
`viewport` - This ignores the x/y offsets and positions the Popup directly in the middle of the viewport.  This is used for [Modals](../ids-modal/README.md)

### Animation Styles

If the `animated` property is set, the `animation-styles` available are:

- `fade`: animates in/out using a simple fade transition.
- `scale-in`: Grows in from the center, shrinks out to the center on top of a simple fade transition. This is used on [Modals](../ids-modal/README.md)

### Using Arrows

Some Popup styles need to "point" at their triggering element for context, such as [Tooltips](../ids-tooltip/README.md).  To create a Popup that uses an arrow, simply tell it which way to point:

```html
<ids-popup id="my-popup" x="10" y="10" align="top, left" alignTarget="#my-button" arrow="top">
  <div slot="content">My Popup</div>
</ids-popup>
<ids-button id="my-button">
  <span slot="text">My Button</span>
</ids-button>
```

In this configuration, if a Popup is given offset value that corresponds to the `alignEdge` is not greater than the size of the Popup, the arrow's placement will be autocorrect to try and stay in alignment with the `arrowTarget`. If the offset value is greater, the arrow will hide automatically.

### Using Bleeds and Containment

Popups can be configured to remain inside of a set boundary element, referred to as a Containing Element.  If defined, the Popup will not cross the boundaries the containing element.  An example of this functionality is the prevention of an [IdsPopupMenu](../ids-popup-menu/README.md) from appearing to be cut off by the browser's edges.

Use of a containing element could be configured in this manner:

```html
<ids-popup id="my-popup" x="0" y="0" align="top, left">
  <div slot="content" style="width: 100px; height: 100px;">My Popup</div>
</ids-popup>

<div id="my-container" style="width: 500px; height: 500px;"></div>
```
```js
const popup = document.querySelector('#my-popup');
const container = document.querySelector('#my-container');
popup.containingElem = container;
```

After setting the `containingElem` property, setting coordinates will place the Popup in a position that accounts for not crossing the container's edges.  For example:

```js
popup.x = 500;
```

Given this value, the Popup will attempt to set the X coordinate at 500px using the default alignment of `top, left`, which places the left-most edge of the Popup at 500px.  Placing in this position would cross the boundary of the container, so instead the Popup will be nudged back into the containing element entirely, ending up with an X placement around 400px.

It's also possible to disable the check for bleeding, if necessary:

```js
popup.bleed = false;
```

Running this immediately after our example above will cause the Popup to actually be placed at 500px.

If we decide to remove containment by the element, we can simply set it back to it's default:

```js
popup.containingElem = document.querySelector('ids-container');
```

## Usage Tips

- When making a Popup that is placed in reference to an adjacent element, it must be placed AFTER it in the DOM. Placing it BEFORE the adjacent element can cause its placement to be incorrect on its first render.
- When using an `alignTarget`, also using the `arrow` setting and pointing it in the direction of the `alignTarget` can help contextualize the relationship between the two elements.
