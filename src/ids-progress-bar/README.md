# Ids Progress Bar Component

## Description

Displays feedback about a system process. It is best for showing feedback about a system process to show an unspecified wait time or display the length of a running process. The IDS progress indicator is a simple web component and the value can be set with the `value` setting/attribute.

## Use Cases

- Showing feedback about a running system process

## Terminology

- Progress Bar: A standard basic progress element. It can set to a max and value.
- Label: A label web component element to label the process being shown. Make sure the progress label is meaningful relative to progress.

## Features (With Code Samples)

A standard basic progress element:

```html
<ids-progress-bar label="Basic" value="30"></ids-progress-bar>
```

Represent an Disabled progress in this way:

```html
<ids-progress-bar label="Disabled" disabled="true" value="30"></ids-progress-bar>
```

Set the max and value attributes to show progress in this way:

```html
<ids-progress-bar label="Max" max="1" value="0.7"></ids-progress-bar>
```

Set the audible (screen reader only) label to Progress:

```html
<ids-progress-bar label="Audible label" label-audible="true" value="30"></ids-progress-bar>
```

## Attributes and Properties

- `disabled` {boolean} set the disabled state.
- `label` {string} set the label text
- `label-audible` {boolean} set the label to audible (screen reader only)
- `max` {string|number} set the progress max attribute.
- `value` {string|number} set the progress value attribute.

## Responsive Guidelines

- Default size is 100% wide and it based on fluid design, stretching to the parent content.

## Converting from Previous Versions

### Converting from 4.x

The IDS Progress Bar component is now a WebComponent. Instead of using classes to define it, it is done directly with a custom element and attributes:

```html
<!-- 4.x progress example -->
<div class="field">
  <label id="pr-label1">Percent complete</label>
    <div class="progress">
      <div class="progress-bar" data-value="50" id="progress-bar1" aria-labelledby="pr-label1"></div>
    </div>
</div>

<!-- this is the same progress using the WebComponent -->
<ids-progress-bar label="Percent complete" value="50"></ids-progress-bar>

```
