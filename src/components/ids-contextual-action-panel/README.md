# Ids Contextual Action Panel

The IDS Contextual Action Panel (CAP) is used to display complex forms inside of a [Modal](../ids-modal/README.md) area.  The intended use of this component is to temporarily draw user attention away from a primary workflow to handle a complicated function, eventually returning its result back to the main workflow.

## Use Cases

- creating a new shipping order
- filling out a small form and submitting to a list.
- searching a table of data, selecting a record, and returning the record to a [trigger field]('../ids-trigger-field/README.md'), similar to what occurs in the [IdsLookup](../ids-lookup/README.md)

## Terminology

- **"CAP"** - IDS's abbreviation for "Contextual Action Panel"

## Features (With Code Examples)

Contextual Action Panels with no content present look similar to [Modals]('../ids-modal/README.md'), presenting just a floating content area over top of the page:

```html
<ids-contextual-action-panel id="my-cap"></ids-contextual-action-panel>
```

One main difference between the Modal and CAP is the `toolbar` slot, which will be placed where the Modal's title would normally appear, and is styled similarly to [Headers]('../ids-header/README.md).  The contents of this slot should be an [IdsToolbar]('../ids-toolbar/README.md) marked for the `toolbar` slot:

```html
<ids-contextual-action-panel id="my-cap">
    <ids-toolbar id="cap-toolbar" slot="toolbar">
        <ids-toolbar-section type="title">
            <ids-text font-size="20" type="h2">Company Information</ids-text>
        </ids-toolbar-section>

        <ids-toolbar-section type="buttonset" align="end">
            <ids-button id="btn-save" icon="save" no-padding>
                <ids-text font-weight="bold">Save</ids-text>
            </ids-button>
            <ids-separator vertical="true"></ids-separator>
            <ids-button id="btn-close" icon="close" no-padding>
                <ids-text font-weight="bold">Close</ids-text>
            </ids-button>
        </ids-toolbar-section>
    </ids-toolbar>
</ids-contextual-action-panel>
```

Similar to the Modal, any content not marked for a slot will be present inside the main content area of the CAP:

```html
<ids-contextual-action-panel id="my-cap">
    <form>
        <ids-dropdown id="cap-dd-template" label="Template" value="1">
            <ids-list-box>
                <ids-list-box-option value="">None</ids-list-box-option>
                <ids-list-box-option value="1" selected>Template #1</ids-list-box-option>
                <ids-list-box-option value="2">3568</ids-list-box-option>
            </ids-list-box>
        </ids-dropdown>

        <ids-textarea id="cap-textarea-notes" label="Notes"></ids-textarea>
    </form>
</ids-contextual-action-panel>
```

## Converting from Previous Versions (Breaking Changes)

**3.x to 4.x**
- Did not exist in 3.X, but any complex modals should be changed to use this.

**4.x to 5.x**

- 5.x: CAP is now a web component, and is functionally similar to [IdsModal](../ids-modal/README.md), using the same API and events.  The construction of the Modal is declarative and done mostly through HTML markup.
- Markup has changed to a custom element `<ids-contextual-action-panel></ids-contextual-action-panel>`
- Component is now fully defined in HTML Markup and using slots
- To hide and show the CAP, use the `visible` property `$('ids-contextual-action-panel').visible = false`
