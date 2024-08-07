# ids-empty-message

## Description

The IDS Empty Message component is a layout pattern for indicating there is no data for the object. Empty messages appear in ids-cards, ids-data-grid and other places like forms. The component supports action buttons, provides styling for a label and secondary description and optional empty-message specific icons.

## Use Cases

- When no content is present, an empty message is useful to communicate information & action. It is critical to communicate why it’s empty and what the user can do.
## Terminology
- **icon**: this property when included and provided with a supported icon id will display the chosen icon in the empty message format
- **label**: this is a web component slot, the contents of this slot are treated as a primary label and are styled accordingly
- **description**: this is a web component slot, the contents of this slot are formatted as secondary text in the ids-empty-message format
- **button**: this is a slot that is used for any button inputs for the empty message

## Themeable Parts

- `container` allows for the styling of the container element

## Features

A simple implementation of the empty-message component

```html
  <ids-empty-message icon="empty-no-tasks">
    <ids-text type="h2" font-size="20" label="true" slot="label">Document Management</ids-text>
    <ids-text label="true" slot="description">Description of empty message that explains why</ids-text>
    <ids-button class="action-button" slot="button" appearance="primary">
      <span>BUTTON NAME</span>
    </ids-button>
  </ids-empty-message>
```

When making use of the `icon` property, it is important to remember that only empty message specific icon options are valid. Here is a complete list:

`empty-error-loading`
`empty-generic`
`empty-new-project`
`empty-no-alerts`
`empty-no-analytics`
`empty-no-budget`
`empty-no-data`
`empty-no-events`
`empty-no-notes`
`empty-no-orders`
`empty-no-tasks`
`empty-no-users`
`empty-search-data`

## Settings and Attributes

- **icon** the attribute for adding an icon to the empty message, also has bound property with getter/setter

## Accessibility

It is important to remember to always include a label or description with an Icon for screen reader users.

## Converting from Previous Versions (Breaking Changes)

**3.x to 4.x**
- This is a new concept that did not exist in 3.x

**4.x to 5.x**
- The EmptyMessage component has been changed to a web component and renamed to `<ids-empty-message>`.
- Markup has changed to a custom element `<ids-empty-message>` (see examples above)
- Can now be imported as a single JS file and used with encapsulated styles
- The icon, label, description and button-text are set via properties/attributes.
