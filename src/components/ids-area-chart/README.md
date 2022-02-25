# Ids Area Chart Component

## Description

An area chart like a line chart is used to displays information as a series of data points connected by straight line segments. Often area charts are used to show trends. Area charts should generally have more than one series to make a comparison. Users can interact by clicking or tapping on areas to drill in on a certain series of data. Users can also interact by hovering data points to reveal additional information in a tooltip.

It may be easier to see and understand the data with the more colorful area chart instead of a line chart if the differences between your data values are large enough to be displayed visually.

## Use Cases

- Display large differences between your data points
- Show multiple values over time
- Plot data over a longer period of time
- Explain how multiple data points relate to the total value

## Usage Considerations

- Do not show too many areas at once as it may be difficult to interpret.
- Hover tooltips should only be used to reveal additional non-critical information.
- Area (and line) charts should not be used not show different groups of data.

## Terminology

- **Marker**: A UI embellishments that shows the data points (i.e. the dots on a line chart).
- **Area**: The filled / colored area of the lines below the marker
- **Domain**: The domain is all x-values (the values of the graph from left to right)
- **Range**: The domain is all y-values (the values of the graph from down to up)
- **Scale**: The range of values in the graph (the values of the graph from down to up) and the amount of steps between each value.

## Features (With Code Examples)

An area chart is defined with the custom element and width and height.

```html
<ids-area-chart title="An area chart showing component usage" width="800" height="500"></ids-area-chart>
```

Datasets can be added to the area chart by passing in an array of objects. Each object must have a `data` and object with `name` and `values` to form the data points. Also a name should be given for each data object which will be used as the legend text. The `shortName` is used to show the short name of the legend text and the `abbrName` is used to show an even shorter name of the legend text in responsive situations.

```js
const lineData2 = [{
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
}, {
  data: [{
    name: 'Jan',
    value: 0
  }, {
    name: 'Feb',
    value: 4
  }, {
    name: 'Mar',
    value: 2
  }, {
    name: 'Apr',
    value: 6
  }, {
    name: 'May',
    value: 8
  }, {
    name: 'Jun',
    value: 20
  }],
  name: 'Component B',
  shortName: 'Comp B',
  abbrName: 'B',
}];

document.querySelector('ids-line-chart').data = lineData;
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
   "legendShortName": "Comp B",
   "legendAbbrName": "B",
   "color": "var(--ids-color-palette-azure-40)"
 }, {
   "data": [{
   ],
   "name": "Component C",
   "color": "var(--ids-color-palette-azure-20)"
 }]
```

## Class Hierarchy

- IdsAreaChart
    - IdsLineChart
        - IdsAxisChart
            - IdsElement
- Mixins
  IdsEventsMixin
  IdsLocaleMixin
  IdsThemeMixin

## Data Settings

(See Line Chart and Axis Chart Settings for more information)

## Settings

(See Line Chart and Axis Chart Settings for more information)

## Events

(See Line Chart and Axis Chart Settings for more information)

## Methods

(See Line Chart and Axis Chart Settings for more information)

## Themeable Parts

- `svg` the outside svg element
- `marker` each dots/marker element in the chart
- `lines` each line element in the chart

## Animation

The line rise along the y-axis from 0 to the appropriate values. The area below the line fills up as the line rises.

## States and Variations

(See Line Chart and Axis Chart Settings for more information)

## Keyboard Guidelines

(See Line Chart and Axis Chart Settings for more information)

## Responsive Guidelines

- The area chart will fill the size of its parent container and readjust when the window is resized.

## Converting from Previous Versions (Breaking Changes)

- 4.x: The area chart was added after version 3.6 so new in 4.x
- 5.x: Area Chart have all new markup and classes for web components but the data is still the same except for a few changes.
    - `legendShortName` is now `shortName`
    - `legendAbbrName` is now `abbrName`

## Designs

[Design Specs 4.5](https://www.figma.com/file/yaJ8mJrqRRej8oTsd6iT8P/IDS-(SoHo)-Component-Library-v4.5?node-id=760%3A771)
[Design Specs 4.6](https://www.figma.com/file/ok0LLOT9PP1J0kBkPMaZ5c/IDS_Component_File_v4.6-(Draft))

## Accessibility Guidelines

- 1.4.1 Use of Color - Color is not used as the only visual means of conveying information, indicating an action, prompting a response, or distinguishing a visual element. Ensure the color tags that indicate state like OK, cancel, ect have other ways to indicate that information.

## Regional Considerations

Chart labels should be localized in the current language. The chart will flip in RTL mode. For some color blind users the svg patterns can be used.
