# Ids Toolbar Component

## Description

The Ids Toolbar is used for building highly-configurable Toolbars for sections of your application.  It displays [buttons](../ids-button/README.md), hyperlinks, and other components in different alignable sections, along with contextual information about a workflow or process.

The Flex Toolbar can also be responsive, intelligently hiding buttons that can't be shown on-screen, and displaying them in an overflow menu.

## Use Cases

- Provides contextual information for a workflow or process displayed on screen
- Provides access to contextual actions for said workflow/process

## Terminology

**Section** Toolbars are divided into sections.  Each of these sections has their own alignment style and "type" that determines how it fits within the Toolbar.
**Item** Toolbar items are the actionable elements within a toolbar.  In general they correspond standard HTML Elements or other IDS Components, such as buttons, hyperlinks, checkboxes, etc.
**More Actions** This optional element can be applied to Toolbars that contain a significant number of actions that cannot all be displayed on screen at one time.  This element contains a menu button that will display any "spilled-over" contents from the Toolbar when active, once those actions are no longer visible on the Toolbar.

## Attributes and Properties

### Toolbar

- `items` provides access to all Toolbar items in all sections
- `sections` provides access to all the Toolbar's sections
- `focused` describes the currently-focused Toolbar item

### Toolbar Section

- `align` - Determines the alignment of the items within this section.  Defaults to `start`, which is the left side of the Toolbar in a standard Left-to-Right toolbar setup.  Can also be `center` and `end` (right).
- `items` - provides access to all Toolbar items in this section.
- `type` - Sets a pre-defined "type" on the toolbar section.  This defaults to `static` but can also be set to `title`, `buttonset`, and `search` to mimic those specific sections.  To create a custom section that fills available space, `fluid` is also an available type.

### Toolbar More Actions

- `button` provides access to the internal [Menu Button component](../ids-menu-button/README.md)
- `menu` provides access to the internal [Popup Menu component](../ids-popup-menu/README.md)
- `type` this component is a standalone toolbar section that always reports `more` for its type.

## States and Variations

## Features (With Code Examples)

## Keyboard Guidelines

## Responsive Guidelines

## Converting from Previous Versions

Ids Toolbar closely resembles the 4.x Flex Toolbar in structure and functionality.  The main differences are:

-
