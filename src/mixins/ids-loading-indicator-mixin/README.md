# Ids Loading Indicator Mixin

Adds loading indicator to a component either via slot (custom) or via component attribute (`ids-loading-indicator` component).

This mixin adds the following attributes to a component:

- `show-loading-indicator` {boolean}: Whether or not to show loading indicator. Defaults to false.
- `loading-indicator-only` {boolean}: Applies for `ids-button` component, the loading indicator replaces button text/icons. Defaults to false.

To use this mixin in your component:

1. Import `IdsLoadingIndicatorMixin` and add to the component base.ts file
2. Add `IdsLoadingIndicatorMixin` to the @mixes comment section
3. Add `<slot name="loading-indicator"></slot>` to a place where the loading indicator should appear

## Examples
Show with attribute

```html
<ids-button type="primary" show-loading-indicator="true">
  <span>Button</span>
</ids-button>
```

```html
<ids-button type="primary" show-loading-indicator="true" loading-indicator-only="true">
  <span>Button</span>
</ids-button>
```

Show custom loading indicator with slot

```html
<ids-button type="primary" show-loading-indicator="true">
  <span>Button</span>
  <ids-alert slot="loading-indicator" icon="in-progress"></ids-alert>
</ids-button>
```
