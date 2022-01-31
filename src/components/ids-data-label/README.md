# Ids Data Label Component

## Description

The IDS Data Label component used to show both label and value.

## Use Cases

Typically, these data labels are useful to show information with top/left/right label positioned.

## Feature (With the Code Examples)

```html
<ids-data-label label="Shipping to" label-position="left">Los Angeles, California 90001 USA</ids-data-label>
<ids-data-label label="Shipping to">Los Angeles, California 90001 USA</ids-data-label>
```

## Class Hierarchy

- IdsDataLabel
  - IdsElement
- Mixins
  IdsThemeMixin

## Settings (Attributes)

- `label` {string} Set label string
- `label-position` {string} Set label position, 'top' | 'left'