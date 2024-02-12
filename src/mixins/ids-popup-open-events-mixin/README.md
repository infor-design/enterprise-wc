# Ids Popup Open Events Mixin

This mixin is intended to add events that will assist in clicking out of a popup to close it.

## Setup

When using the mixin you need to do the following

- Import it `import IdsPopupOpenEventsMixin from '../../mixins/ids-popup-open-events-mixin/ids-popup-open-events-mixin';`
- Add `IdsPopupOpenEventsMixin` to the Base object
- Call `this.addOpenEvents();` wherever the event handlers are established
- Call `this.removeOpenEvents();` wherever the event handlers are torn down
- Setup `this.popupOpenEventsTarget = this.overlay;` to any target other than the view port

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
