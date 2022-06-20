# Ids Pager Mixin

This mixin adds functionality to display a pager on any component.

1. Include the import for IdsPagerMixin in the `*-base.js` file.

When using it...

1. Test it by adding for example `pagination="client-side"` on the component.
2. Consider adding a test to ids-pager tests.
3. If `pagination="client-side"` is set then
4. If `pager-container` is set on the component, will search given selector in its parents and will add pager to that location.

See `ids-data-grid/ids-data-grid.js` for a good example.
