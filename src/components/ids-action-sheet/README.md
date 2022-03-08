# Ids Action Sheet Component

## Description

The IDS Action Sheet `ids-action-sheet` component displays a mobile-friendly view of a menu, which appears to roll out from the bottom of the viewport and can easily be selected by touch.

## Use Cases

The main use case for the IDS Action Sheet component is to display a mobile-friendly menu. By default the action sheet only show on screens at the `sm` (600px) breakpoint. This could be expanded in the future or possibly disabled to allow for the action sheet to show on desktop screens.

## Terminology

- **ids-action-sheet**: The action sheet container. Consists of an `ids-overlay` and an unnamed `slot` which will contain the menu.
- **cancel-button**: The cancel button will close the action sheet. The default text of the button is "Cancel", but can be override with the `btnText` attribute.

## Features (With Code Examples)

```html
<ids-action-sheet id="icon-menu">
    <ids-menu>
        <ids-menu-group>
            <ids-menu-item text-align="center">Option One</ids-menu-item>
            <ids-menu-item text-align="center">Option Two</ids-menu-item>
            <ids-menu-item text-align="center">Option Three</ids-menu-item>
        </ids-menu-group>
    </ids-menu>
</ids-action-sheet>
```

## States and Variations

- **visible**: The state where the action sheet is visible. Can be set by the `visible` attribute.

## Keyboard Guidelines

- **Enter or Space**: The menu items as well as the cancel btn are actionable via the `Enter` and `Space` keys

## Converting from Previous Versions (Breaking Changes)

**4.x to 5.x**
- Action Sheet now uses all new markup and classes for web components (see above)
- Now called IdsActionSheet with a namespace
- The tray feature has not been added it is now replaced by a floating action button.
