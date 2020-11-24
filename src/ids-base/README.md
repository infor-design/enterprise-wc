# Ids Base

This folder contains source code for the common base code for IDS. This includes shared functions, Core Css and The webcomponent base class `IdsElement`.

## Ids Base Css

The Ids base css class contains imports for core modules like typography (including labels), and imports for the Ids Identity token css variables and the functional classes mixins (similar to tailwind css).

## Ids Decorators

The ids-decorators are imported directly into ids-element and may not need to be called directly. Current there are there

1. One to add a version to the webcomponent and one to make a customer element for the web components. This is added in IdsElement if used
1. One to make the component a customElement
1. One to add a mixin to the components

## Ids Element

Ids Element is the general base class for most web components in IDS. Its used to have a base layer with common functions that all components will have. If only some components will have the functionality use a mixin instead. Ids Element current adds the following:

1. A version number from the package json
1. A name property from the element name
1. Handles setting changes
1. Removed attached event handlers (if the mixin is used)
1. Prevents flash of unstyled content
1. Holds the property (settings) list
1. Renders a template from the template property
1. Exports all mixins

## Ids Keyboard Mixin

- Handles detaching if a key is pressed down currently
- Adds a hot key mapper
- Can list the supported keys for a component

The Keyboard mixin needs to record its state differently so cannot be attached with the `@mixin` decorator. Instead its invoked as with the new keyword. To use it to respond to keys in a component you can use it like this:

```js
handleKeys() {
    this.keyboard = new IdsKeyboardMixin();
    this.keyboard.listen(['Delete', 'Backspace'], this, (e) => {
        // Do something on either Delete or Backspace
    });

    this.keyboard.listen('Enter', this, (e) => {
        // Do something on Enter
    });
}
```

Also at any time you can check `this.keyboard.pressedKeys` to see what keys are current down. `this.hotkeys` contains all the currently watched keys.

## Ids Event Handler

Adds a small wrapper around component events. This can be used to see what event handlers are attached on a component as well as the fact that the Ids Element Base will call removeAll to remove all used event handlers.

## Ids Event Emitter

- Handles consistency on the data sent (element, event data, id, idx, custom ect)
- Some events can be vetoed
- All events should have past tense for example activated, beforeactivated, afteractived not activate, beforeactivate, afteractivate

## Ids Mixins

Mixins are simply functions with shared functionality that can be injected into a component. For example the IdsEventOmitter. They get around the issue that in JS that you cannot inherit from more than one object. Also they prevent the Base Element from getting bloated with functionality that not every component uses. Ids is using a simple object as a mixin that in "injected" into the component in the contructor and then used according to its documentation. If the mixin has UI elements it should probably be a web component instead.

## Ids Resize Mixin

This mixin contains lifecycle methods for making a component detect page and element resizing.  The mixin allows a component to be registered against a global instance of ResizeObserver, which can trigger size changes throughout the UI, and fire a `refresh()` method on the component if one is defined.  The mixin also has lifecycle methods for setting up and tearing down a MutationObserver that can will fire a `refresh()` method on the component if one is defined.

## Ids Dirty Tracker Mixin

This mixin tracks the input element text/value changes and show a dirty indicator icon (yellow triangle) to indicate the field has been modified from the starting value.

## Ids Clearable Mixin

This mixin adds (x) button to input element and bind click/keys to clear the input value/text. It triggers events the `cleared` when clears the contents of the input element and `contents-checked` when checks the contents of input element for empty.

## Ids Validation Mixin

This mixin add/removes validation icon and messages to form fields. It triggers the `validated` event and pass argument validation boolean results with `isValid`.
