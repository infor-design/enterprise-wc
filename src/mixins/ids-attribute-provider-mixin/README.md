# Ids Attribute Provider Mixin

This mixin allows a parent component to automatically copy/provide attributes down in its tree (either light or shadowDom) to any custom sub elements
using single directional data flow. When an attribute observed in the parent changes that is listed in the `providedAttributes` array,
any changes become mirrored in the children types specified for those specific attributes.

1. Include the import and then IdsAttributeProviderMixin in the `mix` list.
1. In the `providedAttributes` of the parent which will provide attributes to children in it's tree, add a `providedAttributes` getter which an object mapping with the key being the attribute to map, and the value being:
  - an array of components or a mapping-of components and their property names (for example `PAGE_SIZE` below)
  - an array of `[IDSComponent, attributeName]` (for example, `DISABLED` below)
  - an array of object mappings e.g. `{ component, targetAttribute (optional), valueXformer (optional) }` with (1) `targetAttribute` being the attribute to map to the child, (2) component being an IDSComponent class (not instance) and (3/optional) a `valueXformer` where we transform the attribute before applying it.
```js
get providedAttributes() {
  return {
    [attributes.PAGE_SIZE]: [IdsPagerInput, IdsPagerNumberList],
    [attributes.DISABLED]: [
      [IdsPagerInput, attributes.PARENT_DISABLED],
      [IdsPagerButton, attributes.PARENT_DISABLED]
    ],
    [attributes.AXIS]: [{
      component: IdsDraggable,
      valueXformer: (axis) => (
        ((axis === 'x') || (axis === 'y')) ? axis : 'x'
      )
    }]
  };
}
```
3. be sure that in the child components, setters/getters exist for the target attributes. So in the above example, `IdsPagerInput` and `IdsPagerNumberList` should have `set`/`get` `pageSize`, `parentDisabled`, and `axis`.
1. similar to above, be sure to include the target attributes in children components that receive the property updates from the parent in the `static attributes` variable of the child components.
