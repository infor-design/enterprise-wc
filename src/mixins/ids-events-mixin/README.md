# Ids Events Mixin

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
console.info(this.handledEvents());
// both `click` and `click.doop` exist.

this.offEvent(('click.doop', closeIcon);
console.info(this.handledEvents());
// `click.doop` is not there, but `click` remains.
```

The events mixin also lets you use a few convenient "custom events" for common interactions. We currently have the following events:

- `hoverend` Fires when the user hovers the target and stops. This is to ensure they actually hovered the element and didn't just accidentally pass the mouse over it.
- `sloped-mouseleave` Fires after a native `mouseleave` event, followed by a specified delay.  After the delay, the event only fires if mouse movement has occurred and places the cursor a specified distance away from its original point.  The `event.detail.mouseLeaveNode` returned represents the element located at the new coordinates.
- `swipe` Fires when a user swipes left or right on a scrollable element. The direction can be seen in `event.detail`
- `longpress` Fires when the user presses and olds on a touch device.
- `keydown` Fires when the user presses a sequence of keys and stops typing
