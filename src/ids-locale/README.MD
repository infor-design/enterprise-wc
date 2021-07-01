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

## Whats new in this version

- Solved the problems making some functions async so that you don't need to wait for the locale to load.
- Used Intl.DateTimeFormat and this adds many features like additional calendars
- Uses standard browser Apis due to dropping IE 11

## Use Cases

- Use you need to translate text
- When you need to format numbers and dates for a particular locale
- When you need to calculate umalqura calendar dates
- When you need to format hours

## Terminology

- **Umm al-Qura**: A type of calendar used the Arabian Peninsula that centers around the moon
- **Translation**: The process of translating words or text from one language into another
- **Format**: Formatting numbers or dates into a locale format
- **Parse**: Parsing a formatted number bug into either a JS date or number

## Initialization

You can set the locale or language on the root container. If you do this then all elements in the container will get that locale or language. It is possible to use the translation strings in another language, independently of the locale settings for date and numbers ect. to do this just call the `setLanguage` api function.

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

## Currently Supported Locales

For a list of all the supported locales and languages see the <a href="https://github.com/infor-design/enterprise-wc/tree/main/src/ids-locale/cultures" target="_blank">component source locale folder.</a>.

## Translation Features

You can use a feature on ids-text to translate text. This example will take the text and use it as a key to lookup the translation and present it. If the language is changed on the container or component the text will be updated on the fly. If coming from 4.x note that the translate API and in general no longer require a cultures folder as the data is contained in the npm package.

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

### Translation API

- `translate` {string, options} returns {string} Takes a string as a key and returns the translated value in the strings if found. If not found it returns the value in either the english locale or in [SquareBrackets] if not found. Options can be used to find a string in another language for example `{ language: 'de' }` not that you need to load the language first with setLanguage or setLocale or english is returned.

#### Converting from Previous Versions (Translation)

If coming from 4.x versions we made some changes:

- Options can no longer be true or false, instead pass `{ showAsUndefined: true/false }`

## Number Formatting Features

You can use the formatNumber to display a numeric type in a localized format. You can use parseNumber to convert that number back to the numeric type.

The formatNumber function accepts a numberFormat object with formatting information. The options it uses now use the [Number.toLocaleString API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString) so this can be referred to for details.

For example:

```js
container.locale.numberFormat(number, {minimumFractionDigits: 3, maximumFractionDigits: 3});
```

```javascript
container.locale.formatNumber(20.1, { minimumFractionDigits: 2 }));
// Returns 20.10
container.locale.formatNumber(5.1, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
// Returns 5.10
container.locale.locale.formatNumber(12345.12, {
  style: 'currency',
  currency: 'USD'
});
// Returns $ 12,345.12
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
- `groupSize` - You can specify where the thousands group separators will be placed. For example `[3, 0]` means that only the first group will have a separator: 1234,567. `[3, 2]` means the first group will have 3 digits and the other groups will all have 2, for example 12,34,567. The default for many locales is `[3, 3]`
- `locale` - If the locale has previously been loaded with `setLocale()` you can pass a locale to parse dates out of the current locale.

If you have a formatted number you can convert it back to a number object with the opposite function parseNumber. This function takes no additional arguments but it may need to make assumptions based on locale settings in the current locale.

```javascript
container.locale.parseNumber('$12,345.13');
// Returns 12345.13
container.locale.parseNumber('1,234,567,890.12346');
// Returns 1234567890.12346
```

To convert from a Chinese/Arabic/Hindi number we added a function to convert the numbers to english numbers.

```javascript
locale.convertNumberToEnglish('١٢٣٤٥٦٧٨٩٠');        // Arabic to 1234567890
locale.convertNumberToEnglish('壹貳叄肆伍陸柒捌玖零'); // Chinese Financial to 1234567890
locale.convertNumberToEnglish('一二三四五六七八九零'); // Chinese Simplified to 1234567890
locale.convertNumberToEnglish('१२३४५६७८९०');         // Devangari to 1234567890
```

### Converting from Previous Versions (Number Formatting)

The following options are deprecated options from 4.x

- `round` - Considered no longer needed as toLocaleString will round all the time depending on FractionDigits
- `group` - Will map to true/false on `useGrouping` now and use the passed in locale
- `currencySign` - Is deprecated as an option use `currency` and `currencyCode`
- `decimal` - Is deprecated as an option  but this is handled by `Number.toLocaleString` directly
- `currencyFormat` - Is deprecated as an option use `currency` and `currencyCode`
- `groupSize` - Is deprecated as an option but this is handled by `Number.toLocaleString` directly

## Date Formatting Features

It is possible to use `formatDate` display dates in the current or a specified locale. To do this just call the `getLocale` api function to ensure the data is loaded.

```javascript
locale.formatDate(new Date(2019, 5, 8), { dateStyle: 'short', locale: 'nl-NL' }));
// 08-06-2019

locale.formatDate(new Date(2019, 5, 8), { dateStyle: 'long', locale: 'es-ES' });
// 8 de junio de 2019
```

### Date Formatting API

The formatDate function accepts a date object and formatting options including an optional locale. Underneath we use [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#parameters) so all these options can be used. Use the online docs as reference but some of the more common options are listed here.

- `calendar` - Can use this to get islamic dates and other calendars.
- `dateStyle` - The date formatting style to use. Possible values are: `full`, `long`, `medium` and `short`
- `year` - The representation of the year. Possible values are:
   `numeric` (e.g., 2012)
   `2-digit` (e.g., 12)
- `month` - The representation of the month. Possible values are:
  `numeric` (e.g., 2)
  `2-digit` (e.g., 02)
  `long` (e.g., March)
  `short` (e.g., Mar)
  `narrow` (e.g., M). Two months may have the same narrow style for some locales (e.g. May's narrow style is also M).
- `day` - The representation of the day. Possible values are:
  `numeric` (e.g., 2)
  `2-digit` (e.g., 02)

#### Converting from Previous Versions (formatDate)

If coming from 4.x versions we mapped some rules out for converting to the new version

- `pattern/dateFormat` - You must now use the [Intl.DateTimeFormat Options](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#parameters)
- `fromGregorian` - `Intl.DateTimeFormat` directly supports islamic
- `date` - This is now `dateStyle` as per the Intl Api and not that short is two digits year and no padding and medium is four digit year.
- If passing the `style: 'integer'` option, this should now be `{ minimumFractionDigits: 0, maximumFractionDigits: 0 }`
- For `{ pattern: month }` format you would now use `{ month: 'long', day: 'numeric' }`
- For arabic digits now show in Arabic/Persian as is the browser default
- For `{ date: 'datetime' }` you would now use `{ dateStyle: 'short', timeStyle: 'short' }`
- For `{ date: 'year' }` you would now use `{ month: 'long', year: 'numeric' }`
- For `{ date: 'month' }` you would now use `{ month: 'long', day: 'numeric' }`
- For `{ date: 'medium' }` you would now use `{ month: 'long', day: 'numeric', year: 'numeric' }`
- For `{ date: 'short' }` you might want to just take this off and use the default or you will get two digit years
- For `{ date: 'timestamp' }` you would now use `{ timeStyle: 'medium' }`
- For `{ date: 'hour' }` you would now use `{ timeStyle: 'short' }`
- For `{ date: 'timezone' }` you would now use `{ year: 'numeric', day: 'numeric', month: 'numeric', hour: 'numeric', minute: 'numeric', timeZoneName: 'short' }`
- For `{ date: 'timezoneLong' }` you would now use `{ year: 'numeric', day: 'numeric', month: 'numeric', hour: 'numeric', minute: 'numeric', timeZoneName: 'long' }`
- For a specific pattern such as `d MMM yyyy HH:mm` you would now use you would now use `{ day: 'numeric', month: 'medium', year: 'numeric', hour: 'numeric', minute: 'numeric' }`

### Date Parsing

If you have a formatted date you can convert it back to a date object with the opposite function parseDate. This function needs to know the format being used or it will parse it to the current short date format

We support a limited date parser that requires information about what the source string format is. It can currently only handle certain dates. [The reasons for this are many](https://blog.sffc.xyz/post/190943794505/why-you-should-not-parse-localized-strings). If you need more a better approach might be to keep the date a reference and only format it for display.

```javascript
locale.parseDate('2020-02-26 下午12:00', { dateFormat: 'yyyy/M/d ah:mm' });
// 08-06-2019
```

When parsing dates you either need to be in the same locale or pass the `dateFormat` being used in the string in.

```javascript
locale.setLocale('zh-TW');
locale.parseDate('2020-02-26 下午12:00', { dateFormat: 'yyyy/M/d ah:mm' });
// 08-06-2019

// Or
locale.setLocale('zh-TW');
locale.setLocale('en-US');
locale.parseDate('2020-02-26 下午12:00', { dateFormat: 'yyyy/M/d ah:mm', locale: 'zh-TW'});
// 08-06-2019
```

#### Converting from Previous Versions (parseDate)

- Parsing strings with long dates such as `Noviembre de 2018` is not supported
- If using `pattern` you should now use `dateFormat`.

## Other API Utilities

- `isIslamic(locale)` - Returns true if the current or provided locale uses the islamic calendar as the primary calendar
- `isTRL(locale)` - Returns true if the current or provided locale is a right-to-left language

## Converting from Previous Versions (Overview)

- 3.x: Used the older Globalize open source utilities
- 4.x: Has an entire new Locale API
- 5.x: Has numerous breaking changes
  - The `set` api is now called `setLocale`. The `setLanguage` is still called `setLanguage`
  - The translate API and in general no longer require a cultures folder as this is contained in the npm package.
  - `toLocaleString` Is deprecated as function as now `formatNumber` uses it
  - The `formatNumber` function now uses `toLocaleString` internally which has some minor differences. As a result the the rounding and truncation behavior has slightly changed and some other details are listed in the formatDate section.
  - The `formatDate` function now uses [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) internally which has some minor differences. This was done to reduce the number of locale bugs and code.
  - The `getLocale` function is not needed since we can use await now so was removed
  - We did not include the culturesPath as its not needed since the locales are contained with the locale code
  - ShowAsUndefined option is deprecated, now undefined locales will all be shown in square brackets
  - Round option on formatNumber is deprecated
  - Options on formatNumber now use toLocaleString options (which are similar)
  - `parseDate` is now much more limited and cannot parse long formats
  - Its technically not possible to provide a new translation file as the files are in the npm folder. So if you want to add a new translation or locale lets us know and we will add it. You might have to sync the translations.

## Regional Considerations

Labels should be localized in the current language. Direction icons will flip in Right To Left mode.
