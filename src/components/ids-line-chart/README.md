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

- **Tag**: A UI embellishments for classification
- **Clickable/Dismissible**: Tag can be closed and removed with an X button
- **Classification**:  How tags are labelled with colors and text
- **Disabled**: Tag can be disabled so it cannot be followed or clicked.

## Features (With Code Examples)

A normal tag used as a web component.

```html
<ids-tag>Normal Tag</ids-tag>
```

A normal tag used using just the css. This is limited to normal tags only.

```html
<span class="ids-tag">Normal Tag</span>
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

- 3.x: Tags have all new markup and classes.
- 4.x: Tags have all new markup and classes for web components.

## Designs

[Design Specs 4.5](https://www.figma.com/file/yaJ8mJrqRRej8oTsd6iT8P/IDS-(SoHo)-Component-Library-v4.5?node-id=760%3A771)
[Design Specs 4.6](https://www.figma.com/file/ok0LLOT9PP1J0kBkPMaZ5c/IDS_Component_File_v4.6-(Draft))

## Accessibility Guidelines

- 1.4.1 Use of Color - Color is not used as the only visual means of conveying information, indicating an action, prompting a response, or distinguishing a visual element. Ensure the color tags that indicate state like OK, cancel, ect have other ways to indicate that information. This is failing.
- 1.4.3 Contrast (Minimum) - The visual presentation of text and images of text has a contrast ratio of at least 4.5:1.   Ensure the color tags pass contrast.

## Regional Considerations

Labels should be localized in the current language. The close and link icons will flip to the alternate side in Right To Left mode. Consider that in some languages text may be a lot longer (German). And in some cases it cant be wrapped (Thai)

## Why Not Canvas?

We decided to use SVG over Canvas because of the following reasons:

- Canvas is not part of the DOM thus not accessible by screen readers.
- Canvas is more difficult to make interactive and responsive.
- Would be generally more maintainable.
- SVG output is easier to debug.
