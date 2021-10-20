# Ids Hitbox Mixin

This mixin adds hitbox styles to a component. It sets a `44px` height and padding (left and right) of `14px`.

To implement the hitbox mixin:

1. Import `IdsHitboxMixin`
1. Add `IdsHitboxMixin` to the mixes() section
1. Add `IdsHitboxMixin` to the @mixes comment section
1. Make sure to add the `prop` with a value of `hitbox` to append the attribute and class of the hitbox to the root element of the component.

When using it...

1. Set the `hitbox` as attribute to the component template. E.g. `hitbox="true"`
