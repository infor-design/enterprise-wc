# v5.0.0

Released on May 2nd 2021

## 5.0.0 Breaking Changes

- `[Tags]` The Tag component has been changed to a web component. This involves the following changes
    - If using events events are now plain JS events. beforetagremoved, tagremoved, aftertagremoved
    - If using properties/settings these are now attributes: dismissible, color
    - Markup has changed to a custom element `<ids-tag color="error">Text</ids-tag>`
    - Can now be imported as a single js file and be used with encapsulated styles
