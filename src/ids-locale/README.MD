# Ids Locale API

## Description

The locale API handles many aspects and i18n use cases including: dates, numbers, calendars (like arabic and gregorian) and, translation and right to left. The Locale component is used in many other components to handle various localization and i18n use cases. The locale API will be available on the `ids-container` as the root element to set the locale or language. And also on any component that needs the locale information so they can be set separate.

The Locale API handles the following functionality

- formatting numbers for a locale
- parsing numbers for a locale
- formatting dates for a locale
- parsing dates for a locale
- right to left support
- translations

## Use Cases

- Use you need to translate text
- When you need to format numbers and dates for a particular locale
- When you need to calculate umalqura calendar dates

## Terminology

- **Umm al-Qura**: A type of calendar used the Arabian Peninsula that centers around the moon
- **Translation**: The process of translating words or text from one language into another
- **Format**: Formatting numbers or dates into a locale format
- **Parse**: Parsing a formatted number bug into either a JS date or number

## Initialization

You can set the locale or language on the root container. If you do this then all elements in the container will get that locale or language. You can optionally set the language to something else so that the locale and language can be separate.

```js
await document.querySelector('ids-container').setLocale('de-DE');
// Do something with it
```

It is possible to use the translation strings in another language, independently of the locale settings for date and numbers ect. to do this just call the `setLanguage` api function. As with the `setLocale` function with both functions they run async so you can use the `await` keyword to use them if you need the information right away.

```javascript
await document.querySelector('ids-container').setLocale('de-DE');
await document.querySelector('ids-container').setLanguage('da');
document.querySelector('ids-container').locale.translate('Actions'); // Returns 'Handlinger'
```

## Features (Translation)

You can use a feature on ids-text to translate text. This example will take the text and use it as a key to lookup the translation and present it. If the language is changed on the container or component the text will be updated on the fly.

```html
<ids-text font-size="16" translate-text="true" language="de">BrowserLanguage</ids-text>
```

It is possible to add your own strings to an existing locale's language. To do this just set the locale or language to the desired language and then when the locale is loaded call `extendTranslations` with a new set of strings. A string is an object with minimum an id and value of the string.

```js
const container = document.querySelector('ids-container');
await container.setLocale('it-lT');
const myStrings = {
    Thanks: { id: 'Thanks', value: 'Grazie', comment: '' },
    YourWelcome: { id: 'YourWelcome', value: 'Prego', comment: '' }
};

container.locale.extendTranslations(Locale.currentLanguage.name, myStrings);
container.locale.translate('Thanks');      // Returns Grazie
container.locale.translate('YourWelcome'); // Returns Prego
```

TODO: https://raw.githubusercontent.com/infor-design/enterprise/main/src/components/locale/readme.md

## API Methods

- `translate` {string} returns {string} Takes a string as a key and returns the translated value in the strings if found. If not found it returns the value in either the english locale or in [SquareBrackets] if not found

## Number Format Patterns

The formatNumber function accepts a numberFormat object with formatting information. For example:

```js
container.locale.numberFormat(number, {minimumFractionDigits: 3, maximumFractionDigits: 3});
```

The following options are supported:

- `style` - Can be `decimal` or `percent` or `currency`. Formats the number with the group, decimal or adds the current currency symbol in the right location.
- `minimumFractionDigits` - An integer representing the min number of decimal values before adding zero's for padding. A number from 0 to 20 (default is 3)
- `maximumFractionDigits` - An integer representing the max number of decimal values before rounding / truncation, A number from 0 to 20 (default is 3)
- `minimumSignificantDigits` - An integer representing the maximum number of significant digits.  A number from 0 to 20 (default is 3)
- `maximumSignificantDigits` - An integer representing the maximum number of significant digits. A number from 0 to 21 (default is 21)
- `minimumIntegerDigits` - An integer representing the maximum number of integer digits.  A number from 1 to 21 (default is 1)
- `maximumIntegerDigits` - An integer representing the maximum number of integer digits. A number from 1 to 21 (default is 21)
- `currency` - Legal values: any currency code (like 'EUR', 'USD', 'INR', etc.)
- `currencyDisplay` - Legal values: 'symbol' (default) 'code' 'name'
- `currencySign` - You can specify a specific sign to use for currency, otherwise it uses the default one for the current locale.
- `decimal` - You can specify a specific character to use for the decimal point, otherwise it uses the default one for the current locale.
- `useGrouping` - If true the grouping character can be used
- `currencyFormat` - You can specify a currencyFormat to use, otherwise it uses the current one for the locale. The ¤ is where the currencySign will go. ### is used for the number replacement.
- `groupSize` - You can specify where the thousands group separators will be placed. For example `[3, 0]` means that only the first group will have a separator: 1234,567. `[3, 2]` means the first group will have 3 digits and the other groups will all have 2, for example 12,34,567. The default for many locales is `[3, 3]
- `localeMatcher` - Can be `best-fit` or `lookup`

Deprecated options from 4.x

- `round` - Considered no longer needed as toLocaleString will round all the time depending on FractionDigits
- `group` - Will map to true/false on `useGrouping` now and use the passed in locale

## Converting from Previous Versions

- 3.x: Used the older Globalize open source utilities
- 4.x: Has an entire new Locale API
- 5.x: Is mostly compatible with 4.x except for:
  - The `set` api is now called `setLocale`
  - The `formatNumber` method now use `toLocaleString` internally which has some minor differences
  - The rounding and truncation behavior has slightly changed

## Regional Considerations

Labels should be localized in the current language. Direction icons will flip in Right To Left mode. Consider that in some languages text may be a lot longer (German). And in some cases it cant be wrapped (Thai).
