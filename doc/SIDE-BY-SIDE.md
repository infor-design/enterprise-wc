# Running Components Side by Side

While migrating from the 4.x components to the new web components you may want to run the old and then new components side by side. This document outlines some of the solutions in doing so you can use.

## Themes

The side by side examples now show the `ids-theme-switcher` using it you can change both themes in the new and old components at the same time. In our examples we server Enterprise components from a CDN. For purposes of the examples its better to make sure the links are cached by loading them before loading the page.

```js
document.querySelector('ids-theme-switcher').theme = 'default-dark';
```

## Locale

We will make a change soon but for now the `<ids-container>` is the object that holds the locale. You can change RTL with it and the enterprise components will generally work. But for most cases you want to set both.

```js
// Set 4.x Locale
Soho.Locale.set('de-DE');
// Set WC Locale
document.querySelector('ids-container').locale = 'de-DE';
```

## Personalization

For the 4.x components set the personalization via the jQuery API but the new components are more simple. We may in the future make changes to this because the css variables are rather new.

```js
$('html')
.personalize({
  colors: '#8000'
});
```

For the new components you set them by including a css style sheet with updated css variables and then set all the primary sub colors.

```css
:root, :host {
  --ids-color-primary: #25AF65;
  --ids-color-primary-10: #25af651a;
  --ids-color-primary-20: #25af654d;
  --ids-color-primary-30: #25af658c;
  --ids-color-primary-40: #25af6573;
  --ids-color-primary-50: #25af65b3;
  --ids-color-primary-60: #25AF65;
  --ids-color-primary-70: #119b51;
  --ids-color-primary-80: #079147;
  --ids-color-primary-90: #0873d;
  --ids-color-primary-100: #0782d;
}
```

We do include an API to generate some of these colors [see here for an example](https://github.com/infor-design/enterprise-wc/blob/main/src/components/ids-theme-switcher/demos/theme-builder-minimal.ts#L20-L45)
