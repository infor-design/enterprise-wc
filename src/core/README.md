# Ids Base

This folder contains source code for the common base code for IDS. This includes shared functions, Core Css and The webcomponent base class `IdsElement`. All mixins can be found in the `src/mixins`.

## Ids Base Css

The Ids base css class contains imports for core modules like typography (including labels), colors and some layout properties, this included imports for the Ids Identity token css variables and the functional classes mixins (similar to tailwind css) used in most css files.

## Ids Decorators

The ids-decorators are imported directly into ids-element and may not need to be called directly. Current there are there decorators for:

1. Add a version to the webcomponent
1. Creating a custom element
1. Appending the styles in an encapsulated way
1. Appending the Automation Ids

## Ids Element

Ids Element is the general base class for most web components in IDS. Its used to have a base layer with common functions that all components will have. If only some components will have the functionality use a mixin instead. Ids Element current adds the following:

1. A version number from the package json
1. A name property from the element name
1. Handles setting changes
1. Removed attached event handlers (if the mixin is used)
1. Prevents flash of un styled content
1. Holds the property (settings) list
1. Renders a template from the template property
1. Exports several decorators and utils that are commonly used.
