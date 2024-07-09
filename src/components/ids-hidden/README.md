# Ids Hidden Component

## Description

The IDS Hidden `ids-hidden` is a wrapper component that can be used to responsively hide children components based on selected breakpoints.

## Use Cases

Create responsive layouts or hide/show components based on selected breakpoints

## Terminology

- **hide-up**: An attribute that when set with a breakpoint size will hide when the min-width breakpoint is reached.
- **hide-down**: An attribute that when set with a breakpoint size will hide when the max-width breakpoint is reached.
- **enable-container**: Sets or removes the `enable-container` attribute and class based on the truthiness of the string value to toggle the use of container queries.
- **container-target**: Sets the `container-target` attribute to the ID of a DOM element and applies `containerType: inline-size`, or removes the attribute if the value is null or empty.
- **breakpoints**:
- xxl: 1440px
- xl: 1280px
- l: 1024px
- m: 840px
- s: 600px
- xs: 360px

## Features (With Code Examples)

```html
<ids-hidden id="hidden-1" hide-up="md">
  <ids-card>
    <div slot="card-header">
      <ids-text font-size="20" type="h2" overflow="ellipsis" tooltip="true">Card Title One</ids-text>
    </div>
    <div slot="card-content">
    </div>
  </ids-card>
</ids-hidden>

<ids-hidden id="hidden-2" hide-down="md">
  <ids-card>
    <div slot="card-header">
      <ids-text font-size="20" type="h2" overflow="ellipsis" tooltip="true">Card Title Two</ids-text>
    </div>
    <div slot="card-content">
    </div>
  </ids-card>
</ids-hidden>
```

## States and Variations

- **visible**: The state where `ids-hidden` is visible. Is set set by the `visible` attribute.
- **hidden**: The state where `ids-hidden` is hidden.

## Converting from Previous Versions (Breaking Changes)

**4.x to 5.x**
- The hidden component replaces the visibility functionality https://main-enterprise.demo.design.infor.com/components/visibility/list
- Markup has changed to a custom element `<ids-hidden>` (see examples above)
- Can now be imported as a single JS file and used with encapsulated styles
