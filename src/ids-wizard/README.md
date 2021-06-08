# Ids Wizard Component

## Description

Displays feedback about a current process. A user can view a depiction of their current status within a process, and may optionally navigate between points. Best for displaying progress relative to the start and finish of a user workflow.

## Use Cases

- displaying a list of steps that have to be fulfilled in a given/pre-determined order.
- optionally allowing a user to traverse a set of, or part of a set of steps.

## Terminology

- **Wizard**: the overall flow/process
- **Step**: an individual step in the IdsWizard component; represented here by `IdsWizardStep`/`<ids-wizard-step>`

## Themeable Parts
- `wizard` allows you to style the overall wizard.
- `step` allows you to style the step (markers + labels).
- `path-segment` allows you to further style the line segments between markers.

## Features (With Code Examples)

A wizard is created by using the custom `ids-wizard` element. It's sub-components/steps are represented by `<ids-wizard-step>`.

Content within the `<ids-wizard-step>` instances will be the text displayed in the label at each of these steps.

The current step number a wizard is showing has been traversed is denoted now only with the `step-number` attribute on `ids-wizard`.

```html
<ids-wizard step-number=1>
  <ids-wizard-step>Step One<ids-wizard-step>
  <ids-wizard-step> Step Two</ids-wizard-step>
</ids-wizard>
```

## Settings and Attributes

- `clickable` `{boolean}` If set, a user can click each step. Note that this is also settable within the `ids-wizard-step` children components to only enable specific step(s) to be clickable.
- `step-number` the current step number.

## Keyboard Guidelines

- TAB should move to next step and/or label.
- SHIFT + TAB should move to previous step and/or label.
- ENTER key should select the focused label/step as well as change the page URL hash.

## Responsive Guidelines

- The wizard component's width should not exceed the width of the page.
- The labels chosen and number of steps should fit within the page; or at least be obvious enough that a user can discern what labels achieve what function.

## Converting from Previous Versions

## Designs

## Accessibility Guidelines

- 1.4.3 Contrast (Minimum) - there should be enough contrast on the background which the wizard resides on in the page.

## Regional Considerations

Label text should be localized in the current language. All elements will flip to the alternate side in Right To Left mode. Consider that in some languages text may be a lot longer (German). And in some cases it cant be wrapped (Thai). For some of these cases text-ellipsis is supported.
