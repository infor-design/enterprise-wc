# Ids Slider Component

## Description

Displays a range of selectable values(s) between a minimum and maximum, which can be controlled by the thumb(s) along the track of the slider. Configurations include the default (1 thumb), a range slider (2 thumbs), and a step slider (1 thumb and x amount of ticks). They can also be converted from horizontal (default) to vertical orientation. The value(s) can be modified by either clicking the area around the track, by dragging the thumb back and forth, or by focusing and pressing the arrow keys.  A user can select a single value or range of values.

## Use Cases

- Control an input with limited options through clicking/dragging/keyboard interaction.
- Best for showing a user's current selection relative to the lower and upper limits of a scale.

## Terminology

- **Minimum**: The smallest value possible, on one end of the slider
- **Maximum**: The largest value possible, on the other end of the slider
- **Thumb**: The circular button that can be dragged back and forth on the slider to control input
- **Tick**: The dots along the step slider that indicate the amount of choices for input
- **Track**: The bar which the thumb moves along
- **Track area**: The area around the track which can be clicked to modify the input value

## Settings (Attributes)

- `value` {number} set the primary value of the slider
- `value-secondary` {number} set the secondary value of the slider (applicable only for range slider)
- `min` {number} set the minimum value of the slider
- `max` {number} set the maximum value of the slider
- `color` {string} set the color of the slider
- `type` {'single' | 'range' | 'step'} set the type of the slider
- `show-tooltip` {boolean} if true, allows the display of a Tooltip on each slider handle during interactions
- `step-number` {number >= 2} number of steps (applicable only for the step slider)
- `vertical` {boolean}

## Settings (Non-attributes)

- `labels` {array} set the list of labels you want (applicable only for step slider)

## Events

- `drag` - passed up from Slider's thumbs in ShadowRoot, which are controlled by [IdsDraggable](../ids-draggable/README.md).  Listening to this event can enable special changes on the dragging of slider handles

## Accessibility

Users can tab to focus on the thumb with <kbd>Tab<kbd> and modify values with <kbd>Arrow Up/Down/Left/Right</kbd>.

## Features (With Code Samples)

A simple single slider from 0 to 100

```html
<ids-slider value="50" min="0" max="100"></ids-slider>
```

A range slider that can handle negative and positive values

```html
<ids-slider type="range" min="-50" max="50"></ids-slider>
```

A step slider with custom color and 5 intervals

```html
<ids-slider type="step" step-number="5" color="green"></ids-slider>
```

A vertical step slider witih 12 intervals

```html
<ids-slider vertical type="step" step-number="12"></ids-slider>
```

### Custom labels

Custom label strings can be applied to a Slider with `type="step"` set.

```html
<ids-slider type="step"></ids-slider>
```

To add custom labels, the `step-number` attribute must match the size of the array of labels to be applied.  Absent this match, the labels will be hidden:

```js
const labels = ['very bad, poor, average, good, excellent'];
const slider = document.querySelector('ids-slider');

slider.labels = labels;
slider.stepNumber = labels.length;
```

## Responsive Guidelines

- The slider stretches to 100% width of its container (horizontal orientation)
- The slider has a minimum height of 300px (vertical orientation)

## Converting from Previous Versions (Breaking Changes)

**3.x to 4.x**

- Slider was a new component in v4.0.0
- Slider can be invoked with `$('#my-element').slider();`

**4.x to 5.x**

- Slider is now a custom element `<ids-slider></ids-slider>`
- Slider options are avaiable as attributes (such as `vertical`, `type`, etc)

### Converting from 4.x

```html
<div class="field">
  <label for="slider-regular-example">Regular</label>
  <input id="slider-regular-example" name="slider-regular" class="slider" type="range"/>
</div>
```
is the 4.x equivalent of the web component example below

```html
<ids-slider type="single"></ids-slider>
```
