# Ids Breakpoint Mixin

This mixin injects `respond-up` and `respond-down` attributes into a component.  These attributes are used to enable callbacks that are triggered by the mixin's internal listners attached to the [Window's `matchMedia()` interface](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia).

The value of these attributes are strings representing our pre-defined Breakpoints: `xxl | xl | lg | md | sm | xs`

Additionally, a component that uses IdsBreakpointMixin should also have its callback functions defined.  For example, a component implementing `respond-down` should have both this attribute and its accompanying `onBreakpointDownResponse()` callback defined.  The callback is fired as soon as the defined "down" breakpoint is bypassed.
