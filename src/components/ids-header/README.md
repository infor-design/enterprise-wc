# Ids Header

## Description

Displays identifying information for a given data set. Best for identifying the main object or data set in a given view.

## Settings and Attributes

- `color` {string} Sets the header background color

## Code Examples

A basic use case of the default ids header.
```html
<ids-header>
  <ids-text font-size="12" type="h1">Ids Header</ids-text>
</ids-header>
```
Header components can contain other navigation components, such as [IdsBreadcrumb](../ids-breadcrumb/README.md) and [IdsToolbar](../ids-toolbar/README.md):

```html
<ids-header>
  <ids-toolbar id="my-toolbar">
    <ids-toolbar-section type="title">
      <ids-text font-size="20">My Header</ids-text>
      <ids-text font-size="14">With some extra information below</ids-text>
    </ids-toolbar-section>
    <ids-toolbar-section type="buttonset" align="end">
      <ids-button id="button-1" role="button">
        <span>Text</span>
      </ids-button>
      <ids-button id="button-2">
        <span class="audible">Settings</span>
        <ids-icon icon="settings"></ids-icon>
      </ids-button>
    </ids-toolbar-section>
  </ids-toolbar>
</ids-header>
```

## Converting from Previous Versions (Breaking Changes)

**3.x to 4.x**
- Replaces Module Header
- Has entirely different structure with no direct mapping

**4.x to 5.x**
- The header component has been changed to a web component and renamed to `<ids-header>`.
- Markup has changed to a custom element `<ids-header>` (see examples above)
- Can now be imported as a single JS file and used with encapsulated styles
- The uses ids-toolbar component for content
- The <ids-header></ids-header> custom element has a color attribute that can be applied to personalize the background color.
- Deprecated: Alternate breadcrumbs and alternate wizard and alternate tabs
