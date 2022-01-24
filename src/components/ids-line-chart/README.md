# Ids Axis Chart Component

## Description

A line chart or line graph is a type of chart which displays information as a series of data points connected by straight line segments. Often Line charts convey a series of data over periods over time. Line charts can use both single and multiple variables to emphasize trends over several series. Users can interact by clicking or tapping on chart lines to focus on a certain series of data on a line chart. And users can also interact by hovering data points to reveal additional information in a tooltip.

For more information on line charts check out the article [Line Charts Made Simple](https://uxdesign.cc/line-chart-design-made-simple-a1b823510674).

## Use Cases

- Use when you want to show change over time.
- Use when you want to show trends.
- Use when you want to show comparison of change for several groups.
- Use when you want to aid prediction.

## Usage Considerations

- Do not show too many lines at once as it may be difficult to interpret.
- Hover tooltips should only be used to reveal additional non-critical information.

## Terminology

- **Marker**: A UI embellishments that shows the data points (i.e. the dots on a line chart).
- **Domain**: The domain is all x-values (the values of the graph from left to right)
- **Range**: The domain is all y-values (the values of the graph from down to up)
- **Scale**: The range of values in the graph (the values of the graph from down to up) and the amount of steps between each value.

## Features (With Code Examples)

A line chart is defined with a custom element with a width and height.

```html
<ids-axis-chart title="A line chart showing component usage" width="800" height="500"></ids-axis-chart>
```

Datasets can be added to the line chart by passing in an array of objects. Each object must have a `data` and object with `name` and `values` from the data points. Also a name should be given for each data object which will be used as the legend text. The `shortName` is used to show the short name of the legend text and the `abbrName` is used to show an even shorter name of the legend text in responsive situations.

```html
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
}];

document.querySelector('ids-line-chart').data = lineData;
```

## Class Hierarchy

- IdsLineChart
    - IdsAxisChart
        - IdsElement
- Mixins
  IdsEventsMixin
  IdsLocaleMixin
  IdsThemeMixin

## Settings

- `title` {string} Sets the internal title of the chart (for accessibility).
- `height` {number} Generally this is calculated automatically but can be used to set a specific height.
- `width` {number} Generally this is calculated automatically but can be used to set a specific width.
- `textWidths` {object} Generally this is calculated automatically but can be overridden by setting the amount of space to allocate for margins on the `{ left, right, top, bottom }` sides.
- `textWidths` {object} Generally this is calculated automatically but can be overridden by setting the amount of space to allocate for text on the `{ left, right, top, bottom }` sides.
- `yAxisMin` {number}  Set the minimum value on the y axis  (default: 0)
- `showVerticalGridLines` {boolean}  Show the vertical axis grid lines (default: false)
- `showHorizontalGridLines` {boolean}  Show the horizontal axis grid lines (default: true)

## Events

- `rendered` Fires each time the chart is rendered or rerendered (on resize).

## Themeable Parts

- `chart` the svg outer element
 * @part svg - the outside svg element
 * @part marker - the dots/markers in the chart
 * @part line - the lines in the chart
## States and Variations

- Color
- Disabled
- Animation
- Marker Style

## Keyboard Guidelines

- <kbd>Tab/Shift+Tab</kbd>: If the tab is focusable this will focus or unfocus the markers and legend elements
- <kbd>Space</kbd>: If a marker or legend is focused this act as if clicking it.

## Responsive Guidelines

- Sizes to the given width/height defaulting to that of the immediate parent. In smaller breakpoints the abbreviated name(s) will be shown.

## Converting from Previous Versions (Breaking Changes)

**3.x to 4.x**
- The line chart was added after version 3.6 so new in 4.x and had a new way to invoke it.

**5.x to 5.x**
- Line Chart now uses all new markup and classes for web components (see above)
- Now called IdsAccordion with a namespace
- The data object is the same format except for two changes.
    - `legendShortName` is now `shortName`
    - `legendAbbrName` is now `abbrName`

## Designs

[Design Specs 4.5](https://www.figma.com/file/yaJ8mJrqRRej8oTsd6iT8P/IDS-(SoHo)-Component-Library-v4.5?node-id=760%3A771)
[Design Specs 4.6](https://www.figma.com/file/ok0LLOT9PP1J0kBkPMaZ5c/IDS_Component_File_v4.6-(Draft))

## Accessibility Guidelines

- 1.4.1 Use of Color - Color is not used as the only visual means of conveying information, indicating an action, prompting a response, or distinguishing a visual element. Ensure the color tags that indicate state like OK, cancel, ect have other ways to indicate that information.

## Regional Considerations

Chart labels should be localized in the current language. The chart will flip in RTL mode. For some color blind users the svg patterns should be used.
