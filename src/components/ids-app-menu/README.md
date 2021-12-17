# Ids App Menu

The Ids App Menu serves as primary navigation for an Infor Application, combining top level functions of the application with user authentication and access to changing roles.

The App Menu is built on top of `[IdsDrawer](../ids-drawer/README.md) and generally utilizes an [IdsAccordion](../ids-accordion/README.md) and/or [IdsToolbar](../ids-toolbar/README.md) for its navigation features.

## Use Cases

- Top-level navigation for your application
- Access to application-wide features
- Access to different user roles

## Terminology

- **App Menu Branding** - A slotted area that can be used for application branding info, such as a logo.
- **App Menu Content** - The primary slotted area that usually houses an [IdsAccordion](../ids-accordion/README.md) or some other navigation structure.
- **App Menu Header** - A slotted area that can be used for extra navigation or text content that sits above the main App Menu content area.
- **App Menu Footer** - A slotted area that can be used for extra navigation or text content that sits below the main App Menu content area.
- **App Menu Search** - A slotted area that can be used for adding a search feature for App Menu functionality.
- **App Menu User Info** - A slotted area that can contain information specific to the "User" accessing the application.

## Features (with code samples)

A barebones App Menu can consist of only an accordion for navigation:

```html
<ids-app-menu id="app-menu">
    <ids-accordion>
        <ids-accordion-panel>
            <ids-accordion-header slot="header" icon="user">
                <ids-text font-size="16">Employee</ids-text>
            </ids-accordion-header>
        </ids-accordion-panel>
        <ids-accordion-panel>
            <ids-accordion-header slot="header" icon="distribution">
                <ids-text font-size="16">Manager</ids-text>
            </ids-accordion-header>
        </ids-accordion-panel>
        <ids-accordion-panel>
            <ids-accordion-header slot="header" icon="roles">
                <ids-text font-size="16">Recruiter</ids-text>
            </ids-accordion-header>
        </ids-accordion-panel>
    </ids-accordion>
</ids-app-menu>
```

For more examples of Accordion customization, please see [the Accordion documentation](../ids-accordion/README.md)

### Toolbars

App Menus can contain small [Toolbars](../ids-toolbar/README.md) that sit above and below the main navigation area.  These toolbars will ideally contain supporting functions that are application-specific, but not necessarily the most important top-level features of the application.

To include these Toolbars, simply add them to the App Menu's markup with `[slot="header"]` or `[slot="footer"]`:

```html
<ids-app-menu id="app-menu">
  <ids-toolbar slot="header">
    <ids-toolbar-section align="center-even" type="fluid">
      <ids-button id="header-btn-download" icon="download">
        <ids-text slot="text" audible>Download</ids-text>
      </ids-button>
      <ids-button id="header-btn-print" icon="print">
        <ids-text slot="text" audible>Print</ids-text>
      </ids-button>
      <ids-button id="header-btn-purchasing" icon="purchasing">
        <ids-text slot="text" audible>Purchasing</ids-text>
      </ids-button>
    </ids-toolbar-section>
  </ids-toolbar>

  <!-- ... -->
  <ids-toolbar slot="footer">
    <ids-toolbar-section align="center-even" type="fluid">
      <ids-button id="footer-btn-settings">
        <ids-icon slot="icon" icon="settings"></ids-icon>
        <span slot="text">Settings</span>
      </ids-button>
      <ids-button id="footer-btn-proxy" icon="employee-directory">
        <ids-text slot="text" audible>Proxy as User</ids-text>
      </ids-button>
      <ids-button id="footer-btn-about" icon="info-linear">
        <ids-text slot="text" audible>About This Application</ids-text>
      </ids-button>
      <ids-button id="footer-btn-logout" icon="logout">
        <ids-text slot="text" audible>Logout</ids-text>
      </ids-button>
    </ids-toolbar-section>
  </ids-toolbar>
</ids-app-menu>
```

### User Information and Roles

App Menus reserve two slots for specific user information:

- Avatars (User photos)
- Name

```html
<ids-app-menu id="app-menu">
  <!-- Avatar/Username Area -->
  <img slot="avatar" src="/assets/avatar-placeholder.jpg" alt="Picture of Richard Fairbanks" />
  <ids-text slot="username" font-size="24" font-weight="bold">Richard Fairbanks</ids-text>
</ids-app-menu>
```

## States and Variations

The App Menu doesn't contain any states or variants of its own, but applies the following to its extensions and sub-components:

- App Menu uses the `app-menu` style of [IdsDrawer]('../ids-drawer/README.md').
- Any "Top-Level" [IdsAccordion](../ids-accordion/README.md) panels added to the App Menu receive the `app-menu` color variant
- Any "nested" IdsAccordion panels added to the App Menu receive the `sub-app-menu` color variant.
- Any [IdsButton](../ids-button/README.md) components inside the App Menu in any slot will be converted to the `alternate` color variant.

## Keyboard Guidelines

- **Escape**: When focus is on an element inside an open App Menu, the App Menu will close.
