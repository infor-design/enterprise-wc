# Ids Text Component

## Description

This component styles arbitrary text elements using the design guidelines.

## Use Cases

- When you need static text on a page
- When you need disabled appearing text in a page
- When you need text to display status state in a page

## Typography

Typography is used to present content in a variety of styles and size, and is essential for establishing information hierarchies, ensuring readability, and creating consistency within the content of Infor products. Typography works in tandem with icons, colors, and user patterns to create a clear landscape of what is possible in any given application.

### Typography Usage

Typography in our design system is presented as a series of variants which can be mixed and matched to create different font styles for different copy on your product. Text sizes range from 10 to 72, with thick and thin weights. Infor Design System uses the Source Sans Pro font, which is a friendly and approachable sans serif that brings a human touch to our enterprise software.

Each typographical style contains two size values. The first denotes the size of the type, while the second denotes the corresponding line height, which is shown as 125% of the type size.

See “Variations” for more detail about our typography and use cases.

### Display Text - Brand use only

Ranging from 40 to 72 in size, these are meant for display in presentations and marketing materials. They are not used in applications or apps.

### Heading Text

Ranging from 20 to 32 in size, heading text can have a weight of 400 or 600. These are meant for title text in applications, and might be seen on a masthead, application header, or widget title. We recommend that these sizes only be used as titles, rather than as paragraph or body text.

### Body text

Ranging from 14 to 16 in size, body text can have a weight of 400 or 600. These are meant for display in applications and apps. Our most used text size is 16, which works well for body text in cards, tabs, modals and many other components. Captions or small text are 14.

### Body Text (All Caps)

Ranging from 10 to 12 in size, small text can have a weight of 300 or 600. Due to its small size, this body text contains all capital letters to improve readability and fit accessibility standards. While these sizes can be used for captions, we recommend using them sparingly due to their reduced visibility.

### Quick Reference

|Name|Size (px)|Weight|Line Height|Capitalization|
|----|---------|------|-----------|--------------|
Display 01|72|300|91|Normal
Display 02|60|300|75|Normal
Display 03|48|300|60|Normal
Display 04|40|300|50|Normal
Heading 32|32|400|40|Normal
Heading 32 Bold|32|600|40|Normal
Heading 28|28|400|35|Normal
Heading 28 Bold|28|600|35|Normal
Heading 24|24|400|30|Normal
Heading 24 Bold|24|600|30|Normal
Heading 20|20|400|25|Normal
Heading 20 Bold|20|600|25|Normal
Body Text|16|400|20|Normal
Body Text Bold|16|600|20|Normal
Body SM|14|400|18|Normal
Body SM Bold|14|600|18|Normal
Small Text 01|12|400|15|Uppercase
Small Text 01 Bold|12|600|15|Uppercase
Small 02|10|400|13|Uppercase
Small 02 Bold|10|600|13|Uppercase

### Colors

When using color in type, make sure to follow the guidelines below:

1. Text color should have adequate contrast to its background. You can test the contrast [here](https://www.tpgi.com/color-contrast-checker/).
2. Do not use alert colors unless the text corresponds to an alert.
3. Text colors should be mapped to a style token in IDS to ensure consistency.

### Common variations

While most text will appear in Slate 08 and fall within the type styles defined above, text color may also take the following variations in certain circumstances:

1. Descriptive Text

This is the most frequently-used text color and serves as the default for short phrases and longer paragraphs. The color used for descriptive text is usually Slate 10.

2. Linked Text

This is an interactive link to another page in Infor software or to external webpages. Please refer to the hyperlink documentation for further details. Text is underlined and is in Azure 06.

3. Muted Text

This shows disabled functions; this text cannot be edited when it shows in an input area. The color for muted or disabled text should appear in a Slate tone lighter than the descriptive text (usually 06 or lighter).

4. Alert Text

This serves as notification text that tells users of changes, errors, or updates. The color for this text is Status 01 (Ruby 06).

5. Strong Text

This is heavily weighted text, used to make terms or phrases stand out. This text will appear with a weight of 600. Because of its increased weight, strong text has more flexibility with its contrast to the background.

### Visual Guidelines

Take readability and line length into consideration when designing and working with all Infor CloudSuite applications. We suggest keeping text between 50-75 characters per line.

### Typography References

Learn more about this topic [here](https://www.interaction-design.org/literature/article/web-fonts-are-critical-to-the-online-user-experience-don-t-hurt-your-reader-s-eyes).

## Terminology

- **Text**: A a human-readable sequence of character s and the words
- **Disabled**: Text can be disabled, this is usually done with some other element in mind. For example a disabled field label
- **Audible**: Text that does not appear in the page but is read by users with screen readers in order to give them information.

### Text alignments

Sets the horizontal alignment of the content inside a block element, setting can be specified in one of the following ways:

- **Start**: It is same as left if direction is left-to-right and right if direction is right-to-left.
- **End**: It is same as right if direction is left-to-right and left if direction is right-to-left.
- **Center**: The content will be center align.
- **Justify**: The content will be justified. Text should be spaced to line up its left and right edges to the left and right edges, except for the last line.

### Text status

Text can be display the status state in a page. It will show bullet character along text. Text and bullet both are display in various colors based on type of status, available options are as:

- **Base**: Show the base status, normal color for bullet and text.
- **Error**: Show the error status, error color for built and text.
- **Info**: Show the info status, info color for built and text.
- **Success**: Show the success status, success color for built and text.
- **Warning**: Show the warning status, warning color for built and text.

## Features (With Code Examples)

A normal text element used as a web component in size 16px.

```html
<ids-text font-size="16">Normal Text</ids-text>
```

A Disabled appearing text element.

```html
<ids-text disabled="true">Disabled Text</ids-text>
```

Using the data/label.
```html
<ids-text label="true">Title</ids-text>
<ids-text data="true">Some random data</ids-text>
```

Using the text alignments.
```html
<ids-text text-align="end">Some text display as end align</ids-text>
```

Using the text status.
```html
<ids-text status="error">Error</ids-text>
```

## Settings and Attributes

- `type` {boolean} Set the type of element it is usually h1-h6. Defaults to span
- `audible` {string} Set `audible` string (screen reader only text)
- `disabled` {boolean} Set the text to disabled in appearance
- `fontSize` {string} Set the size of font to use (in pixels) we use design tokens for this in specific increments [10 | 12 | 14 | 16 | 20 | 24 | 28 | 32 | 40 | 48 | 60 | 72 ]
- `mode` {string} Set the theme mode
- `version` {string} Set the theme version
- `color` {string} If set to `unset`, the CSS color will be `'unset'` allowing you to color with surrounding content. If set to "muted" will apply as disabled color.
- `color-variant` {string} can be set to "alternate" to display contrasting color for text via the [IdsColorVariantMixin](../../src/mixins/ids-color-variant/README.md)
- `data` {boolean} Sets the css of the text to the according theme
- `label` {boolean} Sets the css of the text to the according theme
- `text-align` {string} Sets the text alignments `start`, `end`, `center`, `justify`
- `status` {string} Sets the text status `base`, `error`, `info`, `success`, `warning`

## Themeable Parts

- `text` allows you to further style the text element

## States and Variations (With Code Examples)

- Audible
- Size
- Disabled
- Color Variant (alternate)
- Status
- Text alignment

## Keyboard Guidelines

Text is not keyboard focusable so has no keyboard shortcuts.

## Responsive Guidelines

- Flows with padding and margin within the width and height of the parent container. Possibly scrolling as needed based on parent dimensions.

## Converting from Previous Versions

- 3.x: Did not exist
- 4.x: Convert spans/ h1-h6 to use the web component with types

## Accessibility Guidelines

- 1.4.1 Use of Color - Color is not used as the only visual means of conveying information, indicating an action, prompting a response, or distinguishing a visual element. Ensure the color tags that indicate state like OK, cancel, ect have other ways to indicate that information. This is failing.
- 1.4.3 Contrast (Minimum) - The visual presentation of text and images of text has a contrast ratio of at least 4.5:1.   Ensure the color tags pass contrast.

## Regional Considerations

Text should be localized in the current language. And should flip to the alternate side in Right To Left mode. Consider that in some languages text may be a lot longer (German). And in some cases it cant be wrapped (Thai).
