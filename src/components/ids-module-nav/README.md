# IDS Module Nav

This component displays top-level navigation in a flyout menu, similar to [IDS App Menu](../ids-app-menu/README.md).

## Use Cases

Use for top-level [Module]() navigation.

## Terminology

- **Module Nav**: The UX element that holds all navigation items.
- **Module Button** The UX element providing access to the Module's home.
- **Role Switcher**: The UX element that contains the Module Button, as well as the Dropdown used to display the Module's Roles.
- **Settings Menu**: The UX element that displays additional settings at the bottom of the Module Nav.

## Settings and Attributes

### IdsModuleNav

These settings apply to the IdsModuleNav container element:

- `display-mode` {false|'collapsed'|'expanded'} Chooses the entire Module Nav structure's display type
- `respond-down` {IdsBreakpointRespondAttribute} Controls the lowest-possible breakpoint at which mobile responsive behavior will be enabled (enabled by using `responsive`)
- `responsive` {boolean} if true, causes the Module Nav structure to automatically respond to mobile device size using a breakpoint.

### IdsModuleNavBar

These settings apply to the IdsModuleNavBar element:

- IdsModuleNavBar inherits all settings from [IdsDrawer](../ids-drawer/README.md)
- `display-mode` {false|'collapsed'|'expanded'} Chooses IdsModuleNavBar's display type.  This setting is controlled automatically when setting the same property on the IdsModuleNav container element.
- `filterable` {boolean} If true, allows accordion filtering via the searchfield using the built-in behavior (false if you want to implement your own)
- `pinned` {boolean} If true, pins key areas of the navigation accordion to the top/bottom of the page.

### IdsModuleNavContent

- `display-mode` {false|'collapsed'|'expanded'} Chooses IdsModuleNavContent's display type.  This setting is controlled automatically when setting the same property on the IdsModuleNav container element.
- `offset-content` {boolean} If true, doesn't allow an `display-mode: expanded` Module Nav to cover its underlying content pane, instead offseting the content.  This is controlled automatically if `responsive` is set on the IdsModuleNav element.

### IdsModuleNavSwitcher

IdsModuleNavSwitcher defines the role-switching capability of the Module Nav.  Its intention is to allow a user to switch among an application's top-level modules quickly. IdsModuleNavSwitcher doesn't have any special settings, but allows an [IdsDropdown](../ids-dropdown/README.md) and its related elements to be slotted and skinned appropriately. It also requires an IdsModuleNavButton element.

### IdsModuleNavSettings

- IdsModuleNavSettings inherits all settings from [IdsMenuButton](../ids-menu-button/README.md).
- IdsModuleNavSettings requires an adjacent [IdsPopupMenu](../ids-popup-menu) configured with the IdsModuleNavSettings element as its target and trigger element.

### IdsModuleNavUser

IdsModuleNavUser creates a composable area that will be fixed to the very bottom of the IdsModuleNavBar, that can be a place for defining the current user and role.  It's contents are simply whatever is slotted in the default content area, but a separate area for the user avatar can be added using `slot="avatar"`.

- `display-mode` {false|'collapsed'|'expanded'} Chooses IdsModuleNavContent's display type.  This setting is controlled automatically when setting the same property on the IdsModuleNav container element.

## Features (With Code Examples)

```html
<ids-module-nav id="module-nav" responsive>
    <ids-module-nav-bar>
        <ids-module-nav-switcher slot="role-switcher">
          <ids-module-nav-button id="module-nav-button">
            <ids-icon icon="icon-app-ac" height="32" width="32" viewBox="0 0 32 32" stroke="none"></ids-icon>
            <ids-text audible>Admin Console</ids-text>
          </ids-module-nav-button>
          <ids-dropdown
            id="module-nav-role-dropdown"
            dropdown-icon="expand-all"
            color-variant="module-nav"
            label="Select Role"
            value="admin-console"
            show-list-item-icon="false">
            <ids-list-box>
              <ids-list-box-option value="admin-console" id="admin-console">
                <ids-icon icon="icon-app-ac" height="32" width="32" viewBox="0 0 32 32" stroke="none"></ids-icon>
                <span>Admin Console</span>
              </ids-list-box-option>
              <ids-list-box-option value="job-console" id="job-console">
                <ids-icon icon="icon-app-jo" height="32" width="32" viewBox="0 0 32 32" stroke="none"></ids-icon>
                <span>Job Console</span>
              </ids-list-box-option>
              <ids-list-box-option value="landing-page-designer" id="landing-page-designer">
                <ids-icon icon="icon-app-lmd" height="32" width="32" viewBox="0 0 32 32" stroke="none"></ids-icon>
                <span>Landing Page Designer</span>
              </ids-list-box-option>
              <ids-list-box-option value="process-server-adminisrator" id="process-server-adminisrator">
                <ids-icon icon="icon-app-psa" height="32" width="32" viewBox="0 0 32 32" stroke="none"></ids-icon>
                <span>Process Server Administrator</span>
              </ids-list-box-option>
              <ids-list-box-option value="proxy-management" id="proxy-management">
                <ids-icon icon="icon-app-pm" height="32" width="32" viewBox="0 0 32 32" stroke="none"></ids-icon>
                <span>Proxy Management</span>
              </ids-list-box-option>
              <ids-list-box-option value="security-system-management" id="security-system-management">
                <ids-icon icon="icon-app-ssm" height="32" width="32" viewBox="0 0 32 32" stroke="none"></ids-icon>
                <span>Security System Management</span>
              </ids-list-box-option>
              <ids-list-box-option value="user-management" id="user-management">
                <ids-icon icon="icon-app-um" height="32" width="32" viewBox="0 0 32 32" stroke="none"></ids-icon>
                <span>User Management</span>
              </ids-list-box-option>
            </ids-list-box>
          </ids-dropdown>
        </ids-module-nav-switcher>

        <ids-search-field
          id="search"
          clearable
          color-variant="module-nav"
          label="Module Nav Search"
          label-state="collapsed"
          no-margins
          placeholder="Search"
          size="full"
          slot="search"></ids-search-field>

        <!-- Main Content (Accordion Navigation) -->
        <ids-accordion>
          <ids-accordion-section slot="" grow>
            <ids-accordion-panel>
              <ids-module-nav-item id="item-user" slot="header" icon="user">
                <ids-text font-size="16" overflow="ellipsis">My Configuration and Personalization</ids-text>
              </ids-module-nav-item>
              <ids-accordion-panel slot="content">
                <ids-module-nav-item slot="header">
                  <ids-text font-size="14">Label</ids-text>
                </ids-module-nav-item>
              </ids-accordion-panel>
              <ids-accordion-panel slot="content">
                <ids-module-nav-item slot="header">
                  <ids-text font-size="14">Label</ids-text>
                </ids-module-nav-item>
              </ids-accordion-panel>
              <ids-accordion-panel slot="content">
                <ids-module-nav-item slot="header">
                  <ids-text font-size="14">Label</ids-text>
                </ids-module-nav-item>
              </ids-accordion-panel>
            </ids-accordion-panel>
            <ids-accordion-panel>
              <ids-module-nav-item id="item-database" slot="header" icon="database">
                <ids-text font-size="16">Database</ids-text>
              </ids-module-nav-item>
              <ids-accordion-panel slot="content">
                <ids-module-nav-item slot="header">
                  <ids-text font-size="14">Label</ids-text>
                </ids-module-nav-item>
              </ids-accordion-panel>
              <ids-accordion-panel slot="content">
                <ids-module-nav-item slot="header">
                  <ids-text font-size="14">Label</ids-text>
                </ids-module-nav-item>
              </ids-accordion-panel>
              <ids-accordion-panel slot="content">
                <ids-module-nav-item slot="header">
                  <ids-text font-size="14">Label</ids-text>
                </ids-module-nav-item>
              </ids-accordion-panel>
            </ids-accordion-panel>
          </ids-accordion-section>
        </ids-accordion>

        <!-- Pinned Footer Section -->
        <ids-accordion slot="footer">
          <ids-accordion-section pinned>
            <ids-accordion-panel>
              <ids-module-nav-item id="item-document" slot="header" icon="document">
                <ids-text font-size="16">Documents</ids-text>
              </ids-module-nav-item>
            </ids-accordion-panel>
            <ids-accordion-panel>
              <ids-module-nav-item id="item-reports" slot="header" icon="report">
                <ids-text font-size="16">Reports</ids-text>
              </ids-module-nav-item>
            </ids-accordion-panel>
            <ids-accordion-panel>
              <ids-module-nav-item id="item-notification" slot="header" icon="notification">
                <ids-text font-size="16">Notification</ids-text>
              </ids-module-nav-item>
            </ids-accordion-panel>
          </ids-accordion-section>
        </ids-accordion>

        <!-- Settings element -->
        <ids-module-nav-settings
          slot="settings"
          role="button"
          icon="settings"
          id="module-nav-settings-btn"
          menu="module-nav-settings-menu"
          color-variant="module-nav"
          content-align="start"
          no-margins
          no-ripple>
          <ids-text>Settings</ids-text>
        </ids-module-nav-settings>
        <ids-popup-menu
          id="module-nav-settings-menu"
          target="#module-nav-settings-btn"
          trigger-type="click"
          slot="settings">
          <ids-menu-group>
            <ids-menu-item icon="observation-precautions" value="jobs">Jobs</ids-menu-item>
            <ids-menu-item icon="report" value="reports">Reports</ids-menu-item>
            <ids-menu-item icon="isolation" value="actions">Actions</ids-menu-item>
            <ids-menu-item icon="edit" value="personalization">Personalization</ids-menu-item>
            <ids-separator></ids-separator>
            <ids-menu-item value="create-report">Create Report</ids-menu-item>
            <ids-menu-item value="proxy">Proxy</ids-menu-item>
            <ids-menu-item value="set-as-of-date">Set "As Of Date"</ids-menu-item>
            <ids-menu-item value="user-context">User Context</ids-menu-item>
            <ids-separator></ids-separator>
            <ids-menu-item icon="settings" value="settings">Settings</ids-menu-item>
            <ids-menu-item icon="info" value="about">About</ids-menu-item>
            <ids-menu-item icon="help" value="help">Help</ids-menu-item>
          </ids-menu-group>
        </ids-popup-menu>

        <!-- User element -->
        <ids-module-nav-user
          slot="user">
          <ids-icon slot="avatar" icon="icon-guest" height="32" width="32" viewBox="0 0 32 32" stroke="none"></ids-icon>
          <ids-text audible type="span" color="unset">Guest</ids-text>
          <ids-hyperlink
            id="guest-hyperlink"
            font-size="14"
            text-decoration="none"
            color="unset">Create an account to save your settings.</ids-hyperlink>
        </ids-module-nav-user>
      </ids-module-nav-bar>

      <ids-module-nav-content>
        <!-- Page content belongs here -->
      </ids-module-nav-content>
    </ids-module-nav>
```
