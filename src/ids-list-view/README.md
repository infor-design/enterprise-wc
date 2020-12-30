# Ids List View Component

## Description

Displays a set of related data objects and their attributes in list format.

## Use Cases

- Best for limited attribute data that may or may not include clear differentiators like status.
- Used to display relevant objects. The listview container can feature checkboxes, search bar, hyperlinks, and other elements.
- Allows users to assign/remove objects. Displays when one or more rows are selected.
- Can alert users of updates on objects.
- Lists may be single or multiple selected
- You can have a fixed list toolbar on top, which may contain a title and filtering/search options
- You can have a contextual action toolbar for selected items
- Paging is supported

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

## Converting from Previous Versions

** From 3.x to 4.x**
- Single select roughly replaces the inforListBox component.
- Multiselect is a new construct, however it replaces the listbox with checkboxes construct.

** From 4.x to 5.x**

- If using properties/settings these are now attributes.
- Markup has changed to a custom element `<ids-list-view></ids-list-view>`
- If using events events are now plain JS events for example
- The template is now a template element that uses simple string substitution
- Can now be imported as a single JS file and used with encapsulated styles (in some browsers)

## Accessibility Guidelines

- 1.1.1 Non-text Content - All images, links and icons have text labels for screen readers when the formatters are used.
- 1.4.1 Use of Color - Color is not used as the only visual means of conveying information, indicating an action, prompting a response, or distinguishing a visual element. Ensure the color tags that indicate state like OK, cancel, ect have other ways to indicate that information. This is failing.
- 1.4.3 Contrast (Minimum) - The visual presentation of text and images of text has a contrast ratio of at least 4.5:1.  All statuses and objects must pass.
- 2.1.1 Keyboard - Make all functionality available from a keyboard. The grid has keyboard shortcuts and is usable with a screen reader due to the addition of aria tags.

## Regional Considerations

Titles should be localized in the current language. All elements will flip to the alternate side in Right To Left mode. Consider that in some languages text may be a lot longer (German) and in some cases it cant be wrapped (Thai). For some of these cases text-ellipsis is supported.
