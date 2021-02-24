# Ids Popup Component

The IDS Popup Component allows for the placement of any HTML content in a fixed/absolute-positioned container anywhere on a page.  The component provides API for setting coordinates, or aligning the container in relation to a "parent" element on the page.  Additional API exists for modifying alignment, visibility, and controlling animation.

This component is a building-block component for many "placeable" IDS Components, such as the [Popup Menu](../ids-popup-menu/README.md) and [Modal](../ids-modal/README.md)

## Use Cases

- Place HTML content using X/Y coordinates
- Place HTML content using a parent element, and X/Y offsets

## Terminology

### Alignment

**Align Target** Defines an external element that serves as a "triggering" element for the Popup.
**Align Edge** Also called the "primary alignment", given two alignment values, the first one is the edge of an Align Target that the Popup will be placed against immediately. For example "bottom" will cause the Popup to be aligned at the bottom of the Align Target.
**Primary Alignment** See "Align Edge"
**Secondary Alignment** Given two alignment values, the secondary alignment is optional, and will cause the Popup to line up the given edge with the Align Target's given edge.  For example, given `top, left`, the secondary alignment will cause the Popup to align primarily to the top of the Align Target, but will also line up both the Popup and the Align Targets' left edges.

### Other

**Arrow** Popups can optionally display arrows that can point to content when used with an Align Target.
**Type** Defines the style of Popup that can be used.  There are several different display types, the most common one being `menu`.

## Features (with code samples)

Creating a Context-menu style that would open on click might look like the following:

```html
<ids-popup id="my-popup" x="0" y="10" align="top, left">
  <div slot="contents">My Popup</div>
</ids-popup>
```

To create a Popup that appears to align itself against a button, you could do the following:

```html
<ids-popup id="my-popup" x="10" y="10" align="top, left" alignTarget="#my-button">
  <div slot="contents">My Popup</div>
</ids-popup>

...

<ids-button id="my-button">
  <span slot="text">My Button</span>
</ids-button>
```

## Usage Tips

- When making a Popup that is placed in reference to an adjacent element, it must be placed AFTER it in the DOM. Placing it BEFORE the adjacent element can cause its placement to be incorrect on its first render.
- When using an `alignTarget`, also using the `arrow` setting and pointing it in the direction of the `alignTarget` can help contextualize the relationship between the two elements.
