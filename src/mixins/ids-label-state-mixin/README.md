# Ids Label State Mixin

This mixin controls visibility and dimensions of a shadow root-based label element used in Ids Input and extended/related components.  It also controls the "required" state on labels (used with form validation).

This mixin adds three observed attributes to a component:

- `label` {string}: Controls the text content of the label element
- `label-state` {null|string} Controls the visible state of the label.  When using `hidden`, the label will not be displayed but will still take up physical space on a form.  When using `collapsed`, the label is hidden and does not take up space.
- `label-required` {boolean} If true, the label will display a red star that identifies its field as required.  Note that [IdsValidationMixin's `validate` attribute]('../ids-validation-mixin/README.md) should also be present for this behavior.

Additionally, there is a `setLabelText()` callback that is used for setting the contents.  This can be overridden inside a component if needed

## Ids Label State Parent Mixin

This mixin provides the same observed attributes to a component, but does not attach all the label manipulation logic. This mixin's intention is to be used by larger components where it should be possible to define label state, but will pass that state down into an [IdsInput](../../components/ids-input/README.md) or [IdsTriggerField](../../components/ids-trigger-field/README.md) that exists in the larger component's shadow root.

There are also three corresponding, optional callback methods that will be picked up by this mixin if they are defined in your component:

- `onLabelChange()` - will fire when label contents are changed
- `onLabelStateChange()` - will fire when label state is changed
- `onLabelRequiredChange()` - will fire when the required state is changed.

Some examples of IDS Components using this mixin are [IdsDropdown](../../components/ids-dropdown/README.md), [IdsUpload](../../components/ids-upload/README.md), and [IdsLookup](../../components/ids-lookup/README.md).

## Using these mixins

To use this Mixin in your component,

1. Import `IdsLabelStateMixin` or `IdsLabelStateParentMixin`
1. Add the mixin to the component's `[name]-base.ts` file
1. Add the mixin to the `@mixes` comment section in the component
1. Make sure you attributes extend `return [...super.attributes]` in the `attributes` to allow propagation of added mixin attributes.
1. Make sure the `connectedCallback` calls `super.connectedCallback();`
