# Ids Hide Focus Mixin

Toggles CSS class for a component container depends on how the component receives focus, clicked or on key entry (tabs or arrows).

This mixin adds one observed attribute to a component:

- `hide-focus` {boolean}: Whether or not the mixin should be enabled. Defaults to true

Events:
- `hidefocusadd` - Fires when the CSS class is added
- `hidefocusremove` - Fires when the CSS class is removed

To use this mixin in your component:

1. Import `IdsHideFocusMixin` and add to the component
2. Add `IdsHideFocusMixin` to the @mixes comment section
3. Use `.hide-focus` class in the component styles to adjust focus state (for example `&:not(.hide-focus):focus`)
4. if you need the classes on the host element set `isHost` in the constructor
