# Ids Skip Link Component

## Description

A skip link is a single element added first thing in your page. When the skip link is focused from the browser URL using <kbd>Tab</kbd>, it will activate allowing you to jump to a main section. The main content is not usually the first thing on a web page. Keyboard and screen reader users generally must navigate a long list of navigation links, sub-lists of links, corporate icons, site searches, and other elements before ever arriving at the main content. This is particularly difficult for users with some forms of motor disabilities.

For more details info on skip links see <a href="https://webaim.org/techniques/skipnav/" target="_blank">this article</a>.

## Use Cases

- When you want to add accessibility features to your application
- When you have a lot of content at the top of every page such as links/navigation/headers that may need to be jumped over when familiar with the page

## Terminology

- **Link/Hyperlink**: An interactive link to another page within Infor software to external destinations.
- **Skip Link**: An interactive link to jump past some page content

## Features (With Code Examples)

A normal skip link element as a custom element. That will link to a section with `id="main-content"` somewhere else in the page

```html
<ids-skip-link href="#main-content">Skip to Main Content</ids-skip-link>
```

## Settings and Attributes

- `href` {string} Set the links href to a url or file
- `mode` {string} Set the theme mode
- `version` {string} Set the theme version

## Themeable Parts

- `skiplink` allows you to further style the skip link element

## States and Variations (With Code Examples)

- Focused / Active

## Keyboard Guidelines

- When you <kbd>Tab</kbd> from the browser bar into the page the skip link will appear on and be focused
- <kbd>Enter</kbd> will follow the link to the `id` of the content area you specify

## Responsive Guidelines

- Skip links are fixed position

## Converting from Previous Versions

- 3.x: Used a skip link css class on `<a>` tags but is now a custom element
- 4.x: Used a skip link css class on `<a>` tags but is now a custom element

## Designs

[Design Specs](https://www.figma.com/file/ok0LLOT9PP1J0kBkPMaZ5c/IDS_Component_File_v4.6-(Draft))

## Accessibility Guidelines

- 1.4.1 Use of Color - Color is not used as the only visual means of conveying information, indicating an action, prompting a response, or distinguishing a visual element. Ensure the color tags that indicate state like OK, cancel, ect have other ways to indicate that information. This is failing.
- 1.4.3 Contrast (Minimum) - The visual presentation of text and images of text has a contrast ratio of at least 4.5:1.   Ensure the color tags pass contrast.

## Regional Considerations

Link text should be localized in the current language. And should flip to the alternate side in Right To Left mode. Consider that in some languages text may be a lot longer (German). And in some cases it cant be wrapped (Thai).
