# Ids Treemap Component

## Description

Treemaps are used to display hierarchical data. This is useful when space is constrained and you need to see an overview of a large amount of hierarchical data. Treemaps should primarily be used with values that can be aggregated. Treemaps are economical in that they can be used within a limited space and yet display a large number of items simultaneously. When there is a correlation between color and size in the tree structure, you are able to see patterns that would be difficult to spot in other ways, for example, when a certain color is particularly relevant.

Treemaps are not good when there is a big difference in the magnitude of the measure values. Nor is a treemap the right choice when mixing absolute and relative values. Negative values cannot be displayed in treemaps.

## Terminology

## Features (With Code Examples)

```html
    <ids-treemap title="Storage Utilization (78 GB)"></ids-treemap>
```

```js
const treeMapEl = document.querySelector('ids-treemap');

  treeMapEl.result = treeMapEl.treeMap({
    data: [
      {
        value: 28,
        color: '#003876',
        text: 'JSON',
        label: '28%'
      },
      {
        value: 18,
        color: '#004A99',
        text: 'PDF',
        label: '18%'
      },
      {
        value: 8,
        color: '#0054B1',
        text: 'BOD',
        label: '8%'
      },
      {
        value: 8,
        color: '#0066D4',
        text: 'TXT',
        label: '8%'
      },
      {
        value: 17,
        color: '#0072ED',
        text: 'CSV',
        label: '17%'
      },
      {
        value: 7,
        color: '#1C86EF',
        text: 'Assets',
        label: '7%'
      },
      {
        value: 14,
        color: '#55A3F3',
        text: 'Others',
        label: '14%'
      },
    ],
    width: 1000,
    height: 300
  });
```

## Accessibility Guidelines

The contrast and actual colors can be a concern for visibility impaired and color blind people. However, you can customize the color by passing different contrast colors in the colors option.

## Usage Guidance

- You can control the size of the treemap by setting the size of the parent element the treemap lives in. This may include possibly using an inset margin in some cases.
- This component does not support drilldown at this time.
- Using the data you can either show a single set or nested set of data (compare the two examples)
- You can set tooltips on the treemap by passing in a text or html string in a `tooltip` field in the data. By default a tooltip will show if the data rectangle is small.

## Keyboard Shortcuts

This chart has no keyboard functionality

## Responsive Information

As you resize the chart will redraw with in the width of the parent width and height. The nodes in the treemap are sized in proportion.
