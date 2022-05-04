# Ids RenderLoop

The IDS RenderLoop is a utility component that provides a single [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/data/window/requestAnimationFrame) instance to other components that may need to run asynchronous operations. The loop instance is made available to these components by way of a mixin.

The IDS RenderLoop exists to provide an alternative, performance-friendly way to run code that would otherwise require the use of `setTimeout/setInterval` or multiple `requestAnimationFrame` loops.  When creating/using IDS components, using the RenderLoop for these purposes is preferable.

## Use Cases

- Running code after a specified duration.  For example, if we need to run a `render()` method on a component in 100ms.
- Running code every (x) durations.  For example, updating a counter by 1 every 5 seconds.
- Running multiple async operations all at once (for example, several Toast messages updating/dismissing at different timeout intervals).

## Terminology

*RenderLoop:* The main queuing system that wraps `requestAnimationFrame`.

*RenderLoopItem:* Describes an object that lives inside the RenderLoop's `items` array that is configured to trigger callback methods at certain intervals, at the end of its lifespan, or both.

*Tick:* identifies the timing on which the RenderLoop cycles through its `items` array and runs Updates or Timeouts on each, if necessary.

*Timeout:* The end of a RenderLoop Item's lifecycle.  In some cases, a `timeoutCallback` method may occur.

*Update:* A specified time in which a callback representing an update is fired (by default, this occurs on every tick if an `updateCallback` is defined).

## Features (With Code Samples)

Before using, import the global renderloop instance and the RenderLoop Item:

```js
import { renderLoop, IdsRenderLoopItem } from '../ids-render-loop';
```

### RenderLoop Items with a Timeout

To run an asynchronous operation using the RenderLoop, you must build and register an `IdsRenderLoopItem` object.

Creating an item that will timeout after 100ms and switch the contents of a text span could look like this:

```js
const textSpan = document.querySelector('span.my-span');
textSpan.textContent = 'Hello!';

const item = new IdsRenderLoopItem({
  id: 'test-loop-item',
  duration: 100,
  timeoutCallback: () => {
    textSpan.textContent = 'Goodbye!';
  }
});
```

The RenderLoop Item won't execute until it's registered with the loop.  We can use the global RenderLoop instance's `register()` method to pass it on:

```js
const myComponent = document.querySelector('my-component');
renderLoop.register(item);
```

After 100ms passes, the text content of our `span` tag will change!

### RenderLoop Items with an Update Duration

We might also want to build a RenderLoop Item that doesn't timeout on its own, and updates the text content of our
text span every 2 seconds.  To perform this, we can utilize the `updateCallback` and `updateDuration` properties:

```js
const myComponent = document.querySelector('my-component');
const textSpan = document.querySelector('span.my-span');
textSpan.textContent = '0';

let counter = 0;
const item = new IdsRenderLoopItem({
  id: 'test-loop-item-2',
  updateDuration: 2000, // ms
  updateCallback: () => {
    counter++;
    textSpan.textContent = `${counter}`;
  }
});
renderLoop.register(item);
```

The above example doesn't specify a duration.  The default duration (`-1`) causes the RenderLoop item to remain in the queue indefinitely until it's cleared.  This can be done by removing the RenderLoop item from the `items` array in various ways:

```js
// Remove using the Loop API:
renderLoop.remove(item);

// ... OR destroy the item directly
item.destroy();
```

### RenderLoop Items that do everything

RenderLoop Items can be configured to both Update AND Timeout.  The modified version of our updating item also has a `timeoutCallback`:

```js
const myComponent = document.querySelector('my-component');
const textSpan = document.querySelector('span.my-span');
textSpan.textContent = '0';

let counter = 0;
const item = new IdsRenderLoopItem({
  id: 'test-loop-item-3',
  timeoutCallback: () => {
    textSpan.textContent = `DONE! Final Count was ${counter}`;
  },
  updateDuration: 2000, // ms
  updateCallback: () => {
    counter++;
    textSpan.textContent = `${counter}`;
  }
});
renderLoop.register(item);
```

When removing the item from the queue as shown above, the `updateCallback` will cease firing, and the `timeoutCallback` will fire.

In some cases, it may be desirable to destroy the RenderLoop item without firing the `timeoutCallback`.  For this case it's possible to veto the `timeoutCallback`:

```js
// Destroy the item directly and prevent a timeout callback
item.destroy(true);
```

## States and Variations

The RenderLoop itself has two opposite states:

- Stopped
- Started

Each individual RenderLoop Item has two opposite states:

- Paused
- Resumed

## Converting from Previous Versions (Breaking Changes)

**3.x to 4.x**

- RenderLoop was a new API in v4.x

**4.x to 5.x**

- The RenderLoop API is now exposed for public use
