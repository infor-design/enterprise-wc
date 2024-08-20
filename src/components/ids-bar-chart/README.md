# ids-bar-chart

## Description

An bar chart is used to display relational information quickly for a quantity across a particular category. Users can interact by clicking or tapping on bars to drill in on a certain series of data. Users can also interact by hovering bars to reveal additional information in a tooltip. The x-axis could be any variable, such as time, or the category that is being measured.

Grouped bar graphs, also called clustered bar graphs, represent discrete values for more than one item that share the same category. For example a grouped bar graph could display several categories within each main category such as male and female, within certain traits on the x-axis. To make a grouped bar chart provide the appropriately formatted data.

Stacked bar graphs or composite bar graphs divide an aggregate total into parts. Each segment adds to the total of the bar and are separated by different colors. To make a stacked bar chart use `stacked="true"` and provide the appropriately formatted data.

## Use Cases

- Display an earnings per share (EPS)
- Compare revenue or cash flow over time
- Compares series through a visual representation of data in columns.
- Quickly compares trends in a variety of ways

## Usage Considerations

- Do not show too many bars or too many categories or segments or the data may be hard to read.
- Hover tooltips should only be used to reveal additional non-critical information.

## Terminology

- **Bar**: The UI element that represents a concrete value in a color.
- **Category**: The section for each bar when grouping.
- **Segment**: The section for each bar value when stacking

## Features (With Code Examples)

An bar chart is defined with the custom element and width and height.

```html
  <ids-bar-chart title="A bar chart showing component usage" show-vertical-grid-lines="true" width="800" height="500" id="index-example"></ids-bar-chart>
```

Datasets can be added to the bar chart by passing in an array of objects. Each object must have a `data` and object with `name` and `values` to form the data points. Also a name should be given for each data object which will be used as the legend text. The `shortName` is used to show the short name of the legend text and the `abbrName` is used to show an even shorter name of the legend text in responsive situations.

```js
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

document.querySelector('ids-bar-chart').data = dataset;
```

A chart can also be `stacked` or `grouped`. Stacked bar graphs or composite bar graphs divide an aggregate total into parts. Each segment adds to the total of the bar and are separated by different colors.

To make a stacked bar chart use `stacked="true"` and provide the appropriately formatted data.

## Class Hierarchy

- IdsBarChart
  - IdsAxisChart
    - IdsElement
- Mixins
  IdsEventsMixin
  IdsLocaleMixin

## Data Settings

(See  Axis Chart Settings for more information)

## Settings

- `barPercentage` {number} A percent (0-1) of the available width each bar should be within the category width. 1.0 will take the whole category width and put the bars right next to each other. In a grouped chart the barPercentage value, will use as whole category percentage. We change the defaults depending on stacked or grouped bar charts but this can be adjusted to change the bar sizes.
- `categoryPercentage` {number} Percent (0-1) of the available width for each category section. We change the defaults depending on stacked or grouped bar charts.
- `horizontal` {boolean} Flips the orientation to horizontal.

The following shows the relationship between the bar percentage option and the category percentage option.

```sh
// categoryPercentage: 1.0
// barPercentage: 1.0
Bar:        | 1.0 | 1.0 |
Category:   |    1.0    |
Section:    |===========|

// categoryPercentage: 1.0
// barPercentage: 0.5
Bar:          |.5|  |.5|
Category:  |      1.0     |
Section:   |==============|

// categoryPercentage: 0.5
// barPercentage: 1.0
Bar:             |1.0||1.0|
Category:        |   .5   |
Section:    |==================|
```

- `stacked` {boolean} Set to true to make a stacked bar chart.
- `grouped` {boolean} Set to true to make a grouped bar chart.

(See Axis Chart Settings for other shared settings)

## Patterns

The bar chart includes patterns that can be used for color blind users. We plan on adding this to other charts as well.
To use a pattern specify it on the `pattern` attribute it in the data. You can also set a `patternColor` otherwise it will use the default color for that item in the series.

```js
const data = [{
  data: [{
    name: 'Jan',
    value: 1
  }, {
    name: 'Feb',
    value: 2
  }],
  name: 'Component A',
  pattern: 'circles',
  patternColor: '#DA1217'
}];
```

The following patterns are supported:

```sh
arrows
boxes
checkers
patches
circles
exes
diamonds
dots
stars
mixed
squares
hex
big-hex
intersect
lines
bars
pipes
mesh
pluses
waves
big-waves
```

Showing component as horizontal orientation.

```html
<ids-bar-chart
  horizontal
  width="700"
  height="400"
  id="bar-horizontal-example"
  title="Horizontal example"
></ids-bar-chart>
```

## Events

(See Axis Chart Settings for more information)

## Methods

(See Axis Chart Settings for more information)

## Themeable Parts

- `svg` the outside svg element
- `bar` each bar element  in the chart
- `lines` each line element in the chart

## Animation

The bars rise along the y-axis from 0 to the appropriate values.

## States and Variations

(See Line Chart and Axis Chart Settings for more information)

## Keyboard Guidelines

(See Line Chart and Axis Chart Settings for more information)

## Responsive Guidelines

- The area chart will fill the size of its parent container and readjust when the window is resized.

## Converting from Previous Versions (Breaking Changes)

- 4.x: The area chart was added after version 3.6 so new in 4.x
- 5.x: Bar Chart have all new markup and classes for web components but the data is still the same except for a few changes.
  - `shortName` is now `shortName`
  - `abbreviatedName` is now `abbrName`

## Accessibility Guidelines

- 1.4.1 Use of Color - Color is not used as the only visual means of conveying information, indicating an action, prompting a response, or distinguishing a visual element. Ensure the color tags that indicate state like OK, cancel, ect have other ways to indicate that information.
- Approach is to treat the bar items as a list `role="list"`. The bar items are `role="listitem"`. The tab index is not visible to the user as it is not needed and can be navigated with a screen reader.
- Using voice over the sequence is to
  - Navigate to the parent element above it  or parent page
  - Hold <kbd>caps lock + left/right arrow</kbd>
  - You will hear the title , followed by number of items and then each list item
  - Proceed to use <kbd>caps lock + left/right arrow</kbd> will move through the list items announcing the values

## Regional Considerations

Chart labels should be localized in the current language. The chart will flip in RTL mode. For some color blind users the svg patterns can be used.
