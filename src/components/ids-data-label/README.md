# Ids Data Label Component

## Description

The IDS Data Label component used to show both label and value for readonly (non editable data).

## Use Cases

- When you need to show a readonly data item with a label.

## Feature (With the Code Examples)

Shows a data label with one top label and one with a left label.

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