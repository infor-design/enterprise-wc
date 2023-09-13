# Ids Global API

## Description

The Global API exposes a few objects that can be used global and will be added to in the future. The Global API handles or will handle in the future the following:

- locale api singleton
- personalization api singleton
- theme api singleton
- anything else shared globally

Any objects that are a singleton must return the same instance so have a `getInstanceName` method. For example

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

## Converting from Previous Versions (Breaking Changes)

**4.x to 5.x**

- `Soho.Locale` is now `IdsGlobal.locale` but you can also import it and use it as above
