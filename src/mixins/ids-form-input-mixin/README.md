# Ids Form Input Mixin

This mixin adds the capability for custom-elements that implement form input fields
to participate in a native form submission and validation process.

It also provides a centralized place to trigger the `input` and `change` events on
these custom-elements.  This is necessary Angular Reactive Forms to properly update binded values.

To implement the form-input mixin:

1. Import `IdsFormInputMixin` and add to the component-base.js
2. Add `IdsFormInputMixin` to the @mixes comment section
3. Make sure you attributes extend `return [...super.attributes` in the `attributes` property because `attributes.NAME` and `attributes.VALUE` are added.
4. Make sure the `connectedCallback` calls `super.connectedCallback();`
5. You may need to override the `formInput()` method on your custom-element's class.

```js
/**
 * @readonly
 * @returns {HTMLInputElement} the inner `input` element
 * @see IdsFormInputMixin.formInput
 */
get formInput(): HTMLInputElement | null {
  return this.container?.querySelector<HTMLInputElement>(`input`) ?? null;
}
```
