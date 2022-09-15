# Ids Timer Utils

These utilities provide performance-friendly alternatives to `setTimeout` and `setInterval` timing functions.  Their purpose is to execute callbacks after arbitrary amounts of time in miliseconds, either once (similar to `setTimeout`) or re-occuring (similar to `setInterval`).

`requestAnimationTimeout` and `requestAnimationInterval` behave similarly to the built-in browser APIs.  A `FrameRequestLoopHandler` object is returned, which wraps a number value representing a `timeoutId`.  In the event `requestAnimationFrame` isn't available in the browser, these utils will fall back to `setTimeout` and `setInterval` respectively.

`cssTransitionTimeout` is another timeout method that uses a CSS transition and waits for events.  A duration can be passed to set the `transition-duration` property of an hidden, animated element.  When the transition completes, the specified callback is run.

Note that these utils should be used sparingly, and extra care should be taken to use async/await, CSS animations, or other alternatives to arbitrary timeouts where possible.

## Code Examples

### `cssTransitionTimeout`

```ts
import { cssTransitionTimeout } from 'ids-enterprise-wc/utils/ids-timer-utils/ids-timer-utils';

await cssTransitionTimeout(200);
// Do something after 200ms
```

### `requestAnimationTimeout`

```ts
import { requestAnimationTimeout, clearAnimationTimeout } from 'ids-enterprise-wc/utils/ids-timer-utils/ids-timer-utils';
import type { FrameRequestLoopHandler } from 'ids-enterprise-wc/utils/ids-timer-utils/ids-timer-utils';

const el = document.createElement('div');
document.body.appendChild(el);

const timeout: FrameRequestLoopHandler = requestAnimationTimeout(() => el.classList.add('100-ms-old'), 100);
```

After 100ms passes, the timeout function completes and changes the element's classList.

It's also possible to prematurely cancel this behavior:

```ts
clearAnimationTimeout(timeout);
```

### `requestAnimationInterval`

```ts
import { requestAnimationInterval, clearAnimationInterval } from 'ids-enterprise-wc/utils/ids-timer-utils/ids-timer-utils';
import type { FrameRequestLoopHandler } from 'ids-enterprise-wc/utils/ids-timer-utils/ids-timer-utils';

const el = document.createElement('div');
document.body.appendChild(el);

let count = 0;
const interval: FrameRequestLoopHandler = requestAnimationInterval(() => {
    count += 1;
}, 100);
```

After every 100ms, the counter increases by one.

It's also possible to prematurely cancel this behavior:

```ts
clearAnimationInterval(interval);
```
