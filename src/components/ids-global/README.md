# ids-global

## Description

The Global API exposes a few objects that can be used global and will be added to in the future. This global object is similar in nature to the `Soho` object in the older components. The Global API handles or will handle in the future the following:

- locale api singleton
- personalization api singleton
- theme api singleton
- anything else shared globally

Any objects that are a singleton must return the same instance so have a `getInstanceName` method. For example:

```js
if (!window.IdsGlobal.locale) {
  window.IdsGlobal.locale = new IdsLocale();
}

return window.IdsGlobal.locale;
```

## Importing and using IdsGlobal

```js
import IdsGlobal from 'mode_modules/ids-enterprise-wc/components/ids-global/ids-global';

const locale = await IdsGlobal.getLocale().setLocale('it-lT');
locale.extendTranslations(localeAPI.currentLanguage.name, myStrings);
```

## Whats in IdsGlobal

- `getLocale()` {IdsLocale} A singleton instance of IdsLocale (see ids-locale from details). Allows you to get to it at a global level.
- `onThemeLoaded()` {IdsDeferred} Fires when the theme is loaded.
- `personalize` {IdsPersonalize} Access to the personalization API
- `version` {string} Displays the components version
- `themeName` {string} Allows you to get and set the current theme
- `themePath` {string} Allows you to the relative path or complete path to a where the themes folder is. This includes the themes folder itself. This must be set before any component is imported.
- `customIconData` {JSON} Allows you to store custom icon SVG for `ids-icon`.

## Example of using Theme Path

```html
<head>
  ...
  <script>
    window.IdsGlobal = { themePath: '/node_modules/ids-enterprise-wc/themes/' };
  </script>
  <script defer type="module" src="node_modules/ids-enterprise-wc/enterprise-wc.js"></script>
</head>
```

## Converting from Previous Versions (Breaking Changes)

**4.x to 5.x**

- `Soho.Locale` is now `IdsGlobal.locale` but you can also import it and use it as above
