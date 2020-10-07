# v5.0.0

Released on May 2nd 2021

## 5.0.0 Breaking Changes

- `[Tags]` The Tag component has been changed to a web component. This involves the following changes
    - If using events events are now plain JS events. beforetagremoved, tagremoved, aftertagremoved
    - If using properties/settings these are now attributes: dismissible, color
    - Markup has changed to a custom element `<ids-tag color="error">Text</ids-tag>`
    - Can now be imported as a single js file and be used with encapsulated styles
- `[Popup]` Added the Popup WebComponent. ([#4259](https://github.com/infor-design/enterprise/issues/4259))
    - This is the new base component to be used for building Popupmenu, Tooltip, Modal, and any other component that requires placement of a fixed-position element.
    - If using properties/settings, these are now attributes: x, y, align, alignX, alignY, alignEdge, alignTarget, animated, visible.
    - Popup is now driven by its own HTMLElement rather than a being a behavior applied to any element: `<ids-popup x="0" y="0" align="top, left">My Popup</ids-popup>`
    - Can now be imported as a single JS file and used with encapsulated styles.
