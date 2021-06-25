## Ids Mixins

Mixins are simply functions with shared functionality that can be injected into a component. For example the IdsEventOmitter. They get around the issue that in JS that you cannot inherit from more than one object. Also they prevent the Base Element from getting bloated with functionality that not every component uses. Ids is using a simple object as a mixin that in "injected" into the component in the constructor and then used according to its documentation. If the mixin has UI elements it should probably be a web component instead.

## Ids Keyboard Mixin

- Handles detaching if a key is pressed down currently
- Adds a hot key mapper
- Can list the supported keys for a component

The Keyboard mixin is attached with the `mix ... with` decorator. To use it to respond to keys in a component you can use it like this:

```js
handleKeys() {
    this.listen('Enter', this, (e) => {
        // Do something on Enter
    });
}
```

Also at any time you can check `this.pressedKeys` to see what keys are current down. `this.hotkeys` contains all the currently watched keys.

## Ids Events Mixin

Adds a small wrapper around component events. This can be used to see what event handlers are attached on a component as well as the fact that the Ids Element Base will call removeAll to remove all used event handlers.

The Keyboard mixin is attached with the `mix ... with` decorator. To use it to respond to events in a component you can use it like this:

```js
  // Handle Clicking the x for dismissible
  const closeIcon = this.querySelector('ids-icon[icon="close"]');
  this.addEventListener('click', closeIcon, () => this.dismiss());
```

- Handles consistency on the data sent (element, event data, id, idx, custom ect.)
- Before events events can be vetoed
- All events should have past tense for example `activated`, `beforeactivated`, `afteractived` and not `activate`, `beforeactivate`, `afteractivate`

It's also possible to use Namespaces with the Ids Event Handler's methods, similar to the 4.x version's support for jQuery Event Namespaces.  When assigning an event name, usage of a period (.) will cause any text after the period to be considered the "namespace".  When removing assigned event listeners using the namespace, only handlers that match the event type AND namespace will be removed:

```js
this.onEvent('click', closeIcon, () => this.dismiss());
this.onEvent(('click.doop', closeIcon, () => this.otherDismissCheck());
console.log(this.handledEvents());
// both `click` and `click.doop` exist.

this.offEvent(('click.doop', closeIcon);
console.log(this.handledEvents());
// `click.doop` is not there, but `click` remains.
```

The events mixin also lets you use a few convenient "custom events" for common interactions. We currently have the following events.

- `hoverend` Fires when the user hovers the target and stops. This is to ensure they actually hovered the element and didn't just accidentally pass the mouse over it.
- `swipe` Fires when a user swipes left or right on a scrollable element. The direction can be seen in `event.detail`
- `longpress` Fires when the user presses and olds on a touch device.

## Ids Resize Mixin

This mixin contains lifecycle methods for making a component detect page and element resizing.  The mixin allows a component to be registered against a global instance of ResizeObserver, which can trigger size changes throughout the UI, and fire a `refresh()` method on the component if one is defined.  The mixin also has lifecycle methods for setting up and tearing down a MutationObserver that can will fire a `refresh()` method on the component if one is defined.

## Ids Deep Clone Mixin

This mixin makes a deep copy of an array or object even if its nested, or contains functions. Its optimized to be very fast. In addition it can handle circular references. Its used in the data source mixin.

## Ids Dirty Tracker Mixin

This mixin tracks the input element text/value changes and show a dirty indicator icon (yellow triangle) to indicate the field has been modified from the starting value.

## Ids Clearable Mixin

This mixin adds a clear button (x icon) to an input element ands bind click and key events to clear the text in the input when clicked. It will trigger the `cleared` when the contents of the input element are cleared and a `contents-checked` event when the contents of input are being checked for empty.

## Ids Validation Mixin

This mixin add functionality for validation to the component. This includes a add/remove message function api.  Also triggers the `` event when evaluated and passes an `isValid` argument for the current state.

## Ids Theme Mixin

This mixin adds functionality to change the theme on a component. To use it you need to:

1. Include the IdsThemeMixin in the `mix` list.
1. Add two properties to the properties array. For example:

```js
  static get attributes() {
    return [... attributes.MODE, attributes.VERSION];
  }
```

1. Make sure if you use connectedCallback that you have a `super.connectedCallback()` in the method
1. Add types for MODE and VERSION to the `d.ts` file for the new properties.
1. Add the theme mixin name to the @mixes tag for future docs.
1. Add the color changes for each theme scss file. For example:

```css
.ids-container[mode='light'] {
  @include bg-white();
}

.ids-container[mode='dark'] {
  @include bg-slate-90();
}

.ids-container[mode='contrast'] {
  @include bg-slate-10();
}

.ids-container[version='classic'][mode='light'] {
  @include bg-graphite-10();
}

.ids-container[version='classic'][mode='dark'] {
  @include bg-classic-slate-80();
}

.ids-container[version='classic'][mode='contrast'] {
  @include bg-graphite-20();
}
```

1. In addition you should expose some of the component elements as `parts` do this in the comments and in the template. This gives a way to customize the styles outside of the web components, for flexibility and possible style customizations.

```js
 /**
 * @part tag - the tag element
 * @part icon - the icon element
 */

 // Later...
 template() {
   return '<span class="ids-tag" part="tag"><slot></slot></span>';
 }
```
1. Add a themeable parts section to the .MD file

## Ids Tooltip Mixin

This mixin adds functionality to display a tooltip on an item.

1. Include the import and then IdsTooltipMixin in the `mix` list.
1. Add types for MODE and VERSION to the `d.ts` file for the new properties.
1. Add IdsTooltipMixin to the @mixes list

When using it...

1. Test it by adding for example `tooltip="Additional Information"` on the component.
1. Consider adding a test to tooltip tests.
1. If `tooltip="true"` is set then
