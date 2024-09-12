# ids-form

## Description

The ids-form provides similar functionality to the `<form>` HTML element. The form component enables the ability to link a submit button. When the form is submitted, the submit event is fired in which you can do what is needed with the form data. This component also allows you to toggle the `compact` mode. And get which form fields have been changed (dirty) and reset this. You can also see which fields have errors with the API. The layout of the page is handled by [ids-layout-grid](https://design.infor.com/components/utilities/layout-grid/).

## Terminology

- **Form**: A HTML `<form>` is used to collect user input. 
- **Validation Messages**: Input errors a field might have.
- **isDirty**: Form or field has been changed from its original value.
- **inValid**: Form or field has one or more errors.

## Features (With Code Examples)

A basic form has an `id` and a `submit-button` property that links to a button. Setting `compact` to `true` if you have a large form and not much space, but its recommended to use the larger/normal size fields in most cases, and for better mobile experience.

```html
    <ids-form compact="false" submit-button="btn-submit" id="sample-form">
      <ids-layout-grid cols="2" gap="md">
        <ids-layout-grid-cell>
          <ids-input id="field-1" label="Field One"></ids-input>
          <ids-input id="field-2" label="Field Two"></ids-input>

          <ids-button id="btn-submit" appearance="primary">
            <span>Submit</span>
          </ids-button>
        </ids-layout-grid-cell>
        <ids-layout-grid-cell>
          <ids-input id="field-3" label="Field Three"></ids-input>
          <ids-input id="field-4" label="Field Four"></ids-input>

        </ids-layout-grid-cell>
      </ids-layout-grid>
    </ids-form>
```

## Class Hierarchy

- IdsForm
  - IdsElement
- Mixins
  IdsEventsMixin

## Settings (Attributes)

- `compact` {boolean} When set to `true`, reduce the height and padding of form components.
- `name` {string} Adds a name to the form, this is only used for possible naming.
- `submit-button` {string} Sets the id of the submit button, which will fire a submit event when clicked.

## Events

- `submit` Fires when the form is submitted / the submit button is clicked. In the event data, you will get all components in the form of type formComponent and the form data including, value, oldValue, dirty info and validation info.

## Getters / Methods

- `errorFormComponents` Returns all form components in error.
- `isValid` Returns true if any form components are in error.
- `dirtyFormComponents` Returns all form components that have been changed from their original value.
- `isDirty` Returns true if any form components are dirty.
- `resetDirtyTracker` Resets the dirty tracker for all form components.
- `formComponents` Returns all form components of type formComponent.
- `idsComponents` Returns all ids components in the form.
- `checkValidation` Runs validation all form fields

## Themeable Parts

- `form` allows you style the internal form element if needed

## States and Variations

- Dirty
- Error

## Responsive Guidelines

- See `ids-layout-grid` for details as this is the layout driver for forms

## Converting from Previous Versions (Breaking Changes)

**3.x to 4.x**

- Forms were first implemented in v4.0.0 in this version you just used a `<form>` element.

**4.x to 5.x**

- Forms are now custom elements `<ids-form>...</ids-form>`
- If using events events are now plain JS events. `submit`
- Folks using reactive forms in angular will need to give us feedback.
- The previous version just had forms as layouts, now the form has more functionality.

## Regional Considerations

Labels should be localized in the current language. The fields in the form will flip the direction of the fields but these are details of the `ids-layout-grid` component.
