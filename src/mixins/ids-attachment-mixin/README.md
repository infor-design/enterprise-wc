# Ids Attachment Mixin

This mixin injects an `attachment` attribute into a component.  This attribute accepts a string that is used as a CSS selector to choose another element within the same document/Shadow root.  If an element reference is connected successfully, this component can be optionally appended to the element by using the provided `appendToTargetParent()` method.  To return the component back to its original element, the provided `appendToOriginalParent()` method can be used.
