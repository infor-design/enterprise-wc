# Ids Pie/Donut Chart Component

## Description

A pie chart (or a circle chart) is a circular statistical graphic which is divided into slices to illustrate numerical proportion. In a pie chart, the arc length of each slice is proportional to the quantity it represents.

The pie chart can be made into a donut chart by setting the `donut` setting. A donut chart is almost identical to a pie chart, but the center is cut out (hence the name `donut`). Donut charts are also used to show proportions of categories that make up the whole, but the center can also be used to display a data label.

You can control the size of the pie/donut chart by setting the size of the parent element the pie chart lives in. This may include possibly using an inset margin in some cases.

Hovering a chart slice with show a tooltip with the slice's value. This data is also shown as a percentage in the legend.

## Use Cases

- Showcasing part-to-whole relationships.
- Compare any type of content or data that can be broken down into comparative categories Revenue, demographics, market shares, survey results
- Display different data points that total 100%

## Usage Considerations

- You don’t want to display more than six categories of data or the pie chart can be difficult to read and compare the relative size of slices.
- If you have a lot of smaller slices this can be difficult to read.
- Hover tooltips should only be used to reveal additional non-critical information.

## Terminology

- **Slice**: The pieces of the pie in a pie style chart represented by an individual data point
- **Arcs**: The lengths of the slices in a donut style chart represented by an individual data point
- **Donut**: The center is cut out on a pie chart too look like a donut

## Features (With Code Examples)

An pie chart is defined with the custom element. By default it will size to the parent element but a width and height can also be set.

```html
<ids-pie-chart title="A pie chart showing component usage" id="index-example" suppress-tooltips="true"></ids-pie-chart>
```

Datasets can be added to the pie chart by passing in an array of objects. Each object must have a `data` and object with `name` and `values` to form the data points. Other information like the `color`, `tooltip` or accessible `pattern` can be provided.

```js
const data = [{
   "data": [{
     "name": "Item A",
     "tooltip": "<b>Item A</b> ${percent}%",
     "value": 10.1,
     "pattern": "mesh"
   },{
     "name": "Item B",
     "tooltip": "<b>Item B</b> ${value}",
     "value": 12.2,
     "pattern": "mixed"
   }, {
     "name": "Item C",
     "tooltip": "<b>Item C</b> ${value}",
     "value": 14.35,
     "pattern": "lines"
   }];

document.querySelector('ids-pie-chart').data = lineData;
```

A chart can also be a `donut`. If used provided or `donut-text` for the center. Be consice since there isnt a lot of room.

## Class Hierarchy

- IdsPieChart
  - IdsElement
- Mixins
  IdsChartSelectionMixin
  IdsChartLegendMixin
  IdsLocaleMixin
  IdsEventsMixin

## Data Settings

The following data attributes can be used on the data passed to a chart. If using typescript the type is `IdsPieChartData`.

- `data` {object} A data group with one or more `name` and `value` pairs.
- `name` {string} The name for the legend text and tooltip representing the slice.
- `value` {number} The value of the slice, calculated to a whole of 100% with the other data points.
- `color` {string} The color of this axis group. This can be either a hex value for example `#FF0000` or a color name like `red` or an ids variable like `var(--ids-color-azure-20)`.
- `tooltip` {string} The custom tooltip string (as static text). See the tooltip section for more information.
- `pattern` {string} The name of the pattern to show instead of a solid color. See the pattern section for more information.
- `patternColor` {string} The color to show for the pattern. This can be either a hex value for example `#FF0000` or a color name like `red` or an ids variable like `var(--ids-color-azure-20)`.

## Settings

- `legendPlacement` {string} By default the legend will be placed to the right of the chart but it can also be set to `bottom` or `top` or `left`.
- `animated` {boolean} Disable the animation of the chart by setting this to false.
- `data` {Array} The data points to use as described previously
- `donut` {boolean} Set to true to make a donut chart.
- `donutText` {string} The text to showin the middle of the chart. Be consice since there isnt a lot of room.
- `height` {number} To set the height of the chart to a specific value in pixels.
- `width` {number} To set the width of the chart to a specific value in pixels.
- `title` {string} The topic of the chart. This will be used only for accessibility / screen readers and should always be set.
- `suppress-tooltips` {boolean} Disable the tooltips (they are currently experimental).
- `legendFormatter` {Function} A function to format the legend text for each data point.
- `selectable` {boolean} Sets the selection mode.

Here is an example of a pie chart with a legendFormatter.

```js
chart.legendFormatter = (slice, data) => {
  return `${slice.name}: ${slice.value}`;
}
```

## Patterns

The pie/donut chart includes patterns that can be used to assist color blind users. To use a pattern specify it on the `pattern` attribute it in the data. You can also set a `patternColor` otherwise it will use the default color for that item in the series.

```js
const data: [{
  "name": "Item C",
  "tooltip": "<b>Item C</b> ${value}",
  "value": 14.35,
  "pattern": "lines"
}, {
  "name": "Item D",
  "tooltip": "<b>Item D</b> ${value}",
  "value": 15.6,
  "pattern": "pipes"
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

However some look better than others when zoomed. So suggest:

```sh
mesh
circles
boxes
dots
mixed
lines
pipes
```

## Tooltip Customizations

You can customize the tooltip by changing some of the API settings. For just a static tooltip you can use the `tooltip` setting in the data at the same place as the `name` property.

If you need to change which items get tooltips you can override `tooltipElements` getter.

```js
tooltipElements() {
  return this.container.querySelectorAll('circle'); // return the ones that get events
}

If you need to change the tooltip contents you can override the `tooltipTemplate` function.

```js
tooltipTemplate() {
  return '<b>${label}</b> ${value}';
}
```

Or you can modify the tooltip in the slot.

## Events

- `rendered` Fires each time the chart is rendered or rerendered (on resize).
- `beforeselected` Fires before selected, you can return false in the response to veto.
- `selected` Fires after selected.
- `beforedeselected` Fires before deselected, you can return false in the response to veto.
- `deselected` Fires after deselected.

## Methods

- `rerender` Re render and reanimate the chart.
- `tooltipData` Override the data for the tooltip.
- `tooltipTemplate` Override the tooltip markup

## Themeable Parts

- `container` the outer container div element
- `chart` the svg outer element
- `circles` each circle element in the chart

## Animation

The slices animate clockwise with a cubic bezier curve at 600ms.

## States and Variations

- selected (future)
- disabled (future)

## Keyboard Guidelines

The legend items are focusable and can be navigated with the tabs keys.

## Responsive Guidelines

- The area chart will fill the size of its parent container and readjust when the window is resized to the parent using css/svg viewbox

## Converting from Previous Versions (Breaking Changes)

**4.x to 5.x**
- The pie chart was added after version 3.6 so new in 4.x

**4.x to 5.x**
- Pie component has changed to a custom element `<ids-pie-chart></ids-pie-chart>`
- Donut component has been combined with a setting `<ids-pie-chart donut="true" donut-text="Some Test"></ids-pie-chart>`
- If using events, events are now plain JS events.
- Can now be imported as a single JS file and used with encapsulated styles

## Accessibility Guidelines

- 1.4.1 Use of Color - Color is not used as the only visual means of conveying information, indicating an action, prompting a response, or distinguishing a visual element.
- Markup is to treat the pie slices as a list `role="list"`. The pie slices are `role="listitem"`. The tab index is not visible to the user as it is not needed and can be navigated with a screen reader.
- Using voice over the sequence is to
  - Navigate to the parent element above it  or parent page
  - Hold <kbd>caps lock + left/right arrow</kbd>
  - You will hear the title , followed by number of items and then each list item
  - Proceed to use <kbd>caps lock + left/right arrow</kbd> will move through the list items announcing the values
- The contrast and actual colors can be a concern for visibility impaired and color blind people. However, you can customize the color by passing higher contrast colors. Or you can add a pattern to the color with the `pattern` attribute.

## Regional Considerations

Chart labels should be localized in the current language. The chart will flip in RTL mode. Note that in RTL languages clockwise is the same so the chart slices / arcs are not rotated.  For some color blind users the svg patterns can be used.
