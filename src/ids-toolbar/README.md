# Ids Toolbar Component

## Description

The Ids Toolbar is used for building highly-configurable Toolbars for sections of your application.  It displays [buttons](../ids-button/README.md), hyperlinks, and other components in different alignable sections, along with contextual information about a workflow or process.

The Ids Toolbar can also be responsive, intelligently hiding buttons that can't be shown on-screen, and displaying them in an overflow menu.

## Use Cases

- Provides contextual information for a workflow or process displayed on screen
- Provides access to contextual actions for said workflow/process

## Terminology

**Section** Toolbars are divided into sections.  Each of these sections has their own alignment style and "type" that determines how it fits within the Toolbar.
**Item** Toolbar items are the actionable elements within a toolbar.  In general they correspond standard HTML Elements or other IDS Components, such as buttons, hyperlinks, checkboxes, etc.
**More Actions** This optional element can be applied to Toolbars that contain a significant number of actions that cannot all be displayed on screen at one time.  This element contains a menu button that will display any "spilled-over" contents from the Toolbar when active, once those actions are no longer visible on the Toolbar.

## Attributes and Properties

### Toolbar

- `disabled` makes the entire toolbar enabled/disabled
- `focused` describes the currently-focused Toolbar item
- `items` provides access to all Toolbar items in all sections
- `sections` provides access to all the Toolbar's sections
- `tabbable` if true, makes it possible to navigate all Toolbar items by using the Tab/Shift+Tab keys by setting all items to a 0-or-more tabIndex property.  By default (false), only one Toolbar item at a time can have a 0-or-more tabIndex.

### Toolbar Section

- `align` - Determines the alignment of the items within this section.  Defaults to `start`, which is the left side of the Toolbar in a standard Left-to-Right toolbar setup.  Can also be `center` and `end` (right).
- `items` - provides access to all Toolbar items in this section.
- `type` - Sets a pre-defined "type" on the toolbar section.  This defaults to `static` but can also be set to `title`, `buttonset`, and `search` to mimic those specific sections.  To create a custom section that fills available space, `fluid` is also an available type.

### Toolbar More Actions

- `button` provides access to the internal [Menu Button component](../ids-menu-button/README.md)
- `menu` provides access to the internal [Popup Menu component](../ids-popup-menu/README.md)
- `type` this component is a standalone toolbar section that always reports `more` for its type.

## States and Variations

- "disabled"
- "tabbable"

Aside from the Toolbar-level disabled state, all individual Toolbar items are responsible for management of their own state.  For more information on these components' states, see their documentation pages.

## Features (With Code Examples)

Ids Toolbars are comprised of the Toolbar element, an indeterminate number of Toolbar sections, and an optional "More Actions" menu button element. Inside of the different toolbar sections, it's possible to place different Ids Components.  Below is a basic example of what an entire Ids Toolbar may look like:

```html
<ids-toolbar>
    <ids-toolbar-section type="title">
        <ids-text type="h3">My Toolbar</ids-text>
    </ids-toolbar-section>
    <ids-toolbar-section type="buttonset" align="end">
        <ids-button id="button-1" role="button">
            <span slot="text">Text</span>
        </ids-button>
        <ids-button id="button-2">
            <span slot="text" class="audible">Settings</span>
            <ids-icon slot="icon" icon="settings"></ids-icon>
        </ids-button>
    </ids-toolbar-section>
    <ids-toolbar-more-actions>
        <ids-menu-group>
            <ids-menu-item value="1">Option One</ids-menu-item>
            <ids-menu-item value="2">Option Two</ids-menu-item>
            <ids-menu-item value="3">Option Three</ids-menu-item>
            <ids-menu-item>More Options
            <ids-popup-menu>
                <ids-menu-group>
                <ids-menu-item value="4">Option Four</ids-menu-item>
                <ids-menu-item value="5">Option Five</ids-menu-item>
                <ids-menu-item value="6">Option Six</ids-menu-item>
                </ids-menu-group>
            </ids-popup-menu>
            </ids-menu-item>
        </ids-menu-group>
    </ids-toolbar-more-actions>
</ids-toolbar>
```

### Sections

Toolbar sections can be configured with different "types" that can determine their look/feel/function.  By default, the sections do not fill available space and contain no padding.  These are `static` toolbar sections:

```html
<ids-toolbar-section>
    <ids-button icon="menu" role="button">
        <span slot="text" class="audible">Application Menu Trigger</span>
    </ids-button>
</ids-toolbar-section>
```

For compatibility with 4.x components Toolbars, the IDS Toolbar also supports `title` and `buttonset` section types that act similarly.  The styling is less rigid than in previous iterations, so to make a buttonset section "right"-aligned, it's necessary to add the `align="end"` attribute:

```html
<ids-toolbar-section type="title">
    <ids-text font-size="20">My Toolbar</ids-text>
    <ids-text font-size="14">With some extra information below</ids-text>
</ids-toolbar-section>
<ids-toolbar-section type="buttonset" align="end">
    <ids-button id="button-1" role="button">
        <span slot="text">Text</span>
    </ids-button>
    <ids-button id="button-2">
        <span slot="text" class="audible">Settings</span>
        <ids-icon slot="icon" icon="settings"></ids-icon>
    </ids-button>
</ids-toolbar-section>
```

Toolbar Title sections can have multiple text elements, if needed:

```html
<ids-toolbar-section type="title">
    <ids-text font-size="20">My Toolbar</ids-text>
    <ids-text font-size="14">With some extra information below</ids-text>
</ids-toolbar-section>

<!-- or... -->

<ids-toolbar-section type="title">
    <ids-text font-size="20">My Toolbar</ids-text>
</ids-toolbar-section>
```

Toolbar Buttonset sections can contain an indeterminate number of components.  Generally these are [Buttons](../ids-button/README.md), but other component types such as Hyperlinks and some Pickers are accepted.  The Buttonset Section is styled with CSS to prevent the wrapping of these elements to multiple lines, instead cutting off actions that don't fit.  If accompanied by a More Actions button, the actions that don't fit will "spill over" into the More Actions menu:

```html
<ids-toolbar-section type="buttonset" align="end">
    <ids-button id="button-1" role="button">
        <span slot="text">Text</span>
    </ids-button>
    <ids-button id="button-2">
        <span slot="text" class="audible">Settings</span>
        <ids-icon slot="icon" icon="settings"></ids-icon>
    </ids-button>
    <ids-button id="button-3" role="button">
        <span slot="text">Text</span>
    </ids-button>
    <ids-button id="button-4" role="button">
        <span slot="text">Text</span>
    </ids-button>
</ids-toolbar-section>
```

Toolbars can also contain sections that are meant to be customized with CSS.  It's possible to create custom static sections with the `static` type, but if you want to make a custom section that fills available space, use the `fluid` type:

```html
<ids-toolbar>
    <!-- takes up as little space as possible --->
    <ids-toolbar-section type="static">
        <ids-button id="button-1" role="button">
            <span slot="text">Button 1</span>
        </ids-button>
    </ids-toolbar-section>

    <!-- fills the rest of the toolbar space -->
    <ids-toolbar-section type="fluid" align="end">
        <ids-button id="button-2" role="button">
            <span slot="text">Button 2</span>
        </ids-button>
    </ids-toolbar-section>
<ids-toolbar>
```

### More Actions Button

Optionally, toolbars can contain a "More Actions" Button, which is a [Menu Button]('../ids-menu-button/README.md) wrapped inside a special Toolbar Section.  This component's purpose is to provide ansulary actions that are related to your Toolbar's primary actions, but don't necessarily need to be readily available on a single click.  In responsive situations with many primary actions present, the Toolbar will collapse any actions that don't fit within its boundaries and make them available at the top of the More Actions button's menu (also referred to as the "overflow" menu).

The Ids Toolbar More Actions component sits alongside the other toolbar sections, and contains a single slot that takes the same types of elements as a standard [Ids Popup Menu](../ids-popup-menu/README.md):

```html
<ids-toolbar-more-actions>
    <ids-menu-group>
        <ids-menu-item value="1">Option One</ids-menu-item>
        <ids-menu-item value="2">Option Two</ids-menu-item>
        <ids-menu-item value="3">Option Three</ids-menu-item>
        <ids-menu-item>More Options
        <ids-popup-menu>
            <ids-menu-group>
            <ids-menu-item value="4">Option Four</ids-menu-item>
            <ids-menu-item value="5">Option Five</ids-menu-item>
            <ids-menu-item value="6">Option Six</ids-menu-item>
            </ids-menu-group>
        </ids-popup-menu>
        </ids-menu-item>
    </ids-menu-group>
</ids-toolbar-more-actions>
```

### API Access

At the Toolbar level, it's possible to access all Items and Sections:

```js
const items = document.querySelector('ids-toolbar').items;
const sections = document.querySelector('ids-toolbar').sections;
```

Within each section, it's possible to access the section's items:

```js
const items = document.querySelector('ids-toolbar-section').items;
```

When dealing with a More Actions button, its inner components' APIs are exposed:

```js
const moreActionsButtonEl = document.querySelector('ids-toolbar-more-actions').button;
const moreActionsMenuEl = document.querySelector('ids-toolbar-more-actions').menu;
```

## Keyboard Guidelines

The IDS Button doesn't contain any interactions beyond a standard HTMLButtonElement:

- <kbd>Enter</kbd> keys selects a toolbar action and executes the action.  On menu buttons, the menu is activated/hidden, and an action is not executed until one of its menu items is selected.
- <kbd>Left/Right Arrow</kbd> keys navigate the available toolbar items.
- <kbd>Tab</kbd> or <kbd>Shift</kbd>/<kbd>Tab<kbd> keys cause navigation to occur.  When `tabbable="true"`, using Tab/Shift+Tab causes navigation between Toolbar items. When `tabbable="false"`, Navigation away from the toolbar will occur to the element after/before the Toolbar respectively.

## Responsive Guidelines

- Try not to provide an over-abundance of Toolbar Actions.  The Toolbar's intention is to provide contextual actions for a specific workflow. Providing too many actions can cause end-user confusion.

## Converting from Previous Versions

Ids Toolbar closely resembles the 4.x Flex Toolbar in structure and functionality.  The main differences are:

- Toolbar Sections and the More Actions Button are now standardized components.
