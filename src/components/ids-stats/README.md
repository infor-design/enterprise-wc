# Ids Stats Component

## Description

Stats are UI embellishments that are used in widgets to display statistical information on widgets primarily. The consist of several elements in a layout with a trend value, a KPI, a main label and a sub label. The stats can also be selectable/clickable.

## Use Cases

- A newer version of the "counts" component. But can primarily only be used in widgets.
- Use when you want users to contribute data to your website and let them organize their content themselves.

## Dos and Don'ts

- Overcrowd your content with Stats, so people can see the data clearly.
- Don't use too many stats in order to use them clearly to capture the page meaning.

## Terminology

- **KPI**: Abbreviation for key performance indicator

## Features (With Code Examples)

A simple state component with all options.

```html
<ids-stats
  trend-label="+100.21"
  icon="rocket"
  status-color="error"
  kpi="$893"
  main-label="Revenue Calculation"
  subtitle="qa 2024">
</ids-stats>
```

## Class Hierarchy

- IdsStats
    - IdsBox
    - IdsElement
- Mixins
    - IdsEventsMixin
    - IdsKeyboardMixin
- Uses
    - IdsIcon
    - IdsText
    - IdsLayoutFlex

## Settings (Attributes)

- `trendLabel` {string} Used to showcase price or amount trending up or down (Optional). If the data contains a + it is shown in success color with a trend icon. If the data is - it is shown in error color.
- `icon` {string} Use to call attention to status of the KPI. Can be colored to bring attention (via statusColor. (Optional in larger KPI format).
- `statusColor` {string} Sets the color of the icon. Can be error, info, success, warning or any palette color like azure, emerald, amber ect.
- `kpi` {string} Large center label. Show up to 6 characters in small size in the KPI area.
- `mainLabel` {string} Main KPI Label. Will truncate if too big.
- `subtitle` {string} Extra details on the KPI. Single line. Auto truncates.

## Events

- `selected` Fires when selecting a stat
- `deselected` Fires when unselecting a stat

## Themeable Parts

- `stat` allows you to further style the main container

## States and Variations

- Color
- Status Color
- Selected

## Keyboard Guidelines

- <kbd>Enter/Space</kbd>: If the stat is selectable then this will select the stat

## Responsive Guidelines

- Flows within a widget so home page guidelines apply

## Converting from Previous Versions (Breaking Changes)

**4.x to 5.x**

- Stats are now custom elements `<ids-stats></ids-stats>`
- If using events events are now plain JS events. `selected`, `deselected`
- If using properties/settings these are now attributes: `kpi`, `main-label`
- Can now be imported as a single JS file and used with encapsulated styles

## Accessibility Guidelines

- 1.4.1 Use of Color - Color is not used as the only visual means of conveying information, indicating an action, prompting a response, or distinguishing a visual element. Ensure the color tags that indicate state like OK, cancel, ect have other ways to indicate that information. This is failing.
- 1.4.3 Contrast (Minimum) - The visual presentation of text and images of text has a contrast ratio of at least 4.5:1.   Ensure the color tags pass contrast.

## Regional Considerations

Labels should be localized in the current language. The contents will flip to the alternate side in Right To Left mode. Consider that things like dollar signs, plus and minus need to be localized. (We may add this as a future feature if requested)
