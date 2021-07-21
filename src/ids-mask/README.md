# Ids Mask Mixin

The Mask Mixin allows for finer control of text entered into an [Ids Input Component](../ids-input/README.md), and related components.  For example, a masked input field can be configured to only allow numbers and dashes, allowing for entry of a credit card number.  The Mask Mixin is also used in components like [Ids Date Picker](../ids-date-picker/README.md) or [Ids Time Picker](../ids-time-picker/README.md) to only allow dates/times to be entered in those fields, respectively.  The contents of the input field are modified as the user types into the field, allowing for instantaneous feedback.

## Use Cases

Masked input fields are used in the following cases:

- Limiting text input to simple patterns, such as credit cards and phone numbers.
- Automatically formatting numbers, dates, and times to match the current [Locale](./locale).

## Terminology

**Literal Character** - in a mask array, the literal characters are automatically filled in by the mask as the user types characters that match the surrounding pattern.  These characters may also be keyed in by the user.  For example, in a U.S.phone number that includes an area code, literal characters may be the parenthesis `()`, or the dashes `-` between the numbers.
**Pattern Character** - in a mask array, pattern characters are represented by Regular Expressions.  When a user is typing into a masked field, if they type a character that matches a particular position's pattern character, that input will be accepted.  Otherwise, the input is thrown away.  For example, if the pattern character is `/\d/` at index 0 inside a masked input field, and the user types "0", that number will be accepted and entered in the input.  However, if the user types "A", that input will be rejected.
**Mask Function** a mask function is a Javascript function that takes two arguments (the value, and mask-specific options) that can be used to generate a mask pattern dynamically.  This is useful for input elements that mask against an indeterminate number of characters, or that need to alter the mask based on dynamic conditions. For example, the built in Date Masking function can support single or double digit Months and Days, but needs to alter the mask provided to date fields dynamically based on prior input.
**Mask Array** a mask array (or pattern) is the array of literal and pattern characters used internally by masked input fields to resolve allowed input.  The contents of this array are the limiting factor for user input.
**Mask Options** a setting on input fields that can define extra options that will be considered by a defined Mask function.

## Features (With Code Samples)

### Using Mask Arrays

Masks can be applied very simply to an Ids Input by accessing its Javascript properties for masking.  Consider the following example:

```html
<ids-input id="my-input" label="Phone Number"></ids-input>
```

Using Javascript, we can add a mask array using the following:

```js
const input = document.querySelector('my-input');
input.mask = ['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/ ];
```

Now when the user types into the field, the only input that will be accepted are numbers that fit within the contents of this array:

```js
input.value = 'x1x2x3x4x5x6x7x8x9x0x';

console.log(input.value);
// returns '(123) 456-7890
```

The contents of a mask array can be defined using any number of "literal" string characters (not replaced by masking, but will be filled in automatically), as well as regular expression-based "pattern" characters.  Regular expressions inside the mask array should be designed to match a single character.

### Using Mask Functions

In some cases Masks need to be dynamic, changing in size to fit a particular kind of input.  Mask functions are capable of analyzing the raw value passed to the Mask API before returning a mask array.  This can be useful if you need to mask a specific section of input differently for several cases.

Mask functions take two arguments -- a string containing the raw value that will eventually be masked, and an object containing whatever settings your function will need for compiling the mask array and analyzing the raw value.  Mask functions should always eventually return a Mask Array of string literals and single-character regular expressions.

A very basic example of a custom mask function would look like this:

```js
function customMaskFunction(rawValue, options) {
  let arr = [];
  // do some analysis on the raw value
  // ...
  return arr;
}
```

If a developer wished to build a mask function that always placed a suffix at the end of an indeterminately-sized number, it could be done this way:

```js
const input = document.querySelector('my-input');
input.maskOptions = {
  suffix: '%'
};
input.mask = (rawValue, opts) => {
  const totalDigits = rawValue.split('').map(() => /\d/);
  return [...totalDigits, opts.suffix];
};
```

### Built-in Mask Functions

Ids Mask comes with some built in masking functions.  These hook into other IDS components and utilities to provide localization and formatting.

For example, configuring an input field to mask as a U.S. localized short-hand date could be done this way:

```js
import { dateMask } from 'ids-enterprise-wc'

const input = document.querySelector('my-input');
input.maskOptions = {
  format: 'M/d/yyyy'
};
input.mask = dateMask;
```

As a convenience, built-in masks can also be automatically applied with shorthand string-based syntax:

```js
input.mask = 'date';
```

Another example is configuring an input field to mask a fully-formatted number, with proper localization of thousands separator, decimal, and currency symbol placement.  An example of configuring the field for a U.S. localized formatted number could be this:

```js
import { numberMask } from 'ids-enterprise-wc'

const input = document.querySelector('my-input');
input.maskOptions = {
  allowDecimal: true,
  allowNegative: true,
  decimalLimit: 2,
  integerLimit: 7,
  prefix: '$'
};
input.mask = numberMask;
```

As a convenience, the number formatter can also be applied by string:

```js
input.mask = 'number';
```

## Settings (Attributes)

- `mask` {Array<string|RegExp>|Function} the mask that is applied to the input.
- `mask-options` {object} options that will be applied to a masking function in progress.
- `mask-retain-positions` {boolean} if true, combined with guides, creates masked input that allows sections between literal characters to be removed/replaced without altering the position of the characters in other sections.
- `mask-guide` {boolean} if true, displays the complete mask as a "placeholder" in the input field once input has been entered.  Pattern characters are represented as `_` or other defined character, and literal characters are shown in-line.  This feature is only applicable to array-based pattern masks.

## Converting from Previous Versions

### Converting from 4.x

The Mask is no longer a standalone component, but applied as a mixin to all [Ids Input Components](../ids-input/README.md).  To enable a mask, all that's necessary is to define the `mask` property of an Ids Input.

What used to be defined as a `patternOptions` setting in 4.x will now be applied to the Ids Input's `maskOptions` property.  All the previous built-in mask settings have remained unchanged between 4.x and 5.x
