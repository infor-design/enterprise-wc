## Ids Error Page Component

This example shows how to render a page in an IDS Error Page that shows an unknown error. Ideally its best to avoid these types of errors in your application but when an unexpected error occurs you can use this component to render information about the error. The general use case is similar to a 40(x) error page.

The IDS Error Page Component builds on top of the [Modal]('../ids-modal/README.md'). It also utilizes [EmptyMessage]('../ids-empty-message/README.md')

## Features (With Code Examples)

```html
<ids-error-page
    id="error-page-1"
    visible="true"
    icon="empty-error-loading"
    label="Access Denied"
    description="SunSystems Configuration Manager access has been denied."
    button-text="Return"
></ids-error-page>
```

## Settings (Attributes)

- `icon` {string} the icon to display in the error page
- `label` {string} the main title of the error
- `description` {string} the description of the error
- `button-text` {string} the text for the action button
## Terminology

- **action-button**: button in the error page that triggers a the `action-button` event when clicked or touched.
- **visible**: {boolean} shows or hides the error page based on value

## Accessibility

- All of the page should be readable and contain the information the screen reader users need.

## Keyboard Shortcuts

- Not Applicable as this is a static page

## Converting from Previous Versions (Breaking Changes)

**3.x to 4.x**
- This is a new concept that did not exist in 3.x

**4.x to 5.x**
- The ErrorPage component has been changed to a web component and renamed to `ids-error-page`.
- Markup has changed to a custom element `<ids-error-page>` (see examples above)
- Can now be imported as a single JS file and used with encapsulated styles
- The options are all are set via properties/attributes.
