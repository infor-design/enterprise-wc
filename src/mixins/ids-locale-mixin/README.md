# Ids Locale Mixin

This mixin adds a shared locale API into the component.

1. Include the import and then IdsLocaleMixin in the `mix` list.
1. Add types for LANGUAGE and LOCALE to the `d.ts` file for the new attributes.
1. Add IdsLocaleMixin to the @mixes list

When using it access the locale with `this.locale`.

1. Test it by adding for example `tooltip="Additional Information"` on the component.
1. Add tests for your locale use cases to your component tests.
1. If you need to respond and change things on language or locale change then you may need to add a combination of the following to handle events

```js
// Respond to parent changing language
this.offEvent('languagechange.component-name-container');
this.onEvent('languagechange.component-name-container', this.closest('ids-container'), async (e) => {
  await this.setLanguage(e.detail.language.name);
  // Do something with parent lang
});

// Respond to the element changing language
this.offEvent('languagechange.component-name');
this.onEvent('languagechange.component-name', this, async (e) => {
  await this.locale.setLanguage(e.detail.language.name);
 // Do something with component lang
});

// Respond to parent changing locale
this.offEvent('localechange.component-name-container');
this.onEvent('localechange.component-name-container', this.closest('ids-container'), async (e) => {
  await this.locale.setLocale(e.detail.locale.name);
  // Do something with parent locale
});

// Respond to the element changing locale
this.offEvent('localechange.component-name');
this.onEvent('localechange.component-name', this, async (e) => {
  await this.locale.setLocale(e.detail.locale.name);
 // Do something with component locale
});
```

## Ids Locale Mixin (RTL Tips)

One goal of the local mixin is to handle RTL but you don't always need it. The best approach is to try and make your css work either direction before resorting to resets. One useful technique is to use css grid / flex with `end` or `flex-end`. This automatically works in RTL mode without trying to negate a anything.

```scss
// On Parent
display: grid;
grid-auto-flow: column;
// On Child
justify-self: end;
```

```scss
display: flex;
flex-direction: row;
justify-content: flex-end;
```

If needed and it cannot be done with css. Then add the Ids Locale mixin as described above and then add css rules like:

```scss
.ids-component-name[dir='rtl'] {
  // Reversals
  border-left-style: solid;
  border-left-style: hidden;
}
```
