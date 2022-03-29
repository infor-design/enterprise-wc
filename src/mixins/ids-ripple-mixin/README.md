#Ids Ripple Mixin

This mixin allows a component to add a ripple effect triggered by click/touch events.
You can set the ripple's target element, otherwise it defaults to using the component's container. 
You can also set the pixelsize of the ripple effect by providing its radius, otherwise it defaults to a radius of 50.

This mixin adds one observed attribute to a component:

- `no-ripple`: if true, ripple effect will be removed along with any click/touch event handlers

To use this mixin in your component,

1. Import `IdsRippleMixin`
2. Add `IdsRippleMixin` to the mixes() section
3. Add `IdsRippleMixin` to the @mixes comment section
4. Import `ids-ripple-mixin.scss` in your component's styles
5. Make sure your attributes extend `return [...super.attributes]` in the `attributes` to allow propagation of added mixin attributes.
6. Invoke `setupRipple(rippleTarget, rippleRadius)` in your component
- `rippleTarget` (optional): {HTMLElement} element that contains ripple effect. Defaults to component's container.
- `rippleRadius` (optional): {number} half of ripple size in pixels. Defaults to 50.