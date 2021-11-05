# Ids Hidden Component

## Description

The IDS Hidden `ids-hidden` is a wrapper component that can be used to responsively hide children components based on selected breakpooints.

## Use Cases

Create responsive layouts or hide/show components based on selected breakpoints

## Terminology

- **hide-up**: An attribute that when set with a breakpoint size will hide when the min-width breakpoint is reached.
- **hide-down**: An attribute that when set with a breakpoint size will hide when the max-width breakpoint is reached.
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

## Keyboard Guidelines

n/a
