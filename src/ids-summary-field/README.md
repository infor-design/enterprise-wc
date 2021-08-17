# Ids Summary Field Component

## Description

This component is closely intertwined with the [old component](https://main-enterprise.demo.design.infor.com/components/form/example-forms.html) and provides readable information based on what is entered in those fields. The style of this summary field by default has a font weight `bold` for the `data` field. To overwrite these styles, you would have to edit the source code, specifically the styles of the `ids-text` elements of the template

## Use Cases

- Renders the label and data from input fields into a readable format

## Terminology

- Summary Field: Information that is formatted into user-friendly text based on input fields
- Label: The title or description of the information
- Data: The information itself

## Features (With Code Samples)

Examples can be viewed at [http://localhost:4300/ids-summary-field](http://localhost:4300/ids-summary-field)

### A standard summary field 

```html
  <ids-summary-field label="Shipping to" data="4209 Industrial Avenue<br/>Los Angeles, California 90001 USA">
  </ids-summary-field>
```

## Settings (Attributes)

- `data` { string } set the data to display
- `label` { string } set the label to display

## Responsive Guidelines

- By default, the width adjusts to 100% of the parent container
- There is no minimum width

## Converting from Previous Version

### Converting from 4.x

```html
<!-- 4.x summary field example -->
<form id="example-summary-field-form">
  <div class="row">
    <div class="full column">

      <div class="summary-form">

        <div class="field">
          <span class="label">Shipping to</span>
          <span class="data">4209 Industrial Avenue <br/>Los Angeles, California 90001 USA</span>
        </div>

        <div class="field">
          <span class="label">Shipping Method</span>
          <span class="data">Freight</span>
        </div>

        <div class="field">
          <span class="label">Estimated Delivery</span>
          <span class="data">June 21, 2015 <i>(4 days)</i></span>
        </div>

      </div>

    </div>

  </div>
</form>

<!-- The equivalent Summary Field Web Component -->
  <ids-summary-field label="Shipping to" data="4209 Industrial Avenue<br/>Los Angeles, California 90001 USA"></ids-summary-field>
  <ids-summary-field label="Shipping Method" data="Freight"></ids-summary-field>
  <ids-summary-field label="Estimated Delivery" data="June 21, 2015 (4 days)"></ids-summary-field>
  ```
