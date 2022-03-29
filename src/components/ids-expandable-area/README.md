# Ids Expandable Area Component

## Description

The IDS Expandable Area component is a UI pattern that is comprised of a title, content and a toggle button or link for expanding and collapsing.

## Use Cases

Expandable areas are crucial to displaying only important information to the user. This can be especially useful in managing application pages with many sections, forms and other content. Users may benefit from having to sort through less information.

## Terminology

- **ids-expandable-area**: Container for expandable areas. The default version consists of 4 slots. `header`, `pane`, `expander-default` and `expander-expanded`.
- **header**: Usually contains an `ids-text` component and displays the title of the expandable area. When type is set to `toggle-btn` the header will container an `ids-toggle-button` and acts as the control for expanding and collapsing.
- **pane**: This slot contains the content for the expandable area. Usually contains an `ids-text` component but can be filled with anything within reason, such as, forms.
- **expander-default**: Acts as the control for expanding. Contains the text for the collapsed state.
- **expander-expanded**: Acts as the control for collapsing. Contains the text for the expanded state.

## Themeable Parts

- `container` allows you to further style the main container element
- `header` allows you to further style the header element
- `pane` allows you to further style the pane element
- `footer` allows you to further style the footer element

## Features (With Code Examples)

Ids Expandable Area - Default

```html
<ids-expandable-area>
    <ids-text slot="header" font-size="16">Procurement</ids-text>
    <ids-text slot="pane" font-size="14">
        Ubiquitous out-of-the-box, scalable; communities disintermediate beta-test, enable utilize markets dynamic
        infomediaries virtual data-driven synergistic aggregate infrastructures, "cross-platform, feeds
        bleeding-edge tagclouds." Platforms extend interactive B2C benchmark proactive, embrace e-markets,
        transition generate peer-to-peer.
    </ids-text>
    <ids-text slot="expander-default" font-size="14">Show More</ids-text>
    <ids-text slot="expander-expanded" font-size="14">Show Less</ids-text>
</ids-expandable-area>
```

Ids Expandable Area - Toggle Button

```html
<ids-expandable-area type="toggle-btn">
    <ids-toggle-button
        slot="header"
        id="test-toggle-button"
        icon-on="caret-up"
        icon-off="caret-down"
        text-off="Employee"
        text-on="Employee"
    >
        <span slot="text"></span>
        <ids-icon slot="icon" icon="settings"></ids-icon>
    </ids-toggle-button>
    <ids-text slot="pane" font-size="14">
        Ubiquitous out-of-the-box, scalable; communities disintermediate beta-test, enable utilize markets dynamic
        infomediaries virtual data-driven synergistic aggregate infrastructures, "cross-platform, feeds
        bleeding-edge tagclouds." Platforms extend interactive B2C benchmark proactive, embrace e-markets,
        transition generate peer-to-peer.
    </ids-text>
</ids-expandable-area>
```

## States and Variations

- **Collapsed**: The state where the expandable area’s content is not visible. Sometimes it serves as the default state, this state can also be remembered by the application.
- **Expanded**: The state where the expandable area’s content is visible. Sometimes it serves as the default state, this state can also be remembered by the application.

## Keyboard Guidelines

- **Enter or Space**: When focus is on an `expander`, this keystroke toggles the expansion of the corresponding expandable area panel. If collapsed, the panel is expanded, and its aria-expanded state is set to true. If expanded, the panel is collapsed and its aria-expanded state is set to false.

## Converting from Previous Versions (Breaking Changes)

**3.x to 4.x**
- Expandable Area and Field Set were separated

**4.x to 5.x**
- The ExpandableArea component has been changed to a web component and renamed to `<ids-expandable-area>`.
- Markup has changed to a custom element `<ids-expandable-area` (see examples above)
- Can now be imported as a single JS file and used with encapsulated styles
- The settings are changed and uses flexible slots
- The events now use native events / custom events
