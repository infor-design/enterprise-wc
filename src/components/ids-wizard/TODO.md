# TODO for Ids-Wizard

Major

- [ ] Re-evaluate current solution and try to simplify existing features
- [ ] Add `onStepChange` callback for step changes by user interaction or programmatically
- [ ] Implement Change to short labels on lower sizes (alternate, shorter text string applied using a different attribute on IdsWizardStep -- `short-label`?)
- [ ] Add an attribute for disabling URI-hash changes when steps are clicked (`no-link`?)
- [ ] Test screen reader/accessibility (should be similar to tabs) and fix/create ARIA attributes
- [ ] Add theme support (move current colors into `&[mode="light"]` theme, add dark/contrast colors, and implement Theme Mixin)
- [ ] Add standalone CSS examples and related styles

Minor

- [ ] Do not use wait() in wizard test logic for rendered() in Jest

Original issue: #126
