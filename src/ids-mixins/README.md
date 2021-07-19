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

This mixin add functionality for validation to the component. This includes a add/remove message function api.  Also triggers the `validate` event when evaluated and passes an `isValid` argument for the current state.

## Ids Theme Mixin

This mixin adds functionality to change the theme on a component. To use it you need to:

1. Include the IdsThemeMixin in the `mix` list.
1. Add two attributes to the attributes array. For example:

```js
  static get attributes() {
    return [... attributes.MODE, attributes.VERSION];
  }
```

1. Make sure if you use connectedCallback that you have a `super.connectedCallback()` in the method
1. Add types for MODE and VERSION to the `d.ts` file for the new attributes.
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

5. In addition you should expose some of the component elements as `parts` do this in the comments and in the template. This gives a way to customize the styles outside of the web components, for flexibility and possible style customizations.

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
6. Add a themeable parts section to the .MD file

## Ids Tooltip Mixin

This mixin adds functionality to display a tooltip on an item.

1. Include the import and then IdsTooltipMixin in the `mix` list.
1. Add types for MODE and VERSION to the `d.ts` file for the new attributes.
1. Add IdsTooltipMixin to the @mixes list

When using it...

1. Test it by adding for example `tooltip="Additional Information"` on the component.
1. Consider adding a test to tooltip tests.
1. If `tooltip="true"` is set then

## Ids Attribute Provider Mixin

This mixin allows a parent component to automatically copy/provide attributes down in its tree (either light or shadowDom) to any custom sub elements
using single directional data flow. When an attribute observed in the parent changes that is listed in the `providedAttributes` array,
any changes become mirrored in the children types specified for those specific attributes.

1. Include the import and then IdsAttributeProviderMixin in the `mix` list.
1. In the `providedAttributes` of the parent which will provide attributes to children in it's tree, add a `providedAttributes` getter which an object mapping with the key being the attribute to map, and the value being an array where each entry is a list of components or a mapping of components and their property names e.g.
```js
get providedAttributes() {
  return {
    [attributes.PAGE_SIZE]: [IdsPagerInput, IdsPagerNumberList],
      [attributes.DISABLED]: [
        [IdsPagerInput, attributes.PARENT_DISABLED],
        [IdsPagerButton, attributes.PARENT_DISABLED]
      ]
  };
}
```
3. be sure that in the child components, setters/getters exist for the target attributes. So in the above example, `IdsPagerInput` and `IdsPagerNumberList` should have `set`/`get` `pageSize`, `parentDisabled`.
1. similar to above, be sure to include the target attributes in children components that receive the property updates from the parent in the `static attributes` variable of the child components.

## Ids Locale Mixin

This mixin adds a shared locale API into the component.

1. Include the import and then IdsLocaleMixin in the `mix` list.
1. Add types for LANGUAGE and LOCALE to the `d.ts` file for the new attributes.
1. Add IdsLocaleMixin to the @mixes list

When using it access the locale with `this.locale`.

1. Test it by adding for example `tooltip="Additional Information"` on the component.
1. Add tests for your locale use cases to your component tests.
1. If you need to respond and change things on language or locale change then you may need to add a combination of the following to handle events

```js
// Respond to parent changing language
this.offEvent('languagechange.container');
this.onEvent('languagechange.container', this.closest('ids-container'), async (e) => {
  await this.setLanguage(e.detail.language.name);
  // Do something with parent lang
});

// Respond to the element changing language
this.offEvent('languagechange.this');
this.onEvent('languagechange.this', this, async (e) => {
  await this.locale.setLanguage(e.detail.language.name);
 // Do something with component lang
});

// Respond to parent changing language
this.offEvent('localechange.container');
this.onEvent('localechange.container', this.closest('ids-container'), async (e) => {
  await this.locale.setLocale(e.detail.locale.name);
  // Do something with parent locale
});

// Respond to the element changing language
this.offEvent('localechange.this');
this.onEvent('localechange.this', this, async (e) => {
  await this.locale.setLocale(e.detail.locale.name);
 // Do something with component locale
});
```

### Ids Locale Mixin (RTL Tips)

One goal of the local mixin is to handler RTL but you don't always need it. The best approach is to try and make your css work either direction before resorting to resets. One useful technique is to use css grid / flex with `end` or `flex-end`. This automatically works in RTL mode without trying to negate a anything.

```scss
// On Parent
display: grid;
grid-auto-flow: column;
// On Child
justify-self: end;
```

```scss
display: flex;
flex-direction: row;
justify-content: flex-end;
```
