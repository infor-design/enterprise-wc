# ids-masthead

## Description

The Masthead Component is a very top level application toolbar with navigable links to useful applications/pages within the Web Application.

The masthead can be added to applications when not running inside mingle shell to add functionality that mingle would add that you need standalone. When running in mingle shell, you should detect and do not show the mast head.

The masthead can be found in tenant environments that are opted in to the CloudSuite. It provides navigation to other applications, homepages, and bookmarks within the environment. The masthead is a visual representation of InforOS, which serves as a database for all information and actions made by users within different applications within the suite.

In some cases, the masthead may be implemented in a context outside of the CloudSuite. This should only be done when it is necessary to surface global actions that affect more than one page within an application and do not fit into the context of a page header.

Actions and links found in the masthead are configurable by the tenant admin. The masthead will almost always have:

The application tray: allows users to navigate to other applications within a tenants suite
- Search: pulls results from the current application and around the cloud suite
- Bookmarks: allows users to save specific pages within applications and access them from anywhere within the cloud suite
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
- **Slot**: The masthead now has a single slot where users can place an ids-toolbar element. This toolbar can contain the desired buttons and controls for the masthead.

## Feature (With the Code Examples)

An masthead is created by using the `ids-masthead` tag.

Masthead with `ids-toolbar` elements in the slot:

```html
<ids-masthead title="Infor Application" icon="logo" role="navigation">
    <ids-toolbar id="my-toolbar">
        <ids-toolbar-section align="start" favor>
            <ids-layout-flex gap="8" align-items="center">
            <ids-layout-flex-item>
                <ids-button id="logo" class="icon-logo" color-variant="alternate" square="true">
                <ids-icon icon="logo" viewbox="0 0 32 34" width="32" height="32"></ids-icon>
                <ids-text audible="true">Masthead logo</ids-text>
                </ids-button>
            </ids-layout-flex-item>
            <ids-layout-flex-item>
                <ids-text id="title" color-variant="alternate" font-size="14" font-weight="semi-bold">Infor Application</ids-text>
            </ids-layout-flex-item>
            <ids-layout-flex-item>
                <ids-button icon="grid"><span class="audible">Grid Button</span></ids-button>
            </ids-layout-flex-item>
            </ids-layout-flex>
        </ids-toolbar-section>

        <ids-toolbar-section type="buttonset" align="start">
            <ids-button id="button-1" icon="home"><span>Home</span></ids-button>
            <ids-button id="button-2" icon="star-outlined"><span>Star</span></ids-button>
            <ids-button id="button-3" icon="info"><span>Info</span></ids-button>
        </ids-toolbar-section>

        <ids-toolbar-section type="buttonset" align="end">
            <ids-button icon="user"><span class="audible">User Button</span></ids-button>
            <ids-button icon="mingle-share"><span class="audible">Mingle Button</span></ids-button>
            <ids-button icon="bookmark-outlined"><span class="audible">Bookmark Button</span></ids-button>
        </ids-toolbar-section>

        <ids-toolbar-more-actions overflow>
            <ids-menu-group>
            <ids-menu-item value="1" disabled>Option One (disabled)</ids-menu-item>
            <ids-menu-item value="2">Option Two</ids-menu-item>
            <ids-menu-item value="3">Option Three</ids-menu-item>
            <ids-menu-item>More Options
                <ids-popup-menu>
                <ids-menu-group>
                    <ids-menu-item value="4">Option Four</ids-menu-item>
                    <ids-menu-item value="5" disabled>Option Five (disabled)</ids-menu-item>
                    <ids-menu-item value="6">Option Six</ids-menu-item>
                </ids-menu-group>
                </ids-popup-menu>
            </ids-menu-item>
            </ids-menu-group>
        </ids-toolbar-more-actions>
    </ids-toolbar>
</ids-masthead>
```

## Class Hierarchy

- IdsMasthead
  - IdsHeader
- Mixins
  - IdsEventsMixin
  - IdsKeyboardMixin

## Settings

- `slot` {readonly} An object containing the masthead's sections for start|center|end|more

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

## Keyboard Guidelines

A masthead's action buttons should function as a toolbar, see [toolbar](../ids-toolbar/README.md) page for guidelines.

## Responsive Guidelines

A masthead will resize horizontally to mobile, tablet and desktop breakpoints. At the tablet and mobile breakpoints, buttons are moved into the "More" popup-menu.

## Converting from Previous Versions (Breaking Changes)

**3.x to 4.x**

- Masthead replaces the inforTopBanner CSS. The markup and CSS Is entirely different to support new look and behavior.

**4.x to 5.x**

- The masthead component has been changed to a web component and renamed to ids-masthead.
- If using properties/settings these are now attributes.
- Markup has changed to a custom element `<ids-masthead></ids-masthead>`
- If using events events are now plain JS events for example (i.e. button click events)
- The template is now a template element that uses simple string substitution
- Can now be imported as a single JS file and used with encapsulated styles (in some browsers)
- Design has changed
