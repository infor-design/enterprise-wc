# Ids Base

This folder contains source code for the common base code for IDS. This includes shared functions, Core Css and The webcomponent base class IdsElement.

## Ids Base Css

The Ids base css class contains typography (including labels), the Ids Identity token css variables and the functional classes (similar to tailwind css).

## Ids Decorators

The ids-decorators are imported directly into ids-element and may not need to be called directly. Current there is only two. One to add a version to the webcomponent and one to make a customer element for the web components. See ids-tag.js for proper usage.

## Ids Element

TODO

## Ids Keyboard

- Handles detaching if a key is pressed down currently
- Adds a hot key mapper (for example google hot keys)
- Early draft info is on [#643](https://github.com/infor-design/enterprise/issues/643)
- All events should have past tense for example activated, beforeactivated, afteractived not activate, beforeactivate, afteractivate
- Can list the supported keys for a component

## Ids Event Handler

Adds a small wrapper around component events. This can be used to see what event handlers are attached on a component as well as the fact that the Ids Element Base will call removeAll to remove all used event handlers.

Future
- Handles consistency on the data sent (element, event data, id, idx, custom ect)
- Some events can be vetoed
- Handles omitting events to watch for external developers. Still deciding if we should use promises, signals, events or callbacks.
