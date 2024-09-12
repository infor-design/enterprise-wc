# ids-pager

The IDS Pager Component is used to provide an interface for browsing paginated data, providing methods of navigating and calculating the pages when provided a baseline of attributes.

## Use Cases

- There is a table, grid, document or other listing of data, which is displayed via pagination.
- Controlling the pagination or keeping track of what is browsed in a data set.
- Presenting digestible portions of large data sets.

## Slots

`start` and `end` slots allow you to position content to the left or the right side of the pager panel. If no slot is provided, the child-contents of the pager component will be automatically inserted into the middle slot.

## Sub-Components

**`<ids-pager-button>`**: represents a navigation button within the pager that is flagged with an attribute flag specifying what clicking it accomplishes e.g. `first`, `last`, `previous`, or `next`.

**`<ids-pager-number-list>`**: provides a list of page numbered buttons which a user can click.

**`<ids-pager-input>`**: provides a way for user to input numbers directly for the parent `ids-pager`.

## Settings (ids-pager)

- `page-size` {number} number of items to paginate
- `page-number` {number} 1-based page index. Should reflect what page number is currently being displayed.
- `total` {number} number of items the pager tracks
- `disabled` {boolean} whether or not to disable this pager and all navigation buttons nested inside of it
- `page-sizes` {Array<string>} A list of page sizes to show in the pager dropdown. Note that adding a new array you may need to set the page size or it will be automatically added to the list.

```js
document.querySelector('ids-pager').pageSize = 100
document.querySelector('ids-pager').pageSizes = [100, 200]
```

## Settings (ids-pager-number-list)

- `disabled` {boolean} whether to override the natural or parent-disabled functionality to specifically disable the number buttons in this component.
- `label` {string} sets the aria label text
- `step` {number} sets the number of step for page number list

## Settings (ids-pager-button)

- `disabled` {boolean} whether to override natural or parent-disabled functionality to specifically disable this button.
- `label` {string} sets the aria label text

## Settings (ids-pager-input)

- `disabled` {boolean} whether to override natural or parent-disabled functionality to specifically disable this button.

## Themeable Parts (ids-pager)

**container** - the overall `ids-pager` container

## Themeable Parts (ids-pager-button)

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
  <section>
    <ids-pager-button previous></ids-pager-button>
    <ids-pager-number-list></ids-pager-number-list>
    <ids-pager-button next></ids-pager-button>
  </section>
  <section slot="end">Right-Aligned Content</section>
</ids-pager>
```

A pager with numbered-page-buttons for navigation, with custom steps limit:
```html
<ids-pager page-size="20" page-number="10" total="1500">
  <ids-pager-button previous></ids-pager-button>
  <ids-pager-number-list step="2"></ids-pager-number-list>
  <ids-pager-button next></ids-pager-button>
</ids-pager>
```

A pager with numbered-page-buttons for navigation, with show all step buttons (no-limit):
```html
<ids-pager page-size="20" page-number="10" total="500">
  <ids-pager-button previous></ids-pager-button>
  <ids-pager-number-list step="-1"></ids-pager-number-list>
  <ids-pager-button next></ids-pager-button>
</ids-pager>
```

A pager with aria-label:
```html
<ids-pager page-size="20" page-number="10" total="1500">
  <ids-pager-button label="Previous page" previous></ids-pager-button>
  <ids-pager-number-list label="Page {num} of {total}"></ids-pager-number-list>
  <ids-pager-button label="Next page" next></ids-pager-button>
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
  <section>
    <ids-pager-button first></ids-pager-button>
    <ids-pager-button previous></ids-pager-button>
    <ids-pager-input></ids-pager-input>
    <ids-pager-button next></ids-pager-button>
    <ids-pager-button last></ids-pager-button>
  </section>
  <section slot="end">
    user defined right-aligned content
  </section>
</ids-pager>
```

A pager with user-defined content aligned to the left and to the right of the central navigation buttons:
```html
<ids-pager page-size="10" total="100" page-number="2">
  <section slot="start">
    user defined left-aligned content
  </section>
  <section>
    <ids-pager-button first></ids-pager-button>
    <ids-pager-button previous></ids-pager-button>
    <ids-pager-input></ids-pager-input>
    <ids-pager-button next></ids-pager-button>
    <ids-pager-button last></ids-pager-button>
  </section>
  <section slot="end">
    user defined right-aligned content
  </section>
</ids-pager>
```

## Keyboard Guidelines

- <kbd>TAB</kbd> Move between `ids-pager-buttons` as well as inputs and `ids-pager-number-list` buttons, and also goes to the next element if at the end of the pager.
- <kbd>SHIFT + TAB</kbd> should work similar to TAB but in reverse, and also to the previous element if at the beginning of the pager.
- <kbd>ENTER</kbd> while focusing on the `ids-pager-input` submits the value

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

All elements will flip to the alternate side in Right To Left mode, including user defined content. Alignment on left and right aligned slots will also flip.

## Converting from Previous Versions (Breaking Changes)

**3.x to 4.x**

- This did not exist as a standalone component
- Datagrid paging has new options - see data grid docs

**4.x to 5.x**

- Pager is now a web component called ids-pager
- Only has a standalone version now (simplified)
- If using properties/settings are now attributes.
- Markup has changed to a custom element `<ids-pager>`
- If using events events are now plain JS events for example
- Can now be imported as a single JS file and used with encapsulated styles
- content is automatically managed/aligned via nesting controls inside of `<ids-pager-section>`
- pagination is controlled via attributes on the `<ids-pager>` (`page-number`, `total`, `page-size`), and manages buttons and controls automatically.
- buttons are managed by `<ids-pager-button>` with given functionality flags e.g. `<ids-pager-button start>`.
- input box can be inserted `<ids-pager-input>`, and a number list with `<ids-pager-number-list>`
