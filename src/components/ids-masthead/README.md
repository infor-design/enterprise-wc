# Ids Masthead Component

## Description

The Masthead Component is a very top level application toolbar with navigable links to useful applications/pages within the Web Application.

The masthead can be added to applications when not running inside mingle shell to add functionality that mingle would add that you need standalone. When running in mingle shell, you should detect and do not show the mast head.

The masthead can be found in tenant environments that are opted in to the CloudSuite. It provides navigation to other applications, homepages, and bookmarks within the environment. The masthead is a visual representation of InforOS, which serves as a database for all information and actions made by users within different applications within the suite.

In some cases, the masthead may be implemented in a context outside of the CloudSuite. This should only be done when it is necessary to surface global actions that affect more than one page within an application and do not fit into the context of a page header.

Actions and links found in the masthead are configurable by the tenant admin. The masthead will almost always have:

The application tray: allows users to navigate to other applications within a tenants suite
- Search: pulls results from the current application and around the cloudsuite
- Bookmarks: allows users to save specific pages within applications and access them from anywhere within the cloudsuite
- User settings: central place for end users to view/edit their personal information and any global preferences

Some optional features in the masthead:
- Company logo/home icon: navigates the user to the default or preferred home page
- Coleman
- Inbox

## Use Cases

- A masthead can provide a prominent application level bar to other applications, homepages, and bookmarks within a Web Application.
- A masthead can be utilized when it is necessary to surface global actions that affect more than one page within a Web Application.

## Terminology

- **Masthead**: A custom HTML element that serves as the primary header bar on a page.
- **Icon**: Icon is the company-logo in the masthead.
- **Title**: Title is text that appears next to the logo.
- **Slots**: Slots are sections in the masthead that allow users to customize where buttons appear in the masthead. There are 4 slots: `start`, `center`, `end`, `more`.

## Feature (With the Code Examples)

An masthead is created by using the `ids-masthead` tag. It has a `icon` property to set the desired logo/icon for the masthead.  It also has a `title` property to set the text that appears next to the logo/icon.

Masthead with `icon` and `title` attributes:

```html
<ids-masthead icon="logo" title="Infor Application"></ids-masthead>
```

Masthead with `nav` elements as slots:

```html
<ids-masthead icon="logo" title="Infor Application">
  <section slot="start">
    <ids-button icon="grid"></ids-button>
    <ids-button icon="star-outline"></ids-button>
  </section>
  <section slot="center">
    <ids-button icon="info"></ids-button>
  </section>
  <section slot="end">
    <ids-button icon="user"></ids-button>
    <ids-button icon="bookmark-outline"></ids-button>
  </section>
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
- `title` {string} Sets the masthead's title attribute
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
