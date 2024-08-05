# ids-button 

## Description

The ids-button is a simple wrapper around a styled `HTMLButtonElement` and contains additional API to set text, icons, and functionality. See more [usage details](https://design.infor.com/components/components/button/).

## Themeable Parts

- `button` allows you to further style the button element
- `icon` allows you to further style the icon element (used in some types of buttons)
- `text` allows you to further style the text element (used in some types of buttons)

## Methods

- `toggleAnimation(isActive: boolean)`: Toggles generative AI button's active state, including its own indicator.

## Features (With Code Samples)

A standalone primary button:

```html
<ids-button id="my-button" appearance="primary">
  <span>My Button</span>
</ids-button>
```

Adding an icon to the button using the `icon` attribute:

```html
<ids-button id="my-button" appearance="primary" icon="settings">
  <span>My Button</span>
</ids-button>
```

An icon-only button without visible text. To maintain accessibility standards, descriptive text explaining the button's function is required. To hide this text visually but provide it to screen readers, add an "audible" class to the text `<span>`:

```html
<ids-button id="my-button" appearance="primary" icon="settings">
  <span class="audible">My Button</span>
</ids-button>
```

### Color Variants

If placing a button in a container with a contrasting background color, the "base" appearance may not contain accessible color contrast ratios. The `color-variant` property can be used with the [IdsColorVariantMixin](https://github.com/infor-design/enterprise-wc/blob/main/src/mixins/ids-color-variant-mixin/README.md):

```html
<!-- Generates a default (Tertiary) Button with white text and focus/hover states --->
<ids-button id="my-button-1" color-variant="alternate">
  <span>My Button</span>
</ids-button>

<!-- Generates a Primary Button with a slightly brighter Blue --->
<ids-button id="my-button-2" appearance="primary" color-variant="alternate">
  <span>My Button</span>
</ids-button>

<!-- Generates a Secondary Button with a slightly brighter Neutral --->
<ids-button id="my-button-3" appearance="primary" color-variant="alternate">
  <span>My Button</span>
</ids-button>

<!-- Generates a button to use with toolbar formatter type --->
<ids-button id="my-button-4" color-variant="alternate-formatter">
  <span>My Button</span>
</ids-button>
```

## States and Variations

Standard button states include:

- Normal
- Hover
- Focus
- Active (pressed)
- Disabled
- Color Variant - alternate colors for each button appearance are available via the [IdsColorVariantMixin](https://github.com/infor-design/enterprise-wc/blob/main/src/mixins/ids-color-variant-mixin/README.md)

Button appearances include:

- `default` (not displayed as a "appearance" attribute when set)
- `primary`
- `primary-destructive`
- `secondary`
- `tertiary`
- `tertiary-destructive`
- `primary-generative-ai`
- `tertiary-generative-ai`

### Alignment

Default alignment of text and icons within ids-button are based on the DOM order of those elements. However, if the `icon-align` attribute is specified, the alignment order of the inner elements can be forced.

Example of icon that follows text, though the DOM order is reversed:

```html
<ids-button id="my-button" appearance="primary" icon="settings" icon-align="end">
  <span>My Button</span>
</ids-button>
```

`icon-align` effects:

| Prop value | LTR (default) Icon Location | RTL Icon Location |
| :--------- | :-------------------------- | :---------------- |
| undefined  | n/a | n/a |
| `start`    | Left of text | Right of text |
| `end`      | Right of text | Left of text |

### Type

The `type` attribute passes through to the Shadow Root's `HTMLButtonElement` and defines its usage. 

For example, a `<form>` `submit` button:

```html
<ids-button id="my-button" type="submit">
  <span>My Button</span>
</ids-button>
```

## Settings and Attributes

- `appearance` {string} Visual style defining the button's purpose.
- `colorVariant` {'alternate' | 'alternate-formatter'} Set the variants theme styles.
- `cssClass` {Array<string> | string | null} Contains space-delimited CSS classes (or an array of CSS classes) that will be passed to the Shadow Root button.
- `disabled` {boolean} Sets the internal Button element's `disabled` property to enable/disable the button.
- `icon` {string | null} A string representing an icon to display inside the button. This string is passed to a slotted [IdsIcon](../ids-icon/README.md) element's `icon` setting to set the desired icon type.
- `iconAlign` {string} Defines which side to align the Button's icon against, can be 'start' or 'end'
- `tabIndex` {string | number} Sets the internal Button element's `tabIndex` property for controlling focus
- `text` {string} API-level method for setting a button's text content. This will become the content of the slotted text node when set.
- `type` {string} Passes a 'type' attribute for a standard `HTMLButtonElement` into the IdsButton's ShadowRoot-contained button element.
- `tooltip` {string} Sets up a string based tooltip.
- `square` {boolean} whether the corners of the button as an icon-button are angled/90°.
- `width` {string} Sets width of button. Accepts percent, pixels, rem, etc.
- `badge-position` {string} Sets the notification badge position if the button has an icon, passed to `ids-icon` component
- `badge-color` {string} Sets the notification badge color if the button has an icon, passed to `ids-icon` component

## Responsive Guidelines

- Buttons can span 100% width of their parent container on mobile breakpoints.

## Accessibility Guidelines

- All buttons, including icon-only buttons, must have descriptive text inside the button to communicate its action to a screen reader user. Use the `audible` CSS class to visually hide the text if necessary.

## Regional Considerations

Be aware of the content layout for buttons in right-to-left (RTL) UIs.

## Converting from Previous Versions

**3.x to 4.x**
- Change class `inforFormButton` default to `btn-primary`
- Change class `inforFormButton` to `btn-secondary`

**4.x to 5.x**
The ids-button is now a WebComponent. Instead of using classes to define a button's purpose or visual style, it's now done directly with an "appearance" attribute:

```html
<!-- 4.x button example -->
<button class="btn-primary" id="my-button">
  <svg class="icon" role="presentation">
    <use href="#settings"></use>
  </svg>
  <span>My Button</span>
</button>

<!-- this is the same button using the WebComponent -->
<ids-button id="my-button" appearance="primary" icon="settings">
  <span>My Button</span>
</ids-button>
```

- Markup has changed to a custom element `<ids-button id="my-button" appearance="primary"></ids-button>`
- Can now be imported as a single JS file and used with encapsulated styles.
- Some button properties are now attributes - "appearance", "text", "icon", "disabled", etc.
- Some components now extend IdsButton, such as [IdsToggleButton](../ids-toggle-button/README.md) and [IdsMenuButton](../ids-menu-button/README.md)...
