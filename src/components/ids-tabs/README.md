# ids-tabs

## Description

Tabs are a navigation element used to allow users to easily access different areas of a site or different parts of an individual page. A user can navigate between page sections with a tab. Best for communicating different views of the data, or offering navigation between related data.
way to highlight which section/content in a page you are currently
focused on.

## Use Cases

- Used when need information to be highly scannable and to simplify navigation.
- Used when a page needs a more organized structure.

## Features (With Code Examples)

A normal default horizontal tab component.

```html
<ids-tabs value="one">
    <ids-tab value="one">Example One</ids-tab>
    <ids-tab value="two">Example Two</ids-tab>
    <ids-tab value="three">Example Three</ids-tab>
</ids-tabs>
```

A vertical tabs component.

```html
<ids-tabs value="one" orientation="vertical">
    <ids-tab value="one">Example One</ids-tab>
    <ids-tab value="two">Example Two</ids-tab>
    <ids-tab value="three">Example Three</ids-tab>
</ids-tabs>
```

Using a tab context to show the active tab content in `ids-tab-content`.

```html
<ids-tabs-context>
    <!-- tabs context has no outward styling or content, but width/height or display can be set -->
    <ids-tabs value="one">
        <ids-tab value="one">Section 1</ids-tab>
        <ids-tab value="two">Section 2</ids-tab>
        <ids-tab value="three">Section 3</ids-tab>
    </ids-tabs>
    <ids-tab-content value="one">
        This will be initially visible
    </ids-tab-content>
    <ids-tab-content value="two">
        If ids-tabs value="two" is selected, or ids-tab with value "two"
        is set as selected, then this will be visible and one will be hidden
    </ids-tab-content>
    <ids-tab-content value="three">
        And this will show if the ids-tabs value or selection becomes "three",
        similar to the previous content entry. Only one will be shown at once.
    </ids-tab-content>
</ids-tabs-context>
```

It's also possible to create Module Tabs for top-level navigation in your application

```html
<ids-tabs value="one" color-variant="module">
    <ids-tab value="one">Example One</ids-tab>
    <ids-tab value="two">Example Two</ids-tab>
    <ids-tab value="three">Example Three</ids-tab>
</ids-tabs>
```

### Overflowed Tabs

When creating a tab list with many tabs, its possible there will not be enough screen real-estate to display them all.  In this situation you can also add a special "More Tabs" tab component:

```html
<ids-tabs value="one" color-variant="module">
    <ids-tab value="one">Example One</ids-tab>
    <ids-tab value="two">Example Two</ids-tab>
    <ids-tab value="three">Example Three</ids-tab>
    <ids-tab value="four">Example Four</ids-tab>
    <ids-tab value="five">Example Five</ids-tab>
    <ids-tab value="six">Example Six</ids-tab>
    <ids-tab-more overflow></ids-tab-more>
</ids-tabs>
```

### Fixed placement of Tabs and Actions

Some items slotted in IdsTabs should not spill into the "More Actions" area and should always be present.  Using the `fixed` slot name on these elements causes them to sit inside a "fixed" on the right of the IdsTabs.  In cases where overflow is present, the actions will be adjacent to a visible More Actions tab.

```html
<ids-tabs value="one" color-variant="module">
    <ids-tab value="one">Example One</ids-tab>
    <ids-tab value="two">Example Two</ids-tab>
    <ids-tab value="three">Example Three</ids-tab>
    <ids-tab value="four">Example Four</ids-tab>
    <ids-tab value="five" slot="fixed">Example Five</ids-tab>
    <ids-tab value="six" slot="fixed">Example Six</ids-tab>
    <ids-tab-more overflow></ids-tab-more>
</ids-tabs>
```

When this component is present in a tab list, it will only be displayed when there is not enough space to display all other tabs present.  When clicking on this tab, it opens an [IdsPopupMenu](../ids-popup-menu/README.md) containing menu items that reflect all tabs currently "overflowed" (in practice, the tabs that are hidden).  Selecting an item from the menu causes the menu item's corresponding tab to be activated.

### Dismissible Tabs

Tabs can be configured to display an optional [IdsTriggerButton](../ids-trigger-field/README.md) (marked with an "X") that will remove it from the tab list when clicked.  If a content pane with a matching `value` attribute exists, the IdsTabsContext element locates and removes it. When a tab is dismissed, it emits a `tabremove` event.

```html
<ids-tab value="one" dismissible>Example One</dismissible>
```

## Settings and Attributes

### Tab Container Settings (`ids-tabs`)

- `disabled` {boolean} disables all tabs.
- `value` {string} set which tab is currently selected. If tab children do not have a value, will fall back to being a 0-based index. Otherwise, it can also be any string as long as there are relevant matches for the values.
- `orientation` {'horizontal' | 'vertical'} defaults to horizontal; controls the direction/axis tabs are flowed on.
- `color-variant` {'alternate'|'module'} (optional) sets the Tabs color variant.  The `alternate` variant is used on header components and set automatically when placed inside of an `ids-header` component.  The `module` variant displays Module Tabs, which are generally used as top-level navigation only.

### Individual Tabs Settings (`ids-tab`)

- `actionable` {boolean} labels a tab as having a corresponding action, such as "Add", "Reset", "Activate Application Menu", etc.  Tabs that use this setting should also have an `onAction` callback applied, which will be triggered upon selecting the tab.  Tabs that are `actionable` will not cause content in tab panels to be displayed.
- `disabled` {boolean} allows you to disable a tab among a set of tabs.
- `selected` {boolean} allows for a tab to display its selected state.  In some cases, tabs with this value set to true will also automatically display their corresponding Tab Panel's content.  Tabs that have an `actionable` attribute applied are not able to be "selected" -- selecting those tabs will focus them.
- `value` {string | number} the value which when the parent `ids-tabs` also has an equivalent for, selects this tab.

## Themeable Parts

- `container` allows you to style the container of the tab

## States and Variations (With Code Examples)

When placed inside of an `IdsHeader` component, the `ids-tabs` component automatically gains the property `color-variant` which is set to `alternate` as it's default style.

## Keyboard Guidelines

- TAB should move off of the component to the next focusable element on page.
- SHIFT + TAB should move to previous focusable element on the page.
- Direction keys (UP/DOWN for vertical, LEFT/RIGHT for horizontal) should move between tabs
- ENTER should select a tab.

## Responsive Guidelines

- Flows with padding and margin within the width and height of the parent container. Possibly scrolling as needed based on parent dimensions.

## Converting from Previous Versions (Breaking Changes)

**3.x to 4.x**

- Tabs was implemented in v4.0.0
- Tabs can be invoked with `$('#my-element').tabs()`.

**4.x to 5.x**

- Tabs are now custom elements `<ids-tabs value=${selection}></ids-tabs>`
- If using events, events are now plain JS events
- Can now be imported as a single JS file and used with encapsulated styles
- Content within the tabs are specified as `<ids-tab value=${selection-value}>`Tab Label/Content`</ids-tab>`
- Tabs and their panels are now wrapped with a context element `<ids-tabs-context></ids-tabs-context>` for controlling which tab is displayed
- Tabs can optionally display overflow by inserting an `<ids-tab-more overflow></ids-tab-more>` component into the `<ids-tabs></ids-tabs>` component

## Regional Considerations

Text within tabs should be localized in the current language. They should also should flip to the alternate side in Right To Left mode. Consider that in some languages text may be a lot longer (German). And in some cases it cant be wrapped (Thai).
