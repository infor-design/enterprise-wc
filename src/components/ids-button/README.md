# Ids Button Component

## Description

The IDS Button component is a simple wrapper around a standard HTMLButtonElement that is styled with Infor branding, and contains some additional API that makes it easy to set text, icons, and functionality.

## Use Cases

- Create standalone buttons
- Create multiple buttons, each with different styling to provide context for actions that are primary, secondary, and tertiary.

## Terminology

**Primary**: A primary action that is the definitive "use" of a particular feature.  For example, after doing data entry on a form, the primary action might be to "Save" the contents of that form to a record.
**Secondary**: A secondary action is one that might be related to the primary action, but alternative in nature.  For example, a secondary action that might sit next to our above primary action could be "reset", which would remove the user-entered contents of the form and start from scratch.
**Tertiary**: Sometimes also called "destructive" in IDS, a tertiary action is one that might "undo" or be completely separate from the primary/secondary actions, but labelled with enough importance to be displayed aside them. Building on the above examples, a tertiary action might be "cancel" or "close", which would cause the form to close, and return the user to the previous workflow.

## Themeable Parts

- `button` allows you to further style the internal button element
- `icon` allows you to further style the internal icon element (used in some types of buttons)
- `text` allows you to further style the internal icon element (used in some types of buttons)

## Features (With Code Samples)

Standalone primary buttons could be built this way:

```html
<ids-button id="my-button" type="primary">
  <span>My Button</span>
</ids-button>
```

Add an icon to the primary button this way:

```html
<ids-button id="my-button" type="primary">
  <ids-icon icon="settings"></ids-icon>
  <span>My Button</span>
</ids-button>
```

IDS Buttons can be designed to make the icon appear by itself, without any visible text.  For accessibility reasons, descriptive text explaining the button's function should always be present.  In this scenario, the text span can have an "audible" class added, which will visually hide the text, but keep it accessible to screen readers:

```html
<ids-button id="my-button" type="primary">
  <ids-icon icon="settings"></ids-icon>
  <span class="audible">My Button</span>
</ids-button>
```

It's also possible to use named slots to more specifically identify elements inside the button.  In this scenario the icon will always come first:

```html
<ids-button id="my-button" type="primary">
  <ids-icon slot="icon" icon="settings"></ids-icon>
  <span slot="text">My Button</span>
</ids-button>
```

### Color Variants

If placing a button inside a container with a contrasting background color, sometimes the "base" styles for Ids Button types aren't adequate for passing contrast checks. To resolve this problem, the `color-variant` property can be used by way of the [IdsColorVariantMixin](../../mixins/ids-color-variant-mixin/README.md):

```html
<!-- Generates a default (Tertiary) Button with white text and focus/hover states --->
<ids-button id="my-button-1" color-variant="alternate">
  <span slot="text">My Button</span>
</ids-button>

<!-- Generates a Primary Button with a slightly more bright Azure --->
<ids-button id="my-button-2" type="primary" color-variant="alternate">
  <span slot="text">My Button</span>
</ids-button>

<!-- Generates a Secondary Button with a slightly more bright Slate --->
<ids-button id="my-button-2" type="primary" color-variant="alternate">
  <span slot="text">My Button</span>
</ids-button>
```

## States and Variations

Standard button states include:

- Normal
- Hover
- Focus
- Active (pressed)
- Disabled
- Color Variant - alternate colors for each button type are available via the [IdsColorVariantMixin](../../src/mixins/ids-color-variant/README.md)

IDS button types include:

- `default` (not displayed as a "type" attribute when set)
- `primary`
- `secondary`
- `tertiary`

An IDS Button that contains an icon has the icon aligned left of the button text by default.  To switch the alignment, it's possible to set the `icon-align` attribute.

```html
<ids-button id="my-button" type="primary" icon-align="end">
  <ids-icon slot="icon" icon="settings"></ids-icon>
  <span slot="text">My Button</span>
</ids-button>
```

The attribute has the following effects:

| prop value | LTR (default) Icon Location | RTL Icon Location |
| :--------- | :-------------------------- | :---------------- |
| 'start'    | icon to the left of text | icon to the right of text |
| 'end'      | icon to the right of text | icon to the left of text |

In the absence of the property, icons will align to `start` by default.

## Settings and Attributes

- `cssClass` {Array<string> | string | null} Contains space-delimited CSS classes (or an array of CSS classes) that will be passed to the Shadow Root button
- `disabled` {boolean} Sets the internal Button element's `disabled` property to enable/disable the button
- `icon` {string | null} A string representing an icon to display inside the button.  This icon will become the content of the Shadow Root button's `icon` slot when set
- `iconAlign` {string} Defines which side to align the Button's icon against, can be 'start' or 'end'
- `tabIndex` {string | number} Sets the internal Button element's `tabIndex` property for controlling focus
- `text` {string} API-level method of setting a button's text content. This will become the content of the Shadow Root button's `text` slot when set
- `text` {string} The type/purpose of the button to display
- `tooltip` {string} Sets up a string based tooltip
- `noRipple` {boolean} Disable the ripple animation effect
- `square` {boolean} whether the corners of the button as an icon-button are angled/90°

## Keyboard Guidelines

The IDS Button doesn't contain any interactions beyond a standard HTMLButtonElement:

- <kbd>Spacebar</kbd> or <kbd>Enter</kbd> keys execute the action for that button. If the button activation closes the containing entity or launches another entity, then focus moves to the newly-opened entity. If the button activation does not close or dismiss the containing entity, then focus remains on the button. An example might be an "Apply" or "Recalculate" button.
- <kbd>Tab</kbd> or <kbd>Shift</kbd>/<kbd>Tab<kbd> causes focus to move away from the button forward or backward one element/set respectively.

## Responsive Guidelines

- Buttons can optionally be 100% width of their parent container on mobile breakpoints

## Converting from Previous Versions

### Converting from 4.x

The IDS Button component is now a WebComponent.  Instead of using classes to define the type, it is done directly with a "type" attribute:

```html
<!-- 4.x button example -->
<button class="btn-primary" id="my-button">
  <svg class="icon" role="presentation">
    <use href="#settings"></use>
  </svg>
  <span>My Button</span>
</button>

<!-- this is the same button using the WebComponent -->
<ids-button id="my-button" type="primary">
  <ids-icon slot="icon" icon="settings"></ids-icon>
  <span slot="text">My Button</span>
</ids-button>
```

## Designs

## Alternate Designs

## Proposed Changes

## Test Plan

1. Accessibility - Axe
1. Visual Regression Test
1. Repeat Tests in All Supported Browsers
1. Some of these as test cases from the [WC gold standard](https://github.com/webcomponents/gold-standard/wiki#api)
1. Can be consumed in NG/Vue/React (pull it in standalone/built see it works standalone)

## Accessibility Guidelines

- All buttons, including icon-only buttons, should have some kind of text description inside the button for explaining its action to a visually-impaired user. This text can be hidden visually by way of using an `audible` CSS class on the text content.

## Regional Considerations

Be conscious of the layout of content within your buttons when they are present in RTL situations.
