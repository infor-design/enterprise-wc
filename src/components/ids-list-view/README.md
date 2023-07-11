# Ids List View Component

## Description

Displays a set of related data objects and their attributes in list format.

## Use Cases

- Best for limited attribute data that may or may not include clear differentiators like status.
- Used to display relevant objects. The list view container can feature checkboxes, search bar, hyperlinks, and other elements.
- Allows users to assign/remove objects. Displays when one or more rows are selected.
- Can alert users of updates on objects.
- Lists may be single, multiple or mixed selected
- Lists can be filter data by using the search field
- You can have a fixed list toolbar on top, which may contain a title and filtering/search options
- You can have a contextual toolbar for selected items
- Pagination is supported

## Terminology

- Card: UI design pattern that groups related information that resembles a card
- Group Action: A special toolbar inside the card content area that can be used to act on the content.

## Features (With Code Examples)

This example shows using a list view with an html template element bound to a dataset. This example is showing the list in a card but the card is optional.

The template shows the use of a string substitution to access the data element. Note that `dataset` is required to loop over the dataset option passed into the control.

```html
  <ids-card>
  <div slot="card-header">
    <ids-text font-size="20" type="h2">Card Title One</ids-text>
  </div>
  <div slot="card-content">
    <ids-list-view id="list-view-1" virtual-scroll="true">
      <template>
        <ids-text font-size="16" type="h2">${productName}</ids-text>
        <ids-text font-size="12" type="span">Count: ${units}</ids-text>
        <ids-text font-size="12" type="span">Price: $ ${unitPrice}</ids-text>
      </template>
    </ids-list-view>
  </div>
</ids-card>
```

```js
  const listView = document.querySelector('#list-view-1');
  listView.data = products;
```

List view using `<ids-list-view-item />` child components.

```html
<ids-list-view selectable="mixed" sortable>
  <ids-list-view-item>
    <ids-text font-size="16" type="h2">First Column</ids-text>
    <ids-text font-size="12" type="span">ID: 1</ids-text>
    <ids-text font-size="12" type="span">Comments: One</ids-text>
  </ids-list-view-item>
  <ids-list-view-item active>
    <ids-text font-size="16" type="h2">Second Column</ids-text>
    <ids-text font-size="12" type="span">ID: 2</ids-text>
    <ids-text font-size="12" type="span">Comments: Two</ids-text>
  </ids-list-view-item>
  <ids-list-view-item disabled>
    <ids-text font-size="16" type="h2">Third Column</ids-text>
    <ids-text font-size="12" type="span">ID: 3</ids-text>
    <ids-text font-size="12" type="span">Comments: Three</ids-text>
  </ids-list-view-item>
  <ids-list-view-item selected>
    <ids-text font-size="16" type="h2">Third Column</ids-text>
    <ids-text font-size="12" type="span">ID: 3</ids-text>
    <ids-text font-size="12" type="span">Comments: Three</ids-text>
  </ids-list-view-item>
</ids-list-view>
```

List view with pagination and mixed selectable type.

```html
<ids-list-view
  id="list-view-1"
  item-height="76"
  selectable="mixed"
  pagination="client-side"
  page-size="5"
>
  <template>
    <ids-text font-size="16" type="h2">${productName}</ids-text>
    <ids-text font-size="12" type="span">Count: ${units}</ids-text>
    <ids-text font-size="12" type="span">Price: $ ${unitPrice}</ids-text>
  </template>
</ids-list-view>
```

```js
  const listView = document.querySelector('#list-view-1');
  listView.data = products;
```

List view with pagination with card footer.

```html
<ids-card>
  <div slot="card-header">
    <ids-text font-size="20" type="h2">Product List</ids-text>
  </div>
  <div slot="card-content">
    <ids-list-view
      id="list-view-1"
      pagination="client-side"
      page-size="10",
      pager-container="#cardfooter-list-view-1"
    >
      <template>
        <ids-text font-size="16" type="h2">${productName}</ids-text>
        <ids-text font-size="12" type="span">Count: ${units}</ids-text>
        <ids-text font-size="12" type="span">Price: $ ${unitPrice}</ids-text>
      </template>
    </ids-list-view>
  </div>
  <div id="cardfooter-list-view-1" slot="card-footer" no-padding>
  </div>
</ids-card>
```

```js
  const listView = document.querySelector('#list-view-1');
  listView.data = products;
```

List view with embellishment types.

```html
<ids-list-view id="list-view-1">
  <template>
    ${#escalated}
      ${#disabled}
        <ids-text font-size="12" type="span" status="error" disabled>Escalated (${escalated}X)</ids-text>
      ${/disabled}
      ${^disabled}
        <ids-text font-size="12" type="span" status="error">Escalated (${escalated}X)</ids-text>
      ${/disabled}
    ${/escalated}
    <ids-text font-size="16" font-weight="semi-bold" type="p">${productName}</ids-text>
    <ids-hyperlink href="https://www.example.com/${productId}" target="_blank">${productId}</ids-hyperlink>
    <ids-text font-size="12" type="span">Count: ${units}</ids-text>
    <ids-text font-size="12" type="span">Price: $ ${unitPrice}</ids-text>
    <ids-text font-size="12" type="span" text-align="end">$ ${totalPrice}</ids-text>
  </template>
</ids-list-view>
```

```js
  const listView = document.querySelector('#list-view-1');
  listView.data = products;
```

List view using search field.

```html
<ids-list-view id="list-view-1" searchable>
  <template>
    <ids-text font-size="16" type="h2">${productName}</ids-text>
    <ids-text font-size="12" type="span">Count: ${units}</ids-text>
    <ids-text font-size="12" type="span">Price: $ ${unitPrice}</ids-text>
  </template>
</ids-list-view>
```

```js
  const listView = document.querySelector('#list-view-1');
  listView.searchableTextCallback = (item: any) => item.productName;
  listView.data = products;
```

List view using search field thru slot.

```html
<ids-list-view id="list-view-1">
  <ids-search-field slot="search" label="List view search field" label-state="collapsed" size="full" clearable no-margins></ids-search-field>
  <template>
    <ids-text font-size="16" type="h2">${productName}</ids-text>
    <ids-text font-size="12" type="span">Count: ${units}</ids-text>
    <ids-text font-size="12" type="span">Price: $ ${unitPrice}</ids-text>
  </template>
</ids-list-view>
```

```js
  const listView = document.querySelector('#list-view-1');
  listView.searchableTextCallback = (item: any) => item.productName;
  listView.data = products;
```

List view using search field thru ID.

```html
  <ids-card>
  <div slot="card-header">
    <ids-text font-size="20" type="h2">Card Title One</ids-text>
  </div>
  <div slot="card-content">
    <ids-search-field
      placeholder="Search products"
      label="List view search field"
      color-variant="card"
      label-state="collapsed"
      id="list-view-1-search-field"
      size="full"
      clearable
      no-margins
    ></ids-search-field>
    <div class="list-container">
      <ids-list-view id="list-view-1" search-field-id="list-view-1-search-field">
        <template>
          <ids-text font-size="16" type="h2">${productName}</ids-text>
          <ids-text font-size="12" type="span">Count: ${units}</ids-text>
          <ids-text font-size="12" type="span">Price: $ ${unitPrice}</ids-text>
        </template>
      </ids-list-view>
    </div>
  </div>
</ids-card>
```

```js
  const listView = document.querySelector('#list-view-1');
  listView.searchableTextCallback = (item: any) => item.productName;
  listView.data = products;
```

List view using search field with custom search filter.

```html
<ids-list-view id="list-view-1" searchable>
  <template>
    <ids-text font-size="16" type="h2">${productName}</ids-text>
    <ids-text font-size="12" type="span">Count: ${units}</ids-text>
    <ids-text font-size="12" type="span">Price: $ ${unitPrice}</ids-text>
  </template>
</ids-list-view>
```

```js
  const listView = document.querySelector('#list-view-1');

  // Set custom search filter to match
  listView.searchFilterCallback = (term: string) => {
    const response = (item: any): boolean => {
      const lcTerm = (term || '').toLowerCase();
      const lcText = (item.comments || '').toLowerCase();

      const match = lcText.indexOf(lcTerm) >= 0;
      return !match;
    };
    return response;
  };

  // Set data to list
  listView.data = products;
```

## Settings and Attributes

- `height` {number|string} sets the expected height of the viewport for virtual scrolling
- `hideCheckboxes` {boolean} sets the checkboxes to not render if true, only apply to multiple selection
- `itemHeight` {number|string} sets the expected height of each item
- `label` {string} sets the aria label text
- `searchFieldId` {string} ID of the search field element to use for the search
- `searchFilterMode` {'contains'|'keyword'|'phrase-starts-with'|'word-starts-with'} sets the search filter mode
- `searchTermCaseSensitive` {boolean} sets search term case sensitive
- `searchTermMinSize` {number} sets search term min size, will trigger filtering only when its length is greater than or equals to term value.
- `searchable` {boolean} sets searchable which allows list view to be filtered.
- `selectable` {string} sets the selection mode of the listview: `single`, `multiple`, `mixed`
- `sortable` {boolean} sets the items to be sortable
- `suppressDeactivation` {boolean} sets the items to be suppress deactivation for mixed selection only
- `suppressDeselection` {boolean} sets the items to be suppress deselection for single selection only
- `suppressHighlight` {boolean} sets search term text to be suppress highlight when using searchable
- `virtualScroll` {boolean} sets the list view to use virtual scrolling for a large amount of items

## Themeable Parts

- `container` allows you to further style the root container element
- `list` allows you to further style the `<ul>` elements text element
- `listitem` allows you to further style the `<li>` elements text element
- `search` allows you to further style the list view search slot element
- `searchfield-container` allows you to further style the list view search-field container element
- `searchfield-field-container` allows you to further style the list view search-field field container element
- `searchfield-input` allows you to further style the list view search-field input element
- `searchfield-popup` allows you to further style the list view search-field popup element

## Events

- `beforeselected` Fires before selected an item, you can return false in the response to veto
- `selected` Fires after selected an item
- `beforedeselected` Fires before deselected an item, you can return false in the response to veto
- `deselected` Fires after deselected an item
- `beforeitemactivated` Fires before activated an item, you can return false in the response to veto
- `itemactivated` Fires after activated an item
- `beforeitemdeactivated` Fires before deactivated an item, you can return false in the response to veto
- `itemdeactivated` Fires after deactivated an item
- `selectionchanged` Fires after selection changed, when use with selectAll(), deselectAll() or toggleAll()
- `filtered` Fires after search term changed have detail type: 'apply' | 'clear'

## Methods

- `getAllLi(): array<unknown>` Get list of all items
- `getAllSwappableItems(): array<unknown>` Get list of all swappable items
- `dataIndex(index: number): number|null` Get data index for given page index
- `pageIndex(dataIndex: number): number|null` Get page index for given data index
- `isInPage(dataIndex: number): boolean` Check if given data index in current page
- `focusLi(li?: HTMLElement|null): void` Set the focus for given list item
- `getFocusedLi(): HTMLElement` Get currently focused list item
- `getPreviousLi(li: HTMLElement): HTMLElement|undefined` Get previous list item for a given list item
- `getNextLi(li: HTMLElement): HTMLElement|undefined` Get next list item for a given list item
- `activateItem(dataIndex: number): boolean` Set a list item to be activated, in dataset
- `deactivateItem(dataIndex: number): boolean` Set a list item to be deactivated, in dataset
- `select(dataIndex: number): boolean` Set a list item to be selected, in dataset
- `deselect(dataIndex: number): boolean` Set a list item to be deselect, in dataset
- `selectAll(): void` Set a all list items to be selected
- `deselectAll(): void` Set a all list items to be deselected
- `searchFilterCallback(term: string): (((item: object) => boolean))` Set search filter callback, use for custom filter to match
- `searchableTextCallback(item: object): string` Set searchable text callback

## States and Variations (With Code Examples)

- Hover
- Selected
- Focus
- Disabled

## Keyboard Guidelines

- <kbd>Tab</kbd> When a list is tabbed to, select the first item if nothing else is already selected. A second tab will take the user out of the widget to the next tab stop on the page.
- <kbd>Up/down arrow</kbd> navigate up and down the list.
- <kbd>Shift+F10</kbd> If the current item has an associated context menu, then this key combination will launch that menu.
- <kbd>Space</kbd> toggles <a href="http://access.aol.com/dhtml-style-guide-working-group/#checkbox" target="_blank">checkboxes</a> in the case of multi select or a list item in case of normal select

## Responsive Guidelines

- The list is 100% of the parent container in height and width so can be used in a widget object or responsive grid object.
- The list body will expand vertically and horizontally to fill it the size of its parent container.
- When used in homepages, special rules apply with sizes.

## Converting from Previous Versions (Breaking Changes)

**3.x to 4.x**

- Single select roughly replaces the inforListBox component.
- Multi select is a new feature, however it replaces the listbox with checkboxes construct.

**4.x to 5.x**

- The List View component has been changed to a web component and renamed to ids-list-view.
- If using properties/settings these are now attributes.
- Markup has changed to a custom element `<ids-list-view></ids-list-view>`
- If using events events are now plain JS events for example
- The template is now a template element that uses simple string substitution
- Can now be imported as a single JS file and used with encapsulated styles (in some browsers)
- Alternate row colors is deprecated

## Accessibility Guidelines

- 1.1.1 Non-text Content - All images, links and icons have text labels for screen readers when the formatters are used.
- 1.4.1 Use of Color - Color is not used as the only visual means of conveying information, indicating an action, prompting a response, or distinguishing a visual element. Ensure the color tags that indicate state like OK, cancel, ect have other ways to indicate that information. This is failing.
- 1.4.3 Contrast (Minimum) - The visual presentation of text and images of text has a contrast ratio of at least 4.5:1.  All statuses and objects must pass.
- 2.1.1 Keyboard - Make all functionality available from a keyboard. The grid has keyboard shortcuts and is usable with a screen reader due to the addition of aria tags.

## Regional Considerations

Titles should be localized in the current language. All elements will flip to the alternate side in Right To Left mode. Consider that in some languages text may be a lot longer (German) and in some cases it cant be wrapped (Thai). For some of these cases text-ellipsis is supported.
