# Ids About Component

Provides information about an application / product with copyright and browser information.

The IDS About Component builds on top of the [Modal]('../ids-modal/README.md')

## Use Cases

- Display application name, product name and product version
- Display copyright information
- Display browser and device information

## Settings (Attributes)

- `product-name` {string} product name information to display
- `product-version` {string} semantic product version number
- `copyright-year` {string} the year displayed in the copyright, defaults to current year
- `use-default-copyright` {boolean} whether or not to display legal approved Infor copyright text
- `device-specs` {boolean} whether or not to display device / browser information

## Slots

- `slot="icon"` - appears at the top of the modal, centered
- `slot="appName"` - appears at the top of the modal, below icon, centered
- `slot="content"` - additional content appears below product name/version, about copyright

## Features (With Code Examples)

Example with application name, product name, product version and logo

```html
<ids-about id="about-example" product-name="Product" product-version="4.0.0">
  <ids-icon slot="icon" icon="logo" viewbox="0 0 35 34" size="xxl" /></ids-icon>
  <ids-text id="about-example-name" slot="appName" type="h1" font-size="24" font-weight="bold">Application Name</ids-text>
  <ids-text id="about-example-content" slot="content" type="p">Additional content</ids-text>
</ids-about>
```

Example with only copyright text and browser/device information

```html
<ids-about id="about-example">
</ids-about>
```

Example with custom copyright year, no application name or product information

```html
<ids-about id="about-example" copyright-year="2020">
</ids-about>
```

Example with no copyright info and no browser/device information, but with application name and product name/version

```html
<ids-about
  id="about-example"
  device-specs="false"
  use-default-copyright="false"
  product-name="Product"
  product-version="4.0.0"
>
  <ids-text id="about-example-name" slot="appName" type="h1" font-size="24" font-weight="bold">Application Name</ids-text>
</ids-about>
```

The component can be controlled with Javascript

```js
const about = document.querySelector('#about-example');

about.productVersion = 'Changed version';
about.productName = 'Changed product';
about.copyrightYear = '2020';
about.deviceSpecs = false;
about.useDefaultCopyright = false;
```

## Converting from Previous Versions (Breaking Changes)

**3.x**
- Replace `.inforAboutDialog()` with `.about()` and notice that many of the names of the settings (e.g. productName to appName) to have changed so must be updated to the new settings.

**4.x**
- About now uses all new markup and classes for web components (see above)
- Cookies and full OS information (like version) has been removed to adhere to more modern browser standards and lack of availability of these features in modern browsers.
- `version` has been renamed to `productVersion`
- `close` method has been removed use `$('ids-about').visible = false` instead
- `destroy` method has been removed its all cleaned up when removing the DOM element
- `close/open` events have been named to `show/hide`

