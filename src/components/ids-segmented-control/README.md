# Ids Segmented Control

## Description

The IDS Segmented Control component is a UI element designed to group a series of toggle buttons, allowing users to select one option from a set. It acts as a container for ids-toggle-button elements, managing their state so that only one button can be active at any given time. When a button is selected, it is highlighted, and all other buttons in the group are reset to their default state. This component is ideal for creating segmented controls in user interfaces, where users need to choose between mutually exclusive options.

## Use Cases

- **Option Selection**: Use the IdsSegmentedControl to create a set of mutually exclusive options, such as selecting a view (e.g., list view vs. grid view), choosing a filter (e.g., most recent vs. most popular), or switching between different modes (e.g., edit vs. preview).
- **Navigation**: Implement segmented controls for navigation within different sections of a UI, such as tabbed interfaces where each toggle button represents a different tab or view.
- **Toolbars**: Integrate the segmented control into toolbars for applications, allowing users to toggle between different tools or settings with a single click.
- **Forms**: Use in forms where a user needs to select one option out of several (e.g., selecting a payment method, choosing a subscription plan).

## Terminology

- **Segmented Control**: A UI component that groups multiple toggle buttons together, allowing users to select one option from a set. It ensures that only one button can be active at any time, with the others reverting to their default state.
- **Toggle Button**: A button that can be switched between two states: active (pressed) and inactive (unpressed). In the context of a segmented control, a toggle button is used to represent an option within the control.
- **Active State**: The state of a toggle button when it is selected or pressed. In a segmented control, the active state is visually distinguished (e.g., highlighted) and indicates the current selection.
- **Default State**: The state of a toggle button when it is not selected. In a segmented control, buttons in the default state are not highlighted, indicating that they are not the current selection.
- **Slot**: A placeholder within the segmented control's DOM structure where ids-toggle-button elements are placed. This allows for the flexible arrangement of toggle buttons within the segmented control component.
- **CSS**: The `.ids-toggle-button-segmented` class is added to each toggle button within the segmented control to apply specific styling associated with the segmented control layout.

## Features (With Code Examples)

### Single Selection

The IdsSegmentedControl ensures that only one ids-toggle-button can be selected at a time. When a user clicks on a toggle button, it becomes active, and all other buttons are set to their default state.

```html
<ids-segmented-control>
  <ids-toggle-button text-on="Option 1" text-off="Option 1"></ids-toggle-button>
  <ids-toggle-button text-on="Option 2" text-off="Option 2"></ids-toggle-button>
  <ids-toggle-button text-on="Option 3" text-off="Option 3"></ids-toggle-button>
</ids-segmented-control>
```

In this example, when one of the toggle buttons is clicked, it will become active, and the others will automatically deactivate.

### Toggle Buttons Without Icons

Toggle buttons can be used without icons, relying solely on text to convey the option to the user.

```html
<ids-segmented-control>
  <ids-toggle-button disable-icon text-on="Text Only 1" text-off="Text Only 1"></ids-toggle-button>
  <ids-toggle-button disable-icon text-on="Text Only 2" text-off="Text Only 2"></ids-toggle-button>
  <ids-toggle-button disable-icon text-on="Text Only 3" text-off="Text Only 3"></ids-toggle-button>
</ids-segmented-control>
```

This example demonstrates toggle buttons that display only text, with no icons.

### Toggle Buttons With Icons Only

Toggle buttons can also be used with icons only, without any text. This is useful when you want a compact control or when the icon is universally understood.

```html
<ids-segmented-control>
  <ids-toggle-button icon-on="star-filled" icon-off="star-outlined"></ids-toggle-button>
  <ids-toggle-button icon-on="heart-filled" icon-off="heart-outlined"></ids-toggle-button>
  <ids-toggle-button icon-on="bell-filled" icon-off="bell-outlined"></ids-toggle-button>
</ids-segmented-control>
```

In this example, the toggle buttons use only icons to represent different states, making the control more compact and icon-focused.

### Toggle Buttons With Both Icons and Text

Toggle buttons can include both icons and text to provide clear, descriptive options to the user.

```html
<ids-segmented-control>
  <ids-toggle-button icon-on="star-filled" icon-off="star-outlined" text-on="Starred" text-off="Star"></ids-toggle-button>
  <ids-toggle-button icon-on="heart-filled" icon-off="heart-outlined" text-on="Liked" text-off="Like"></ids-toggle-button>
  <ids-toggle-button icon-on="bell-filled" icon-off="bell-outlined" text-on="Notified" text-off="Notify"></ids-toggle-button>
</ids-segmented-control>
```

This example shows toggle buttons that use both icons and text, giving a more descriptive and visually informative control.

## States and Variations

### "Default" Appearance

In the default state, all toggle buttons within the segmented control are unpressed and styled according to their default appearance.

```html
<ids-segmented-control>
  <ids-toggle-button icon-off="star-outlined" text-off="Star"></ids-toggle-button>
  <ids-toggle-button icon-off="heart-outlined" text-off="Like"></ids-toggle-button>
  <ids-toggle-button icon-off="bell-outlined" text-off="Notify"></ids-toggle-button>
</ids-segmented-control>
```

### Active State

When a toggle button is clicked, it transitions to the active state. The button is highlighted, and any associated text and icon are updated to reflect the active state.

```html
<ids-segmented-control>
  <ids-toggle-button icon-on="star-filled" text-on="Starred" pressed="true"></ids-toggle-button>
  <ids-toggle-button icon-off="heart-outlined" text-off="Like"></ids-toggle-button>
  <ids-toggle-button icon-off="bell-outlined" text-off="Notify"></ids-toggle-button>
</ids-segmented-control>
```

### Selected by default

You can set one of the toggle buttons to be selected by default when the segmented control is first rendered.

```html
<ids-segmented-control>
  <ids-toggle-button icon-on="star-filled" text-on="Starred" pressed="true"></ids-toggle-button>
  <ids-toggle-button icon-off="heart-outlined" text-off="Like"></ids-toggle-button>
  <ids-toggle-button icon-off="bell-outlined" text-off="Notify"></ids-toggle-button>
</ids-segmented-control>
```

### Dsiabled State

The disabled state prevents user interaction with the toggle buttons. When a button is disabled, it is visually indicated and does not respond to clicks or keyboard events.

```html
<ids-segmented-control>
  <ids-toggle-button icon-off="star-outlined" text-off="Star" disabled="true"></ids-toggle-button>
  <ids-toggle-button icon-off="heart-outlined" text-off="Like"></ids-toggle-button>
  <ids-toggle-button icon-off="bell-outlined" text-off="Notify"></ids-toggle-button>
</ids-segmented-control>
```

## Keyboard Guidelines

## Responsive Guidelines

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
