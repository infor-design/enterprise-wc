# Ids Pager Component

The IDS Pager Component is used to provide an interface for browsing paginated data, providing methods of navigating and calculating the pages when provided a baseline of attributes.

## Use Cases

- There is a table, grid, document or other listing of data, which is displayed via pagination.
- Controlling the pagination or keeping track of what is browsed in a data set.

## Sub-Components
**`<ids-pager-section>`**: divides the different sections on a pager panel. It will automatically align itself to the left, middle, or right side of the component depending on how many sections are provided.

**`<ids-pager-button>`**: represents a navigation button within the pager that is flagged with an attribute flag specifying what clicking it accomplishes e.g. `first`, `last`, `previous`, or `next`.

## Settings

### &lt;ids-pager&gt;

- `page-size` {number} number of items to paginate
- `page-number` {number} 1-based page index. Should reflect what page number is currently being displayed.
- `total` {number} number of items the pager tracks
- `disabled` {boolean} whether or not to disable this pager and all navigation buttons nested inside of it

### &lt;ids-pager-section&gt;
- no applicable attributes that are user-controlled.

### &lt;ids-pager-numberlist&gt;
- `disabled` whether to override the natural or parent-disabled functionality to specifically disable the number buttons in this component.

### &lt;ids-pager-button&gt;
- `disabled` whether to override natural or parent-disabled functionality to specifically disable this button.

## Themeable Parts

### IdsPager
**container** - the overall `ids-pager` container

### IdsPagerSection
**container** - the `ids-pager-section` container

## Features (with code samples)

TODO

## Usage Tips

- the `page-size`, `page-number` and `total` are only useful in the context of the `ids-pager`. They should not be controlled at the level of the interactive buttons or the number list.
- Content can be laid out for additional buttons/interactions/etc other than the `ids-pager-button`, but the standard navigation and user input components should be used wherever possible.