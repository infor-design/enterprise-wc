# Ids Action Sheet Component

## Description

The IDS Hierarchy (Org Chart) component is a UI pattern that is comprised expandable hierarchical cards. It consists of an wrapper component called `ids-hierarchy` and it's items called `ids-hierarchy-item`. The `ids-hierarchy-item` component can be nested in side each other to create another level of hierarchy. Additionally there is an `ids-hierarchy-legend` component that can be used to display the legend for the org chart.

## Use Cases

The main use case for the IDS Hierarchy component is to create an organizational chart with each leaf (card) containing details on employees and their hierachy in the org.

## Terminology

- **leaf**: The horizontal card that contains details
- **avatar**: A named `slot` that usually consists of an `img` thumbnail
- **heading**: A named `slot` that usually consists of `ids-text` component and displays the heading of the hierarchy item.
- **subheading**: A named `slot` that usually consists of `ids-text` component and displays the subheading of the hierarchy item.
- **micro**: A named `slot` that usually consists of `ids-text` component and displays the micro text of the hierarchy item.
- **icon-btn**: An element in the `ids-hierarchy-item` that acts as the trigger for expandind and collapsing the hierarchy item.
- **legend**: A component called `ids-hierarchy-legend` that is used to display the legend for the org chart. It consists of a text property and color-variant.

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

### Color Variants

The `ids-hierarchy-item` and `ids-hierarchy-legend-item` make use of the [IdsColorVariantMixin](../../mixins/ids-color-variant-mixin/README.md) to modify the colors per item. There are currently 4 color variants available: `full-time`, `part-time`, `contractor` and `open-position`.

```html
<ids-hierarchy-item id="item-1" color-variant="full-time">
    <img src="../assets/headshot-1.jpg" alt="item-1" slot="avatar" />
    <ids-text slot="heading">Tony Cleveland</ids-text>
    <ids-text slot="subheading">Director</ids-text>
    <ids-text slot="micro">FT</ids-text>
</ids-hierarchy-item>

<ids-hierarchy-item id="item-2" color-variant="part-time">
    <ids-text slot="heading">Julie Dawes</ids-text>
    <ids-text slot="subheading">Records Clerk</ids-text>
    <ids-text slot="micro">PT</ids-text>
</ids-hierarchy-item>

<ids-hierarchy-item id="item-5" color-variant="contractor">
    <ids-text slot="heading">Tony Cleveland</ids-text>
    <ids-text slot="subheading">Director</ids-text>
    <ids-text slot="micro">C</ids-text>
</ids-hierarchy-item>

<ids-hierarchy-item id="item-4" color-variant="open-position">
    <ids-text slot="heading">Julie Dawes</ids-text>
    <ids-text slot="subheading">Records Clerk</ids-text>
    <ids-text slot="micro">OP</ids-text>
</ids-hierarchy-item>
```

## States and Variations

- **root-item**: This is an attribute that can be added the top level `ids-hierarchy-item`. This is added to adjust the styling of the root item.
- **Expanded**: The state where the leaf's children are visible. Sometimes it serves as the default state, this state can also be remembered by the application.
- **Selected**: The state where the leaf appears selected or focused

## Keyboard Guidelines

- **Enter or Space**: When focus is on an `icon-btn`, this keystroke toggles the expansion of the corresponding leaf. If collapsed, the leaf is expanded, and its aria-expanded state is set to true. If expanded, the leaf is collapsed and its aria-expanded state is set to false.
