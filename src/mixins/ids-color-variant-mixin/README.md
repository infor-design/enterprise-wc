# Ids Color Variant Mixin

This mixin injects an `color-variant` property into a component that can be used as a way to provide alternate styles to that component that may work better against contrasting background colors.  For example, in an application using Light Mode, an [IdsContainer Component](../ids-container/README.md) can be set to `alternate`, switching its background color to a dark Slate, and the foreground text color to white.  The white is propagated to children components such as [IdsIcon](../ids-icon/README.md) and [IdsText](../ids-text/README.md).

The style change is achieved by maintaining an array of alternate color variants on your component, as well as adding a `.color-variant-{name}` CSS property onto whichever element is picked up by [IdsElement](../ids-base/README.md)'s `container` property when the `color-variant` property is present.

Additionally, this mixin will try to run an optional `onColorVariantRefresh` callback whenever the color-variant property is updated.  This can contain custom ways to modify a component when `color-variant` is added or removed.

The usage of this mixin would be:

1. Import the mixin and add it to the `mix` list
1. Manually add the `color-variant` property to your example, or have your component set this property automatically.
1. Add a property to your component called `colorVariants` that provides an array of strings containing names of color variants other than the default (In JS, the default variant is `null`).
1. In your `.scss` code, apply styles intended for your variant to a `.color-variant-{name}` CSS class.  A simple implementation of style scaffolding may look like this:

```scss
.my-component-container {
  // base styles
  &.color-variant-alternate {
    // styles for the "alternate" color variant
  }
}
```

To see a more complex version of how color variants could be implemented, see the [SCSS source code for Ids Button](../ids-button/ids-button.scss) and search for `color-variant`.
