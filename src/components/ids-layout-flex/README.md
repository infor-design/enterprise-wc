# ids-layout-flex

## Description

The Ids Layout Flex is comprised of 2 web components, IdsLayoutFlex and IdsLayoutFlexItem. IdsLayoutFlex is the parent container in which the child items defined. IdsLayoutFlexItem is a child element of Layout Flex. These elements contain the UI contents. A Layout Flex can also be nested inside a layout flex item.

## Use Cases

- Use to layout complex forms
- Use to layout a list

## Terminology

- **Flex**: Container that has the `display: flex` property set on it. We refer to this as `ids-layout-flex`.
- **FlexItem** Child element of layout flex, we refer to this as `ids-layout-flex-item`.

## Features (With Code Examples)

By default the layout flex is set as direction row.

```html
<ids-layout-flex>
  <ids-layout-flex-item>
    <ids-text font-size="12">test</ids-text>
  </ids-layout-flex-item>
  <ids-layout-flex-item>
    <ids-text font-size="12">test</ids-text>
  </ids-layout-flex-item>
  <ids-layout-flex-item>
    <ids-text font-size="12">test</ids-text>
  </ids-layout-flex-item>
</ids-layout-flex>
```

Example of flex with gap (8).
Gap can set horizontal as (gap-x) and vertical as (gap-y)
The value can be use: 0, 1, 2, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40

```html
<ids-layout-flex gap="8">
  <ids-layout-flex-item>
    <ids-text font-size="12">test</ids-text>
  </ids-layout-flex-item>
  <ids-layout-flex-item>
    <ids-text font-size="12">test</ids-text>
  </ids-layout-flex-item>
  <ids-layout-flex-item>
    <ids-text font-size="12">test</ids-text>
  </ids-layout-flex-item>
</ids-layout-flex>
```

Example of flex with align-content (center).
The value can be use: flex-start, flex-end, center, space-between, space-around, space-evenly, stretch, start, end, baseline

```html
<ids-layout-flex align-content="center">
  <ids-layout-flex-item>
    <ids-text font-size="12">test</ids-text>
  </ids-layout-flex-item>
  <ids-layout-flex-item>
    <ids-text font-size="12">test</ids-text>
  </ids-layout-flex-item>
  <ids-layout-flex-item>
    <ids-text font-size="12">test</ids-text>
  </ids-layout-flex-item>
</ids-layout-flex>
```

Example of flex with align-items (center).
The value can be use: start, end, flex-start, flex-end, center, baseline, stretch

```html
<ids-layout-flex align-items="center">
  <ids-layout-flex-item>
    <ids-text font-size="12">test</ids-text>
  </ids-layout-flex-item>
  <ids-layout-flex-item>
    <ids-text font-size="12">test</ids-text>
  </ids-layout-flex-item>
  <ids-layout-flex-item>
    <ids-text font-size="12">test</ids-text>
  </ids-layout-flex-item>
</ids-layout-flex>
```

Example of flex with direction (column).
The value can be use: row, row-reverse, column, column-reverse

```html
<ids-layout-flex direction="column">
  <ids-layout-flex-item>
    <ids-text font-size="12">test</ids-text>
  </ids-layout-flex-item>
  <ids-layout-flex-item>
    <ids-text font-size="12">test</ids-text>
  </ids-layout-flex-item>
  <ids-layout-flex-item>
    <ids-text font-size="12">test</ids-text>
  </ids-layout-flex-item>
</ids-layout-flex>
```

Example of flex with display (inline-flex).
The value can be use: flex, inline-flex

```html
<ids-layout-flex display="inline-flex">
  <ids-layout-flex-item>
    <ids-text font-size="12">test</ids-text>
  </ids-layout-flex-item>
  <ids-layout-flex-item>
    <ids-text font-size="12">test</ids-text>
  </ids-layout-flex-item>
  <ids-layout-flex-item>
    <ids-text font-size="12">test</ids-text>
  </ids-layout-flex-item>
</ids-layout-flex>
```

Example of flex with justify-content (center).
The value can be use: start, end, flex-start, flex-end, center, left, right, space-between, space-around, space-evenly

```html
<ids-layout-flex justify-content="center">
  <ids-layout-flex-item>
    <ids-text font-size="12">test</ids-text>
  </ids-layout-flex-item>
  <ids-layout-flex-item>
    <ids-text font-size="12">test</ids-text>
  </ids-layout-flex-item>
  <ids-layout-flex-item>
    <ids-text font-size="12">test</ids-text>
  </ids-layout-flex-item>
</ids-layout-flex>
```

Example of flex with wrap (wrap).
The value can be use: `nowrap`, `wrap`, `wrap-reverse`

```html
<ids-layout-flex wrap="wrap">
  <ids-layout-flex-item>
    <ids-text font-size="12">test</ids-text>
  </ids-layout-flex-item>
  <ids-layout-flex-item>
    <ids-text font-size="12">test</ids-text>
  </ids-layout-flex-item>
  <ids-layout-flex-item>
    <ids-text font-size="12">test</ids-text>
  </ids-layout-flex-item>
</ids-layout-flex>
```

Example of flex with item align-self (center).
The value can be use: auto, baseline, center, stretch, flex-start, flex-end

```html
<ids-layout-flex>
  <ids-layout-flex-item align-self="center">
    <ids-text font-size="12">test</ids-text>
  </ids-layout-flex-item>
  <ids-layout-flex-item>
    <ids-text font-size="12">test</ids-text>
  </ids-layout-flex-item>
  <ids-layout-flex-item>
    <ids-text font-size="12">test</ids-text>
  </ids-layout-flex-item>
</ids-layout-flex>
```

Example of flex with item grow (1).
The value can be use: 0, 1

```html
<ids-layout-flex>
  <ids-layout-flex-item grow="1">
    <ids-text font-size="12">test</ids-text>
  </ids-layout-flex-item>
  <ids-layout-flex-item>
    <ids-text font-size="12">test</ids-text>
  </ids-layout-flex-item>
  <ids-layout-flex-item>
    <ids-text font-size="12">test</ids-text>
  </ids-layout-flex-item>
</ids-layout-flex>
```

Example of flex with item shrink (0).
The value can be use: 0, 1

```html
<ids-layout-flex>
  <ids-layout-flex-item shrink="0">
    <ids-text font-size="12">test</ids-text>
  </ids-layout-flex-item>
  <ids-layout-flex-item>
    <ids-text font-size="12">test</ids-text>
  </ids-layout-flex-item>
  <ids-layout-flex-item>
    <ids-text font-size="12">test</ids-text>
  </ids-layout-flex-item>
</ids-layout-flex>
```

You can also make a flex item into a scrollable area using the `ids-scroll-container` separate min-component.

```html
  <ids-layout-flex direction="column" gap="0" full-height>
    <ids-layout-flex-item>
      <ids-header>
      </ids-header>
    </ids-layout-flex-item>

    <ids-layout-flex-item grow="1" overflow="hidden">
      <ids-scroll-container>
        <!--Scrollable contents-->
       </ids-scroll-container>
    </ids-layout-flex-item>
</ids-layout-flex>
```

Standalone CSS Example

```html
<div class="ids-layout-flex ids-layout-flex-gap-8">
  <div class="ids-layout-flex-item">
    <span class="ids-text">test</span>
  </div>
  <div class="ids-layout-flex-item">
    <span class="ids-text">test</span>
  </div>
  <div class="ids-layout-flex-item">
    <span class="ids-text">test</span>
  </div>
</div>
```

## Settings and Attributes (IdsLayoutFlex)

- `alignContent` {string} sets the align-content setting, value can be use: `flex-start`, `flex-end`, `center`, `space-between`, `space-around`, `space-evenly`, `stretch`, `start`, `end`, `baseline`.
- `alignItems` {string} sets the align-items setting, value can be use: `start`, `end`, `flex-start`, `flex-end`, `center`, `baseline`, `stretch`.
- `direction` {string} sets the direction setting, value can be use: `row`, `row-reverse`, `column`, `column-reverse`.
- `display` {string} sets the display setting, value can be use: `flex`, `inline-flex`.
- `gap` {string|number} sets the gap apply same for both horizontal and vertical sides, value can be use: 0, 1, 2, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40.
- `gapX` {string|number} sets the horizontal gap, value can be use: 0, 1, 2, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40.
- `gapY` {string|number} sets the vertical gap, value can be use: 0, 1, 2, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40.
- `justifyContent` {string} sets the justify-content setting, value can be use: `start`, `end`, `flex-start`, `flex-end`, `center`, `left`, `right`, `space-between`, `space-around`, `space-evenly`.
- `wrap` {string} sets the wrap setting, value can be use: `nowrap`, `wrap`, `wrap-reverse`.

## Settings and Attributes (IdsLayoutFlexItem)

- `alignSelf` {string} sets the align-self setting, value can be use: `auto`, `baseline`, `center`, `stretch`, `flex-start`, `flex-end`.
- `grow` {string|number} sets the grow setting, value can be use: 0, 1
- `shrink` {string|number} sets the shrink setting, value can be use: 0, 1

## Keyboard Guidelines

A layout flex is not on its own keyboard focusable and has no keyboard interaction.

## Responsive Guidelines

- A Layout Flex will flow automatically with the screen size.

## Converting from Previous Versions (Breaking Changes)

**4.x to 5.x**

- New concept in 5.x

## Regional Considerations

The entire flex will flip direction in Right-To-Left languages.
