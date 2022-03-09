# Ids Axis Chart Component

## Description

The axis chart is a chart with an x-axis and y-axis. This is the base chart object used to make line, area, column and other charts.
Generally it should not be used on its own but if you have a case of making some other chart it could be used.

## Use Cases

- When you want a chart with x and y axis and control over whats rendered in it.

## Usage Considerations

- Do not show too many lines at once as it may be difficult to interpret.
- Hover tooltips should only be used to reveal additional non-critical information.

## Terminology

- **Marker**: A UI embellishments that shows the data points (i.e. the dots on a line chart).
- **Domain**: The domain is all x-values (the values of the graph from left to right)
- **Range**: The domain is all y-values (the values of the graph from down to up)
- **Scale**: The range of values in the graph (the values of the graph from down to up) and the amount of steps between each value.
- **Axis**: Charts typically have two axes that are used to measure and categorize data: a vertical axis (also known as value axis or y axis), and a horizontal axis (also known as category axis or x axis).

## Features (With Code Examples)

A line chart is defined with a custom element with a width and height.

```html
<ids-axis-chart title="A line chart showing component usage" width="800" height="500"></ids-axis-chart>
```

Datasets can be added to the line chart by passing in an array of objects. Each object must have a `data` and object with `name` and `values` from the data points. Also a name should be given for each data object which will be used as the legend text. The `shortName` is used to show the short name of the legend text and the `abbrName` is used to show an even shorter name of the legend text in responsive situations.

```html
const dataset = [{
  data: [{
    name: 'Jan',
    value: 1
  }, {
    name: 'Feb',
    value: 2
  }, {
    name: 'Mar',
    value: 3
  }, {
    name: 'Apr',
    value: 5
  }, {
    name: 'May',
    value: 7
  }, {
    name: 'Jun',
    value: 10
  }],
  name: 'Component A',
  shortName: 'Comp A',
  abbrName: 'A',
}];

document.querySelector('ids-axis-chart').data = dataset;
```

Inside the chart you should provide a chartTemplate that returns the inside (markers) of the chart as svg. The `lineMarkers` element will contain the correct points and position of the markers to use based on the data/height/width/margins of the chart.

```js
chartTemplate() {
  return `<g class="markers">
    ${this.lineMarkers().markers}
  </g>
  <g class="marker-lines">
    ${this.lineMarkers().lines}
  </g>
  <g class="areas">
    ${this.#areas()}
  </g>`;
}
```

You can also customize the empty message contents but adding an `ids-empty-element` to the slot.

```html
<ids-axis-chart title="A line chart showing component usage" width="800" height="500">
    <ids-empty-message slot="empty-message"icon="empty-no-data" hidden>
        <ids-text type="h2" font-size="20" label="true" slot="label">No Data Right Now</ids-text>
    </ids-empty-message>
</ids-axis-chart>
```

Another type of chart you can use is a sequential color chart. A sequence of colors is used to represent various concepts of range in low-high density, quantity, and concentration situations. I.E. The data is highly related and should be represented with a single color.

To achieve this it is recommended to use the `color` setting and pick one of the Ids Colors in the color palette and use variables in its range. For example:

```js
[{
   "data": [],
   "name": "Component A",
   "color": "var(--ids-color-palette-azure-60)
 }, {
   "data": [],
   "name": "Component B",
   "shortName": "Comp B",
   "abbreviatedName": "B",
   "color": "var(--ids-color-palette-azure-40)"
 }, {
   "data": [{
   ],
   "name": "Component C",
   "color": "var(--ids-color-palette-azure-20)"
 }]
```

## Class Hierarchy

- IdsAxisChart
    - IdsElement
- Mixins
  IdsEventsMixin
  IdsLocaleMixin
  IdsThemeMixin

## Data Settings

The following data attributes can be used on the data passed to a chart.

- `data` {object} A data group with one or more `name` and `value` pairs.
- `shortName` {string} The short name of the legend text.
- `abbrName` {string} A very short name of the legend text (one or two characters).
- `color` {string} The color of this axis group. This can be either a hex value for example `#FF0000` or a color name like `red` or an ids variable like `var(--ids-color-palette-azure-20)`.

## Settings

- `title` {string} Sets the internal title of the chart (for accessibility).
- `height` {number} Generally this is calculated automatically but can be used to set a specific height.
- `width` {number} Generally this is calculated automatically but can be used to set a specific width.
- `textWidths` {object} Generally this is calculated automatically but can be overridden by setting the amount of space to allocate for margins on the `{ left, right, top, bottom }` sides.
- `textWidths` {object} Generally this is calculated automatically but can be overridden by setting the amount of space to allocate for text on the `{ left, right, top, bottom }` sides.
- `yAxisMin` {number}  Set the minimum value on the y axis  (default: 0)
- `showVerticalGridLines` {boolean}  Show the vertical axis grid lines (default: false)
- `showHorizontalGridLines` {boolean}  Show the horizontal axis grid lines (default: true)
- `yAxisFormatter` {object | Function} Sets the format on the y axis items. This can either be settings that are passed to `Intl.NumberFormat` or a formatter function. The formatter function will get three parameters (value, data, api) and should return a string based on the axis value. The y axis is not always a number so it does not default to `Intl.NumberFormat`. The default is `{ notation: 'compact', compactDisplay: 'short' }`.
- `xAxisFormatter` {Function} Sets the format on the x axis items. The formatter function will get three parameters (value, data, api) and should return a string based on the axis value. The x axis is not always a number so it does not default to `Intl.NumberFormat`. See the [Intl.NumberFormat api](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat) for more details and examples on formatting options.

## Events

- `rendered` Fires each time the chart is rendered or rerendered (on resize).

## Themeable Parts

- `container` the outer container div element
- `chart` the svg outer element

## States and Variations

- Theme
- Legends

## Responsive Guidelines

- Sizes to the given width/height defaulting to that of the immediate parent.

## Why Not Canvas?

We decided to use SVG over Canvas because of the following reasons:

- Canvas is not part of the DOM thus not accessible by screen readers.
- Canvas is more difficult to make interactive and responsive.
- Would be generally more maintainable.
- SVG output is easier to debug.
