# Ids Progress Chart Component

## Description

Similar to the [Progress Bar](../ids-progress-bar/README.md) component, this component is more ideal for creating the standard bar chart visual. It is useful for showing the progress completed or time remaining for a task/goal, since it has customizable labels. It is a simple web component where the amount of progress and total progress can be set with the `progress` and `total` setting/attribute, respectively. Labels can be set with `label`, `label-progress`, `label-total` and can include icons which need to be inserted as a child of the component in the HTML.

## Use Cases

- Showing progress or time remaining for a task/goal

## Terminology

- Progress Chart: A standard basic progress element which has progress, total progress, and 3 customizable labels
- Label: A label web component element to label the title, amount of progress, and amount of total progress

## Features (With Code Samples)

### A standard basic progress chart

```html
<ids-progress-chart label="Basic" progress="50"></ids-progress-chart>
```

The default total is 100, so even if you leave that field blank, it will render as 50% progress. There is also a default color for the progress bar.

### Using Decimals

```html
<ids-progress-chart label="Decimals" progress="0.7" total="1"></ids-progress-chart>
```

### Adding colors

```html
<ids-progress-chart label="Amethyst" color="#A876EB" progress="50"></ids-progress-chart>
```

With the use if IDS tokens, the above is identical to the following:

```html
<ids-progress-chart label="Amethyst" color="amethyst-40" progress="50"></ids-progress-chart>
```

### Adding labels

```html
<ids-progress-chart label="Sprint progress" label-progress="1 week" progress="1" label-total="2 wks" total="2"></ids-progress-chart>
```

### Indicating caution, warning, or error

There are colors associated with the certain statuses

```html
<ids-progress-chart label="Error" color="error" progress="50" label-progress="50%"></ids-progress-chart>
```

```html
<ids-progress-chart label="Caution" color="caution" progress="50" label-progress="50%"></ids-progress-chart>
```

```html
<ids-progress-chart label="Warning" color="warning" progress="50" label-progress="50%"></ids-progress-chart>
```

These are the few scenarios where it will color the progress label as well

### Adding icons

You can insert `ids-icon` components to include in the label heading

```html
<ids-progress-chart label="Error" color="error" progress="50">
  <ids-icon icon="error" size="small"></ids-icon>
</ids-progress-chart>
```

### Adjust the size

There are 2 sizes, `small` and `large`

```html
<ids-progress-chart label="Compact" size="small" progress="50"></ids-progress-chart>
```

## Settings (Attributes)

- `progress` {string | number} set the progress value attribute
- `total` {string | number} set the total progress value attribute
- `color` {string} set the color of the progress bar
- `size` {string} set the size of the progress bar
- `label` {string} set the title label
- `label-progress` {string} set the progress value label
- `label-total` {string} set the total progress value label

## Responsive Guidelines

- By default, the width stretches to 100% of the parent container
- The minimum width is 66px

## Converting from Previous Version

### Converting from 4.x

The IDS Progress Chart component is now a WebComponent. Instead of using classes to define it, it is done directly with a custom element and attributes:

```html
<!-- 4.x progress chart example -->
<div class="field">
  <div id="example-8c" class="chart-container"></div>  
</div>

<script>
  $('body').on('initialized', function() {
    var dataset8 = [{
      data: [{
        name: {text: 'Old Progress Chart'},
        info: {value: '13h'},
        completed: {value: 13, color: '#D66221'}
      }]
    }];

    var api8c = $('#example-8c').chart({dataset: dataset8, type: 'completion-target'}).data('chart');
  });
</script>

<!-- this is the same progress chart using the WebComponent -->
<ids-progress-chart label="New Progress Chart" progress="13" label-progress="13h" color="#D66221"></ids-progress-chart>
  ```
