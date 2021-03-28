# Ids Progress Component

## Description

Displays feedback about a system process. Best for showing feedback about a system process that is not related to the current view. The IDS Progress component is a simple wrapper around a standard HTMLElement that is styled with Infor branding, and contains some additional API that makes it easy to set progress, label, and other functionality.

## Use Cases

- Create standalone progresss
- Create progresss, each with different styling to provide context for actions that are disabled, audible label, max and value.

## Terminology

- Progress: A standard basic progress element. It can set to max and value.
- Label: HTMLLabelElement to keep matching with HTMLProgressElement. Make sure the progress label has a meaningful relative to progress.

## Features (With Code Samples)

A standard basic progress element:

```html
<ids-progress label="Basic" value="30"></ids-progress>
```

Add an Disabled Progress this way:

```html
<ids-progress label="Disabled" disabled="true" value="30"></ids-progress>
```

Set the Max and value attributes to Progress this way:

```html
<ids-progress label="Max" max="1" value="0.7"></ids-progress>
```

Set the audible label to Progress:

```html
<ids-progress label="Audible label" label-audible="true" value="30"></ids-progress>
```

## Attributes and Properties

- `disabled` {boolean} set disabled state.
- `label` {string} set the label text.
- `label-audible` {boolean} set the audible label.
- `max` {string|number} set the progress max attribute.
- `value` {string|number} set the progress value attribute.

## Responsive Guidelines

- Default size is 100% wide and it based on fluid design.

## Converting from Previous Versions

### Converting from 4.x

The IDS Progress component is now a WebComponent. Instead of using classes to define, it is done directly with attributes:

```html
<!-- 4.x progress example -->
<div class="field">
  <label id="pr-label1">Percent complete</label>
    <div class="progress">
      <div class="progress-bar" data-value="50" id="progress-bar1" aria-labelledby="pr-label1"></div>
    </div>
</div>

<!-- this is the same progress using the WebComponent -->
<ids-progress label="Percent complete" value="50"></ids-progress>

```

## Designs

## Alternate Designs

## Proposed Changes

## Test Plan

1. Accessibility - Axe
1. Visual Regression Test
1. Repeat Tests in All Supported Browsers
1. Some of these as test cases from the [WC gold standard](https://github.com/webcomponents/gold-standard/wiki#api)
1. Can be consumed in NG/Vue/React (pull it in standalone/built see it works standalone)

## Accessibility Guidelines

## Regional Considerations
