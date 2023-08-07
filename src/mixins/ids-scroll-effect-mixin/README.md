# Ids Scroll Effect Mixin

This mixin adds a small shadow to scroll areas when the area beings scrolled is scroll down past zero. See widget and listview examples. To implement the scroll effect mixin:

1. Import `IdsScrollEffectMixin` and add to the component-base.js
1. Add `IdsScrollEffectMixin` to the @mixes comment section
1. Make sure the `connectedCallback` calls `super.connectedCallback();`
1. Assign an element that has `overflow: auto` on it in the shadow root or otherwise and call `attachScrollEvents`

```js
this.scrollArea = this.shadowRoot?.querySelector('.ids-list-view');
this.attachScrollEvents();
```

1. You may also need to call `this.removeScrollEvents();`
