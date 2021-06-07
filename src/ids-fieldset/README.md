# Ids Fieldset Component

## Description

Adds additional styling to the native fieldset element.

## Features (With Code Examples)

An IdsFieldset inside a form element. Best practice is to use an IdsText element inside the legend
```html
<form>
    <ids-fieldset>
      <legend><ids-text font-size="24">Company Information</ids-text></legend>
      <ids-input type="text" label="Company Name" id="company-name"></ids-input>
      <ids-input type="text" label="Company Type" id="type"></ids-input>
      <ids-input type="text" label="Company Address" id="company-address"></ids-input>
      <ids-checkbox label="Checked" checked="true"></ids-checkbox>
      <ids-button type="primary">Submit</ids-button>
    </ids-fieldset>
</form>
```

## Regional Considerations

N/A
