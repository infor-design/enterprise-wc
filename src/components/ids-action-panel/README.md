# ids-action-panel

The ids-action-panel displays complex forms inside of a [ids-modal](../ids-modal/README.md) area.

## Features (With Code Examples)

Action Panels with no content look similar to a modal, presenting a floating content area over top of the page:

```html
<ids-action-panel id="my-cap"></ids-action-panel>
```

One main difference between the Modal and Action Panel is the `toolbar` slot. It's placed where the modal title normally appears, and is styled similar to that of the [ids-header]('../ids-header/README.md). The contents of this slot should be [ids-toolbar]('../ids-toolbar/README.md) marked for the `toolbar` slot:

```html
<ids-action-panel id="my-cap">
    <ids-toolbar id="cap-toolbar" slot="toolbar">
        <ids-toolbar-section type="title">
            <ids-text font-size="20" type="h2">Company Information</ids-text>
        </ids-toolbar-section>

        <ids-toolbar-section type="buttonset" align="end">
            <ids-button id="btn-save" icon="save" no-padding>
                <ids-text font-weight="semi-bold">Save</ids-text>
            </ids-button>
            <ids-separator vertical="true"></ids-separator>
            <ids-button id="btn-close" icon="close" no-padding>
                <ids-text font-weight="semi-bold">Close</ids-text>
            </ids-button>
        </ids-toolbar-section>
    </ids-toolbar>
</ids-action-panel>
```

Similar to the modal, any content not marked for a slot will be present inside the main content area of the action panel:

```html
<ids-action-panel id="my-cap">
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
</ids-action-panel>
```

## Converting from Previous Versions (Breaking Changes)

**3.x to 4.x**
- Did not exist in 3.X, but any complex modals should be changed to use this.

**4.x to 5.x**

- 5.x: CAP is now a web component, and is functionally similar to [IdsModal](../ids-modal/README.md), using the same API and events.  The construction of the Modal is declarative and done mostly through HTML markup.
- Markup has changed to a custom element `<ids-action-panel></ids-action-panel>`
- Component is now fully defined in HTML Markup and using slots
- To hide and show the CAP, use the `visible` property `$('ids-action-panel').visible = false`
