# IDS Step Chart

## Description

Step chart provides a custom element <ids-step-chart></ids-step-chart> that, when provided provides a stepped indication that demonstrates progress toward a single goal with an individual bar, they are great for showing action steps or distance from a target number.

## Use Cases

- The step chart is designed to indicate progress through a series of steps, this can be a simple binary, step complete incomplete or optionally allows for a "in progress" state that indicates a step is partially completed. this also provides the option for labeling the chart with primary and secondary text indicators. see the features section for more details.

## Terminology

**Step**: Individual block in the component represented by a colored `<div>` can be completed, in progress or not done.

**Completed**: A possible status of a step that will be displayed in a user selected color.

**In Progress**: An optional status of a step that has not been completed but started, will be displayed in a user provided secondary color.

**Not Started**: Default step status for step not in the other two categories, is set by the component to a default graphite.

## Features (With Code Examples)

Ids step chart is created by using the <ids-step-chart> element.
For an implementation with only a primary label and completed uncompleted steps see the below example.

```html
<ids-step-chart label="2 of 7 steps completed" color="blue-60" step-number="7" value="2">
</ids-step-chart>
```

To set in progress steps you must pass an array of strings or numbers where each item in the array is the number of the step you want to update and set the `progress-color` attribute.
```html
  <ids-step-chart label="2 of 7 steps completed" color="blue-60" step-number="7" value="3" completed-label="5 days overdue" progress-color="red-20">
```

```js
inProgressTwo.stepsInProgress = ['3'];
```

to add a secondary label make use of the completed-label attribute

```html
  <ids-step-chart label="2 of 7 steps completed" color="blue06" step-number="7" value="2" completed-label="5 days remaining">
  </ids-step-chart>
```
IDS step chart also has an available slot `icon` that can be used to append content after the secondary label like so

```html
  <ids-step-chart label="2 of 7 steps completed" color="blue-60" step-number="7" value="3" completed-label="5 days overdue" progress-color="red-20">
    <ids-icon id="alert" slot="icon" icon="warning"></ids-icon>
  </ids-step-chart>
```

## Settings and Attributes

  - `color` {string} Sets the color used for completed steps (must use ids provided colors).
  - `disabled` {boolean} Sets the disabled state.
  - completed-label: secondary label for the component
  - label: primary label for the component usually formatted as "x of y steps completed
  - progress-color: color used for flagged steps in progress (must use ids provided colors)
  - stepsInProgress: an array of steps that should be flagged as in progress
  - step-number: total number of steps in the chart
  - value: total number of steps completed or in progress

## Keyboard Guidelines

This component does not add any new keyboard functionality, steps are not tabbable but text is readable by screen readers.

## Designs

[design doc](https://www.figma.com/file/yaJ8mJrqRRej8oTsd6iT8P/IDS-(SoHo)-Component-Library-v4.5?node-id=760%3A771)

## Converting from Previous Versions (Breaking Changes)

**3.x to 4.x**

- Step Chart was added in v4.3.3
- Step Chart is invoked with `$('#my-element').stepchart();`

**4.x to 5.x**

- Step Chart is now a custom element `<ids-step-chart></ids-step-chart>`
- Settings are now attributes on the custom element

### Converting from 4.x

If you are converting this from the enterprise version you will no longer be using the `data-options` attribute. Properties of the `data-options` objects are implemented as attributes of the `ids-step-chart` component as follows:

- `steps: 7` => `step-number="7"`
- `completed: 2` => `value="2"`
- `extraText: '2 Days Overdue'` => `completed-label="2 Days Overdue"`

The `iconType` option has been replaced with a slot called `icon` that can be injected with the desired markup like so:

```html
<ids-alert slot="icon" icon="warning"></ids-icon>
```

The `inProgress` option has been replaced with a property on the component called `stepsInProgress`. This can be set to an array of numbers corresponding to the number of the steps you want to display as in progress. see this example below

```js
econst element = document.querySelectorAll('ids-step-chart')[3];
element.stepsInProgress = ['3'];
```

Color for `inProgress` steps is not set automatically and a color must be set using the `progress-color` attribute. to duplicate
existing red in progress steps use `red-20`.

labeling for the step chart is handled through the `label` component attribute and there are no special format requirements

## Accessibility Guidelines

Keep in mind that individual steps are not focusable elements as they are purely visual. It is important to keep both primary and secondary labels up to date for screen reader users.

## Regional Considerations

Add info on what behaviors or considerations the developer needs to know regarding when running in different languages.
