# Ids Fieldset Component

## Description

Field sets are used to group various content or input fields into a section. They can include various input fields and other components as well. They are often used as building block of forms.

## Use Cases

- Use when you need form sections

## Terminology

- **Fieldset**: An html <fieldset> tag is used to group related elements in a form.

## Features (With Code Examples)

An IdsFieldset inside a form element. Best practice is to use an IdsText element inside the legend possibly with a type like h2.

```html
<form>
  <ids-fieldset>
    <legend><ids-text font-size="24" type="h2">Company Information</ids-text></legend>
    <ids-input type="text" label="Company Name" id="company-name"></ids-input>
    <ids-input type="text" label="Company Type" id="type"></ids-input>
    <ids-input type="text" label="Company Address" id="company-address"></ids-input>
    <ids-checkbox label="Checked" checked="true"></ids-checkbox>
    <ids-button type="primary">Submit</ids-button>
  </ids-fieldset>
</form>
```

## Themeable Parts

- `fieldset` allows you to further style the fieldset HTML element in the slot

## Responsive Guidelines

Field sets have a default responsive behavior to move from two columns to one at our mobile breakpoints. The behavior is not limited to this, however, it is important to keep in mind the complexity that a multitude of content columns can bring to an application experience.

## Converting from Previous Versions

- 3.x: Removed the expand/collapse button, Changed class inforFieldSetLabel and inforFieldSet
- 4.x: Field set have all new markup and classes
- 4.x: Field set have all new markup and classes for web components

## Regional Considerations

The fieldset will flip in in Right To Left languages.

## Accessibility

- `role="region"` Should be added to the fieldset region to convey it to non-sighted users.
- `aria-labelledby` Should be added to the dynamic expandable region, where aria-labelledby points back to the fieldset title.
