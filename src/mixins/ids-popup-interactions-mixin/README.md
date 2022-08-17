# Ids Popup Interactions Mixin

This mixin is intended to be used in a higher-order component wrapping an [IdsPopup](../../components/ids-popup/README.md). The mixin allows a component to define references to other elements that will be used to assign trigger events for showing/hiding the IdsPopup.

This mixin is found in components such as [IdsModal](../../components/ids-modal/README.md) and [IdsPopupMenu](../../components/ids-popup-menu/README.md).

## Settings and Attributes

When using Popup Interactions, it's possible set the following attributes/properties:

- `target` {string|HTMLElement} - defines an element that will (usually) be the element receiving interaction events.  This is also the element that will be used as an `alignTarget` for the IdsPopup wrapped inside this component.
- `trigger-elem` {string|HTMLElement} - alternatively defines a separate element to receive interaction events instead of the `target`.  This allows for separation between the triggering element, and the element that the IdsPopup aligns against.
- `trigger-type` {string} - defines the type of interaction events that should be applied to the triggering element.

### Trigger types

- `contextmenu` - Replaces the default browser Context Menu via the document's `contextmenu` event handler.  When used with `trigger-elem`, this can be scoped to elements on the page as well.
- `click` - Causes the IdsPopup to be displayed when the triggering element is clicked.
- `hover` - Causes the IdsPopup to be displayed when the triggering element is hovered.
- `immmediate` - Causes the IdsPopup to be immediately displayed when set.

To use this Mixin in your component,

1. Import `IdsPopupInteractionsMixin` and add to the component-base.js
1. Add `IdsPopupInteractionsMixin` to the @mixes comment section
1. Make sure your component's attributes extend `return [...super.attributes]` in the `attributes` to allow propagation of added mixin attributes.
1. Make sure the `connectedCallback` calls `super.connectedCallback();`
