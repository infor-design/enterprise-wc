# ids-tooltip

## Description

Tooltips are a component thats used in conjunction with other components to show additional information and non critical information related to an element such as a button or field. A tooltip will displays information on either hover, tab and/or focus. In this version we have separated the tooltip from popups.

## Use Cases

- Displays additional non critical information thats not discernible from the interface/design.

## Terminology

- **Popup**: Any thing that popups up and positions use the ids-popup component
- **Tooltip**: A message which appears when a cursor is positioned over an icon, image, hyperlink, or other element in a graphical user interface.

## Features (With Code Examples)

A normal tooltip used as a web component attached to a button.

```html
<ids-button id="button-1">Example Button</ids-button>
<ids-tooltip target="button-1" placement="top">Additional Information</ids-tooltip>
```

A tooltip can also be used more conveniently for text only tooltips on inputs and buttons as a mixin.

```html
<ids-button id="button-1" tooltip="Additional Information">Example Button</ids-button>
```

A tooltips content can be set in a synchronous way with the textContent attribute.

```js
document.querySelector('#button-1').textContent = 'New Content';
```

A tooltips content can be set in an synchronous way with the beforeShow property.

```js
const dropdownAsync = document.querySelector('#dropdown-7');

dropdownAsync.beforeShow = async function beforeShow() {
  const url = '/data/bikes.json';
  const res = await fetch(url);
  const data = await res.json();
  return data[1].manufacturerName;
};
```

A tooltips can be manually set to visible, but it still needs an alignment target to do so.

```js
document.querySelector('#button-1').visible = true;
```

## Usage Guidance

- Do not show critical information in a tooltip or use it for functionality, it should be strictly for supplemental information
- Write concise tooltip text. Imagine someone on a small screen or with high zoom needing to pan around just to read the tooltip.
- Avoid rich content. Formatting such as bold text, italics, headings, icons, etc. will not be conveyed through `aria-describedby` or `aria-labelledby`.
- No interactive content. Any interactive content such as links or buttons should not be placed within a tooltip.

## Settings and Attributes

- `delay` {string | number} Set how long after hover you should delay before showing
- `placement` {string} Sets the tooltip placement between left, right, top, bottom
- `target` {string | HTMLElement} Set the target element via a css selector or HTMLElement
- `trigger` {string} Set trigger agains the target between hover, click and focus
- `visible` {string | boolean} Set tooltip immediately to visible/invisible

## Events

- `beforeshow` Fires just before the tooltip is shown (veto-able if returning false from the detail event)
- `show` Fires at the time the ids-tooltip is shown
- `aftershow` Fires after the tooltip is fully shown
- `hide` Fires at the time the ids-tooltip is trying  to hide
- `afterhide` Fires after the tooltip is fully hidden

## Callbacks

- `onHide` Fires when the tooltip is hidden

## Themeable Parts

- `popup` allows you to further style the popup container element
- `tooltip` allows you to further style the tooltip element

## States and Variations (With Code Examples)

- Color
- Open
- Closed

## Keyboard Guidelines

- <kbd>Tab/Shift+Tab</kbd>: If the element tooltip is showing on focus then this will cause the tooltip to appear.

## Responsive Guidelines

- Tooltips do not work well in mobile or in responsive situations and should be avoided. But the tooltip will attempt to adjust to fit the page as the popup menu allows.

## Converting from Previous Versions (Breaking Changes)

**3.x to 4.x**

- Tooltips were implemented in v4.0.0
- Tooltips have all new markup and classes, and can be invoked with `$('#my-element').tooltip()`.

**4.x to 5.x**

- Tooltip is now a custom element `<ids-tooltip></ids-tooltip>`
- There is no longer a "KeepOpen" setting, instead add a component to the page and use `visible=true`
- Tooltip can be used as a mixin or standalone component
- Tooltip is no longer shared with popups so all options related to that are removed
- Error Tooltips are removed/not needed at this time
- attachToBody option is removed/not needed at this time
- Content can now be set with `tooltipElem.textContent`
- Instead of open and close use `tooltipElem.visible=true`
- `aftershow` event was not needed as its the same as `show`, so this has been removed
- `showOnKeyboardFocus` is now `trigger="focus"`

## Accessibility Guidelines

For a good article on making the tooltip accessible see [Tooltips WCAG 2.1](https://sarahmhigley.com/writing/tooltips-in-wcag-21/)

To make the tooltip accessible we do the following:

We use `aria-describedby` or `aria-labelledby` to associate the UI control with the tooltip. Do not put essential information in tooltips.

The following general rules apply:

- Do not add interactive content (buttons/links ect) in a hyperlink
- Only interactive elements should trigger tooltips. While disabled tooltips do work on hover they do not work on focus so are not accessible and should be avoided.- Tooltip text is purely supplemental, and should not override the existing accessible name for a control.

## Regional Considerations

Tooltips should be localized in the current language. Consider that in some languages text may be a lot longer (German). And in some cases it cant be wrapped (Thai).
