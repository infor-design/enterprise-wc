# Ids Masthead Component

## Description

The Masthead Component is a primary toolbar with navigable links to useful applications/pages within the Web Application.

## Use Cases

A masthead can provide a prominent navigation bar to other applications, homepages, and bookmarks within a Web Application.

A masthead can be utilized when it is necessary to surface global actions that affect more than one page within a Web Application.

## Terminology

- **Masthead**: A custom HTML element that serves as the primary header bar on a page.
- **Icon**: Icon is the company-logo in the masthead.
- **Title**: Title is text that appears next to the logo.
- **Slots**: Slots are sections in the masthead that allow users to customize where buttons appear in the masthead. There are 4 slots: `start`, `center`, `end`, `more`.

## Feature (With the Code Examples)

An masthead is created by using the `ids-masthead` tag. It has a `icon` property to set the desired logo/icon for the masthead.  It also has a `title` property to set the text that appears next to the logo/icon.

Masthead with `icon` and `logo` attributes:

```html
<ids-masthead icon="logo" title="Infor Application"></ids-masthead>
```

Masthead with `nav` elements as slots:

```html
<ids-masthead icon="logo" title="Infor Application">
  <nav slot="start">
    <ids-button icon="grid"></ids-button>
    <ids-button icon="star-outline"></ids-button>
  </nav>
  <nav slot="center">
    <ids-button icon="info">
  </ids-button></nav>
  <nav slot="end">
    <ids-button icon="user"></ids-button>
    <ids-button icon="bookmark-outline"></ids-button>
  </nav>
</ids-masthead>
```

## Class Hierarchy

- IdsMasthead
  - IdsHeader
- Mixins
  - IdsEventsMixin
  - IdsKeyboardMixin
  - IdsThemeMixin

## Settings

- `icon` {string} Sets the masthead's icon attribute
- `title` {boolean} Sets the masthead's title attribute
- `slots` {readonly} An object containing the masthead's slots/sections for start|center|end|more
- `breakpoints` {readonly}  object containing (window.matchMedia) breakpoints for mobile|tablet|desktop
- `isMobile` {readonly} Returns true if the mobile breakpoint is active
- `isTablet` {readonly} Returns true if the tablet breakpoint is active
- `isDesktop` {readonly} Returns true if the desktop breakpoint is active

## Events

- `tab` {KeyboardEvent} Pressing the tab keyboard button will traverse all buttons in the masthead.

## Methods

- `renderBreakpoint()` Rearranges user's slots in masthead according to desktop, tablet and mobile viewports.

## Themeable Parts

- None

## States and Variations

- Mobile, tablet and desktop viewports/breakpoints

## Accessibility

- Use the `role="banner"` Landmark role
- Should use html5 section or nav type

## Testability

- Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for further details.

## Keyboard Guidelines

A masthead's action buttons should function as a toolbar, see [toolbar](../ids-toolbar/README.md) page for guidelines.

## Responsive Guidelines

A masthead will resize horizontally to mobile, tablet and desktop breakpoints. At the tablet and mobile breakpoints, buttons are moved into the "More" popup-menu.
