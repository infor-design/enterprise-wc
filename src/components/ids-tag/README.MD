# Ids Tag Component

## Description

Tags are UI embellishments that are used to label, categorize and organize keywords surrounding
some contextual element such as a form.

## Import

```js
import IdsTag from 'mode_modules/ids-enterprise-wc/components/ids-tag/ids-tag';
```

## Use Cases

 Note that the tags and badges look the same but should not be used interchangeably. A badge is used mainly for alphanumeric values i.e. numbers currency ect. and should not cannot take an icon or text. For text information you can use use a tag. For icons use an icon or status icon or alert icon.

- Use when the content on your page is mapped into multiple categories and does not only fit into one hierarchical category.
- Use when you want users to contribute data to your website and let them organize their content themselves.

## Dos and Don'ts

- Overcrowd your content with tags, so people can see the items clearly.
- Don't use too many tags in order to use them clearly to capture what its tagging.

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
<ids-tag color="secondary">Secondary Tag</ids-tag>
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

## Settings (Attributes)

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

## Converting from Previous Versions (Breaking Changes)

**3.x to 4.x**

- Tag was implemented in v4.0.0
- Tag can be invoked with `$('#my-element').tag()`.

**4.x to 5.x**

- Tags are now custom elements `<ids-tag color="error>Text</ids-tag>`
- If using events events are now plain JS events. `beforetagremove`, `tagremove`, `aftertagremove`
- If using properties/settings these are now attributes: `dismissible`, `color`
- Can now be imported as a single JS file and used with encapsulated styles

## Designs

[Design Specs 4.5](https://www.figma.com/file/yaJ8mJrqRRej8oTsd6iT8P/IDS-(SoHo)-Component-Library-v4.5?node-id=760%3A771)
[Design Specs 4.6](https://www.figma.com/file/ok0LLOT9PP1J0kBkPMaZ5c/IDS_Component_File_v4.6-(Draft))

## Accessibility Guidelines

- 1.4.1 Use of Color - Color is not used as the only visual means of conveying information, indicating an action, prompting a response, or distinguishing a visual element. Ensure the color tags that indicate state like OK, cancel, ect have other ways to indicate that information. This is failing.
- 1.4.3 Contrast (Minimum) - The visual presentation of text and images of text has a contrast ratio of at least 4.5:1.   Ensure the color tags pass contrast.

## Regional Considerations

Labels should be localized in the current language. The close and link icons will flip to the alternate side in Right To Left mode. Consider that in some languages text may be a lot longer (German). And in some cases it cant be wrapped (Thai).
