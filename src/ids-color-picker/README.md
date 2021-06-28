# Ids Color Picker

## Description

The color picker consists of a custom element `<ids-color-picker></ids-color-picker>`. Once initialized, it functions similarly to a dropdown except that the list shows a color palette in the popup. After selecting a color selection, the hex code and swatch will be updated with the new value. 

## Behavior Guidelines

The Color Picker by default supports colors within a pre-configured palette of IDS colors. You can optionally add your own list of colors by nesting a `<ids-color></ids-color>` custom element indside `<ids-color-picker></ids-color-picker>`.

## Settings and Attributes
- `value` {string} Sets the value attribute to displayed the color of selected `value="#b94e4e"`
- `label` {string} Sets the label attribute which will be displayed above the color picker web component `label="Color Picker"`
- `disabled` {boolean} Sets the disabled attribute which will disabled the entire color picker web component `disabled="true"` Valid values are 'true' | 'false'
- `readyonly` {boolean} Sets the readonly attribute. Valid values are 'true' | 'false'
- `mode` {string} Sets the theme mode
- `version` {string} Sets the theme version

## Code Examples

A basic use case of the color picker with a few color options.
```html
<ids-color-picker>
  <ids-color hex="#b94e4e"></ids-color>
  <ids-color hex="#000000"></ids-color>
  <ids-color hex="#ffffff"></ids-color>
  <ids-color hex="#333333"></ids-color>
  <ids-color hex="#f5f5f5"></ids-color>
  <ids-color hex="#cccccc"></ids-color>
</ids-color-picker>
```

## Converting from Previous Versions

### Version - 4.x
```html
<div class="field">
  <label for="background-color">Background Color</label>
  <input class="colorpicker" value="#ffa800" id="background-color" type="text" />
</div>
```

### Version - 5.x
```html
<ids-color-picker id="color-picker-1" disabled="false" label="Ids Color Picker">
  <ids-color hex="#1A1A1A"></ids-color>
  <ids-color hex="#292929"></ids-color>
  <ids-color hex="#383838"></ids-color>
  <ids-color hex="#454545"></ids-color>
  <ids-color hex="#5C5C5C"></ids-color>
  <ids-color hex="#737373"></ids-color>
  <ids-color hex="#999999"></ids-color>
  <ids-color hex="#BDBDBD"></ids-color>
</ids-color-picker>
```
## Keyboard Guidelines

- <kbd>Tab/Shift+Tab</kbd>
- <kbd>Enter</kbd>
