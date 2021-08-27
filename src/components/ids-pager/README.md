# Ids Pager Component

The IDS Pager Component is used to provide an interface for browsing paginated data, providing methods of navigating and calculating the pages when provided a baseline of attributes.

## Use Cases

- There is a table, grid, document or other listing of data, which is displayed via pagination.
- Controlling the pagination or keeping track of what is browsed in a data set.
- Presenting digestible portions of large data sets.

## Sub-Components
**`<ids-pager-section>`**: divides the different sections on a pager panel. It will automatically align itself to the left, middle, or right side of the component depending on how many sections are provided.

**`<ids-pager-button>`**: represents a navigation button within the pager that is flagged with an attribute flag specifying what clicking it accomplishes e.g. `first`, `last`, `previous`, or `next`.

**`<ids-pager-number-list>`**: provides a list of page numbered buttons which a user can click.

**`<ids-pager-input>`**: provides a way for user to input numbers directly for the parent `ids-pager`.

## Settings

### &lt;ids-pager&gt;

- `page-size` {number} number of items to paginate
- `page-number` {number} 1-based page index. Should reflect what page number is currently being displayed.
- `total` {number} number of items the pager tracks
- `disabled` {boolean} whether or not to disable this pager and all navigation buttons nested inside of it

### &lt;ids-pager-section&gt;
- no applicable attributes that are user-controlled.

### &lt;ids-pager-number-list&gt;
- `disabled` {boolean} whether to override the natural or parent-disabled functionality to specifically disable the number buttons in this component.

### &lt;ids-pager-button&gt;
- `disabled` {boolean} whether to override natural or parent-disabled functionality to specifically disable this button.

### &lt;ids-pager-input&gt;
- `disabled` {boolean} whether to override natural or parent-disabled functionality to specifically disable this button.

## Themeable Parts

### IdsPager
**container** - the overall `ids-pager` container

### IdsPagerSection
**container** - the `ids-pager-section` container

### IdsPagerButton
**button** - the `ids-button` component
**icon** - the `ids-icon` component

## Features (with code samples)

A pager with a data set that represents 10 entries per page, with 100 items overall, with basic navigation buttons, and a user input:
```html
<ids-pager page-size="10" total="100" page-number="1">
  <ids-pager-button first></ids-pager-button>
  <ids-pager-button previous></ids-pager-button>
  <ids-pager-input></ids-pager-input>
  <ids-pager-button next></ids-pager-button>
  <ids-pager-button last></ids-pager-button>
</ids-pager>
```

A pager with a data set that represents 20 entries per page, with 63 items overall, with basic navigation buttons to go to the next or previous page, and a user input to enter a page number directly:
```html
<ids-pager page-size="20" total="63" page-number="2">
  <ids-pager-button previous></ids-pager-button>
  <ids-pager-input></ids-pager-input>
  <ids-pager-button next></ids-pager-button>
</ids-pager>
```

A pager with numbered-page-buttons for navigation, surrounded by navigation buttons:
```html
<ids-pager page-size="20" page-number="10" total="150">
  <ids-pager-section>
    <ids-pager-button previous></ids-pager-button>
    <ids-pager-number-list></ids-pager-number-list>
    <ids-pager-button next></ids-pager-button>
  </ids-pager-section>
  <ids-pager-section>Right-Aligned Content</ids-pager-section>
</ids-pager>
```

### Disabling Functionality

A pager with all navigation buttons explicitly disabled:
```html
<ids-pager page-size="10" total="100" page-number="2" disabled>
  <ids-pager-button first></ids-pager-button>
  <ids-pager-button previous></ids-pager-button>
  <ids-pager-input></ids-pager-input>
  <ids-pager-button next></ids-pager-button>
  <ids-pager-button last></ids-pager-button>
</ids-pager>
```

A pager with only the `first` button disabled:
```html
<ids-pager page-size="10" total="100" page-number="2">
  <ids-pager-button first disabled></ids-pager-button>
  <ids-pager-button previous></ids-pager-button>
  <ids-pager-input></ids-pager-input>
  <ids-pager-button next></ids-pager-button>
  <ids-pager-button last></ids-pager-button>
</ids-pager>
```

### With Aligned Sections on the Margins

User-defined right aligned content:
```html
<ids-pager page-size="10" total="100" page-number="2">
  <ids-pager-section>
    <ids-pager-button first></ids-pager-button>
    <ids-pager-button previous></ids-pager-button>
    <ids-pager-input></ids-pager-input>
    <ids-pager-button next></ids-pager-button>
    <ids-pager-button last></ids-pager-button>
  </ids-pager-section>
  <ids-pager-section>
    user defined right-aligned content
  </ids-pager-section>
</ids-pager>
```

A pager with user-defined content aligned to the left and to the right of the central navigation buttons:
```html
<ids-pager page-size="10" total="100" page-number="2">
  <ids-pager-section>
    user defined right-aligned content
  </ids-pager-section>
  <ids-pager-section>
    <ids-pager-button first></ids-pager-button>
    <ids-pager-button previous></ids-pager-button>
    <ids-pager-input></ids-pager-input>
    <ids-pager-button next></ids-pager-button>
    <ids-pager-button last></ids-pager-button>
  </ids-pager-section>
  <ids-pager-section>
    user defined right-aligned content
  </ids-pager-section>
</ids-pager>
```

## Keyboard Guidelines

- TAB should between `ids-pager-buttons`, as well as inputs and `ids-pager-number-list` buttons, and also goes to the next element if at the end of the pager.
- SHIFT + TAB should work similar to TAB but in reverse, and also to the previous element if at the beginning of the pager.
- ENTER while focusing on the `ids-pager-input` enters the value ou are currently editing.

## Usage Tips

- the `page-size`, `page-number` and `total` are only useful in the context of the `ids-pager`. They should not be controlled at the level of the interactive buttons or the number list.
- Content can be laid out for additional buttons/interactions/etc other than the `ids-pager-button`, but the standard navigation and user input components should be used wherever possible.
- the page count on the pager can be accessed on the `ids-pager` element at any time via the `pageCount` property via JS for example:
```js
  const idsElement = document.querySelector('ids-pager');
  const pageCount = idsElement.pageCount;
```

## Accessibility

- 1.4.3 Contrast (Minimum) - there should be enough contrast on the background which the wizard resides on in the page.

## Regional Considerations

All elements will flip to the alternate side in Right To Left mode, including user defined content. Alignment on left and right aligned `ids-pager-section` will also flip.
