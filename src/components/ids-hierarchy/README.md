# Ids Hierarchy Component

## Description

The IDS Hierarchy (Org Chart) component is a UI pattern that is comprised expandable hierarchical cards

## Use Cases

The main use case for the IDS Hierarchy component is to create an organizational chart with each leaf (card) containing details on employees and their hierachy in the org.

## Terminology

- **leaf**: The horizontal card that contains details
- **avatar**: A named `slot` that usually consists of an `img` thumbnail
- **heading**: A named `slot` that usually consists of `ids-text` component and displays the heading of the leaf.
- **subheading**: A named `slot` that usually consists of `ids-text` component and displays the subheading of the leaf.
- **micro**: A named `slot` that usually consists of `ids-text` component and displays the micro text of the leaf.
- **icon-btn**: An element in the `ids-hierarchy-item` that acts as the trigger for expandind and collapsing the leaf.

## Features (With Code Examples)

```html
<ids-hierarchy>
  <ids-hierarchy-item id="item-1" color-variant="full-time">
    <img src="../assets/placeholder-200x200.png" slot="avatar">
    <ids-text slot="heading">Tony Cleveland</ids-text>
    <ids-text slot="subheading">Director</ids-text>
    <ids-text slot="micro">FT</ids-text>
  </ids-hierarchy-item>
  <ids-hierarchy-item id="item-2" color-variant="part-time">
    <ids-text slot="heading">Julie Dawes</ids-text>
    <ids-text slot="subheading">Records Clerk</ids-text>
    <ids-text slot="micro">PT</ids-text>
  </ids-hierarchy-item>
  <ids-hierarchy-item id="item-3" color-variant="contractor">
    <ids-text slot="heading">Kaylee Edwards</ids-text>
    <ids-text slot="subheading">Records Manager</ids-text>
    <ids-text slot="micro">C</ids-text>
  </ids-hierarchy-item>
</ids-hierarchy>
```

Nested ids-hierarchy-item

```html
<ids-hierarchy>
  <ids-hierarchy-item id="item-1" color-variant="full-time">
    <img src="../assets/placeholder-200x200.png" slot="avatar">
    <ids-text slot="heading">Tony Cleveland</ids-text>
    <ids-text slot="subheading">Director</ids-text>
    <ids-text slot="micro">FT</ids-text>
  </ids-hierarchy-item>
  <ids-hierarchy-item id="item-2" color-variant="part-time">
    <ids-text slot="heading">Julie Dawes</ids-text>
    <ids-text slot="subheading">Records Clerk</ids-text>
    <ids-text slot="micro">PT</ids-text>
  </ids-hierarchy-item>
  <ids-hierarchy-item id="item-3" color-variant="contractor">
    <ids-text slot="heading">Kaylee Edwards</ids-text>
    <ids-text slot="subheading">Records Manager</ids-text>
    <ids-text slot="micro">C</ids-text>

    <ids-hierarchy-item id="item-4" color-variant="open-position">
      <ids-text slot="heading">Julie Dawes</ids-text>
      <ids-text slot="subheading">Records Clerk</ids-text>
      <ids-text slot="micro">OP</ids-text>

      <ids-hierarchy-item id="item-5" color-variant="contractor">
        <ids-text slot="heading">Tony Cleveland</ids-text>
        <ids-text slot="subheading">Director</ids-text>
        <ids-text slot="micro">C</ids-text>
      </ids-hierarchy-item>
    </ids-hierarchy-item>
  </ids-hierarchy-item>
</ids-hierarchy>
```

## States and Variations

- **Expanded**: The state where the leaf's children are visible. Sometimes it serves as the default state, this state can also be remembered by the application.
- **Selected**: The state where the leaf appears selected or focused

## Keyboard Guidelines

- **Enter or Space**: When focus is on an `icon-btn`, this keystroke toggles the expansion of the corresponding leaf. If collapsed, the leaf is expanded, and its aria-expanded state is set to true. If expanded, the leaf is collapsed and its aria-expanded state is set to false.
