# Ids Pager Component

## Use Cases

## Terminology
Page Section: `IdsPageSection`/`<ids-page-section>`; represents a panel on the pager (e.g. left, middle, right/up to three are embedded in the component, otherwise just one main section).

### Alignment

### Other

## Settings

- `page-size` {number} number of items to paginate.
- `page-number` {number} 0-based page index. Represents what page is currently being viewed.
- `page-size` {number} how many pages to display per-page.

## Themeable Parts

### IdsPager
**container** - the overall `ids-pager` container

### IdsPagerSection
**container** - the `ids-pager-section` container

## Features (with code samples)

```html
<ids-pager>
  Test Content
</ids-pager>
```

<ids-pager>
  <ids-pager-section>Test Content</ids-pager-section>
  <ids-pager-section>Right-Menu Content</ids-pager-section>
</ids-pager>

<ids-pager>
  <ids-pager-section>Left Content</ids-pager-section>
  <ids-pager-section>Test Content</ids-pager-section>
  <ids-pager-section>Right-Menu Content</ids-pager-section>
</ids-pager>

## Usage Tips
