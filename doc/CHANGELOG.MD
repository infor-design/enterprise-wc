# v5.0.0

Released on May 2nd 2021

## 5.0.0 Breaking Changes

- `[Tags]` The Tag component has been changed to a web component. Be aware of and make the following changes to your code:
   1. If using events events are now plain JS events. beforetagremoved, tagremoved, aftertagremoved

   1. If using properties/settings these are now attributes: dismissible, color

   1. Markup has changed to a custom element `<ids-tag color="error">Text</ids-tag>`
  ([#xxx](https://github.com/infor-design/enterprise/issues/xxx))
