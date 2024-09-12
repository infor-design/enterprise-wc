# ids-data-label

## Description

The ids-data-label is used to show a label and value for non-editable content.

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
  IdsEventsMixin
  IdsLocaleMixin

## Settings (Attributes)

- `label` {string} Set label string
- `label-position` {string} Set label position, 'top' | 'left'
