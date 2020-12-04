# Ids Toggle Button

## Description

The IDS Toggle Button component is an extension of the standard IDS Button component, which provides some API around "toggling" a feature and having a "pressed" state, in addition to the IDS Button's standard features.

## Use Cases

- Create buttons with "pressed" and "unpressed" states, which represent an action being toggled "on" and "off".

## Terminology

- Unpressed: an unpressed state is the visual equivalent to turning a feature "off".
- Pressed: a pressed state is the visual equivalent to turning a feature "on".
- Toggle: the action of toggling switches between unpressed and pressed, swapping to the alternate of what is currently set.

## Features (With Code Examples)

While it's possible to manually set the `icon` and `text` attributes of a Toggle Button the same way that a standard IDS Button would be used, the Toggle Button also contains similarly-named attributes that represent their "on" (pressed) and "off" (unpressed) visual states. Consider the following example:

```html
<ids-toggle-button id="my-toggle" icon-on="star-filled" icon-off="star-outlined" text-off="Toggle Button (Off)" text-on="Toggle Button (On)">
  <ids-icon slot="icon" icon="settings"></ids-icon>
  <span slot="text"></span>
</ids-toggle-button>
```

In this example, the "on" (pressed) state would be:

- `icon-on="star-filled"`
- `text-on="Toggle Button (On)"`

The "off" (unpressed) state would be:

- `icon-off="star-outlined"`
- `text-off="Toggle Button (Off)"`

In the above example, the default state of the Toggle button will be "off", and the content of the `icon-off`/`text-off` properties will populate the standard `icon`/`text` button properties.  To default the button on, simply use the `pressed` attribute:

```html
<ids-toggle-button id="my-toggle" pressed="true" icon-on="star-filled" icon-off="star-outlined" text-off="Toggle Button (Off)" text-on="Toggle Button (On)">
  <!-- ... -->
</ids-toggle-button>
```

## States and Variations

In addition to having the same states as Buttons, Toggle Buttons can also have:

- Pressed (on)
- Unpressed (off)

### "Default" Type

Toggle buttons can only be displayed in the "default" button type

## Keyboard Guidelines

## Responsive Guidelines

## Converting from Previous Versions

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

## Regional Considerations

Be conscious of the layout of content within your buttons when they are present in RTL situations.
