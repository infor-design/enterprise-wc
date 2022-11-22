# Ids Base

This folder contains source code for the common base code for IDS. This includes shared functions, Core Css and The webcomponent base class `IdsElement`. All mixins can be found in the `src/mixins`.

## Ids Base Css

The Ids base css class contains imports for core modules like typography (including labels), colors and some layout properties, this included imports for the Ids Identity token css variables and the functional classes mixins (similar to tailwind css) used in most css files.

## Ids Decorators

The ids-decorators are imported directly into ids-element and may not need to be called directly. Currently there are there decorators for:

1. Creating a custom element `@customElement('ids-data-grid')`
1. Appending the styles in an encapsulated way `@scss(styles)`

## Ids Node

Ids Node is the general base class for very slimed down component. Its used to have a base layer with common functions that all very light components will have. Ids Node current adds the following:

1. Handles setting changes
1. Allows mixings to be used
1. Adds types
1. Holds the property (settings) list
1. Has no templates
1. Has no styles or shadowRoot

## Ids Element

Ids Element is the general base class for most web components in IDS. Its used to have a base layer with common functions that all components will have. If only some components will have the functionality use a mixin instead. Ids Element current adds the following:

1. A name property from the element name
1. Handles setting changes
1. Removed attached event handlers (if the mixin is used)
1. Prevents flash of un styled content
1. Holds the property (settings) list
1. Renders a template from the template property

## Ids Data Source

Adds a wrapper for components that need data arrays as a setting to render (list view, data grid). It has the ability to:

1. Clone the array so the original is not modified
1. Flatten and unflatten data
1. Sort
1. Filter
