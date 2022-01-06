# Ids Line Chart Component

## Description

A line chart or line graph is a type of chart which displays information as a series of data points connected by straight line segments. Often Line charts convey a series of data over periods over time. Line charts can use both single and multiple variables to emphasize trends over several series. Users can interact by clicking or tapping on chart lines to focus on a certain series of data on a line chart. And users can also interact by hovering data points to reveal additional information.

For more information on line charts check out the article [Line Charts Made Simple](https://uxdesign.cc/line-chart-design-made-simple-a1b823510674).

## Use Cases

- Use when you want to show change over time.
- Use when you want to show trends.
- Use when you want to show comparison of change for several groups.
- Use when you want to aid prediction.

## Usage Considerations

- Do not show too many lines at once as it may be difficult to interpret.
- Hover tooltips should only be used to reveal additional information.

## Terminology

- **Marker**: A UI embellishments that shows the data points (i.e. the dots on a line chart).
- **Domain**: The domain is all x-values (the values of the graph from left to right)
- **Range**: The domain is all y-values (the values of the graph from down to up)
- **Scale**: The range of values in the graph (the values of the graph from down to up) and the amount of steps between each value.

## Features (With Code Examples)

A line chart is defined with the custom element and width and height.

```html
<ids-line-chart title="A line chart showing component usage" width="800" height="500"></ids-line-chart>
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

A colored tag is done by adding the `color` attribute and one of the following: secondary, error, success, caution or a hex color beginning with a # character.

```html
<ids-tag color="secondary">Secondary Tags</ids-tag>
<ids-tag color="error">Error Tag</ids-tag>
<ids-tag color="success">Success Tag</ids-tag>
<ids-tag color="caution">Warning Tag</ids-tag>
<ids-tag color="#EDE3FC">Custom Tag Color</ids-tag>
```

## Class Hierarchy

- IdsTag
    - IdsElement
- Mixins
  IdsEventsMixin
  IdsKeyboardMixin
  IdsThemeMixin

## Settings

- `clickable` {boolean} Turns on the functionality to make the tag clickable like a link
- `dismissible` {boolean} Turns on the functionality to add an (x) button to clear remove the tag
- `color` {string} Sets the color to a internal color such as `azure` or may be a hex starting with a `#`

## Events

- `beforetagremove` Fire before the tag is removed allowing to veto the action. Detail contains the element `elem` and the callback for vetoing
- `tagremove` Fires at the time the tag is removed. Detail contains the element `elem`
- `aftertagremove` Fires after the tag is removed from the DOM. Detail contains the element `elem`

## Methods

- `dismiss` Removes the tag from the page.

## Themeable Parts

- `checkbox` allows you to further style the checkbox input element
- `slider` allows you to further style the sliding part of the switch
- `label` allows you to further style the label text

## States and Variations

- Color
- Linkable
- Badge
- Disabled
- Closable

## Keyboard Guidelines

- <kbd>Tab/Shift+Tab</kbd>: If the tab is focusable this will focus or unfocus the tag.
- <kbd>Backspace / Alt+Del</kbd>: If the tag is dismissible then this will remove the tag.
- <kbd>Enter</kbd>: If the tag is clickable then this will follow the tag link.

## Responsive Guidelines

- Flows with padding and margin within the width and height of the parent container. Possibly scrolling as needed based on parent dimensions.

## Converting from Previous Versions

- 4.x: The line chart was added after version 3.6 so new in 4.x
- 5.x: Line Chart have all new markup and classes for web components but the data is still the same except for a few changes.
    - `legendShortName` is now `shortName`
    - `legendAbbrName` is now `abbrName`

## Designs

[Design Specs 4.5](https://www.figma.com/file/yaJ8mJrqRRej8oTsd6iT8P/IDS-(SoHo)-Component-Library-v4.5?node-id=760%3A771)
[Design Specs 4.6](https://www.figma.com/file/ok0LLOT9PP1J0kBkPMaZ5c/IDS_Component_File_v4.6-(Draft))

## Accessibility Guidelines

- 1.4.1 Use of Color - Color is not used as the only visual means of conveying information, indicating an action, prompting a response, or distinguishing a visual element. Ensure the color tags that indicate state like OK, cancel, ect have other ways to indicate that information. This is failing.

## Regional Considerations

Chart labels should be localized in the current language. The chart will flip in RTL mode. For some color blind users the svg patterns can be used.

## Why Not Canvas?

We decided to use SVG over Canvas because of the following reasons:

- Canvas is not part of the DOM thus not accessible by screen readers.
- Canvas is more difficult to make interactive and responsive.
- Would be generally more maintainable.
- SVG output is easier to debug.
