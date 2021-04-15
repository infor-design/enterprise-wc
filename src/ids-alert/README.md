# Ids Alert Component

## Description

The IDS Alert component used to communicate as part of a display message that gives users attention, affects an application, feature or a page. This component consists of different types such as `error`, `warning`, `success`, and `info` that represents its color.

## Use Cases

Typically, these alerts are mostly effective to gain attention of the status of your application.

## Terminology

- **Type**: Type is basically the status of an alert.
- **Icon**: Icon is the symbol of the alert.

## Feature (With the Code Examples)

An alert is created by using the `ids-alert`. It has a `type` property to set the desire alert icon.

```html
<ids-alert icon="info"></ids-alert>
<ids-alert icon="success"></ids-alert>
<ids-alert icon="alert"></ids-alert>
```

An alert can be used in a disabled situation so comes with a disabled style

```html
<ids-alert icon="info" disabled="true"></ids-alert>
```

## Themeable Parts

- `icon` allows you to further style the icon element

## States and Variations

- Color
- Size
- Alert

## Keyboard Guidelines

Alert icons do not have tab stops or keyboard interaction on their own. However, they may be placed in a grid cell or other object that has tab focus.

## Responsive Guidelines

- Flows within its parent/placement and is usually centered vertically.

## Alternate Designs

Icons differ in the two provided theme/icon versions.

## Accessibility

The traffic light colors are accessibility violations for contrast, however, the high contrast theme provides an alternative that passes. In addition, in context text should be used as color alone cannot provide the meaning.

## Regional Considerations

Some icons that indicate direction will be flipped when in Right-To-Left languages. This is a TODO still.
