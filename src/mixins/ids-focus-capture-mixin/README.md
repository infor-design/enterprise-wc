# Ids Focus Capture Mixin

This mixin allows a component to capture keyboard focus from the browser and force it to be retained by the component.  This is useful in components such as [IdsModal](../../components/ids-modal/README.md) to ensure items that exist behind the Modal's overlay, or elsewhere, can't be interacted with until the Modal is dismissed.

This mixin adds two observed attributes to a component:

- `captures-focus`: if true, does not allow keyboard focus (using Tab/Shift+Tab keystrokes) to navigate away from the host component.
- `cycles-focus`: if true, along with `captures-focus`, causes keyboard focus to "loop" or "cycle" around to the first/last avaialble focusable item.

Additionally, several convenience properties are added containing references to first/last/next/previously focusable items.

To use this Mixin in your component,

1. Import `IdsFocusCaptureMixin`
1. Add `IdsFocusCaptureMixin` to the mixes() section
1. Add `IdsFocusCaptureMixin` to the @mixes comment section
1. Make sure you attributes extend `return [...super.attributes]` in the `attributes` to allow propagation of added mixin attributes.
1. Make sure the `connectedCallback` calls `super.connectedCallback();`

See [IdsModal](../../components/ids-modal/README.md) as an example.
