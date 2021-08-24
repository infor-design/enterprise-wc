## Ids Resize Mixin

This mixin contains lifecycle methods for making a component detect page and element resizing.  The mixin allows a component to be registered against a global instance of ResizeObserver, which can trigger size changes throughout the UI, and fire a `refresh()` method on the component if one is defined.  The mixin also has lifecycle methods for setting up and tearing down a MutationObserver that can will fire a `refresh()` method on the component if one is defined.
