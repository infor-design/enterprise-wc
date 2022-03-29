# Ids Editor Component

## Description

Editor component let you can control the appearance of your HTML text using the rich text formats. The editor toolbar provides various buttons for editing and formatting your content. You may use the editor component to displayed multiple styles, colors, alignments, or include images and hyperlinks as well.


## Use Cases

- Editor component use to rich text formats.
- To displayed multiple styles, colors and alignments.
- You may use to include images, hyperlinks and order/un-order lists.

## Terminology

**Toolbar:** Collection of buttons to apply various type of rich text formats.
**Editor Container:** Editor container implemented using a `contenteditable` element.
**Source Container:** A textarea element use as container to edit source mode.

## Features (With Code Examples)

A normal editor used as a web component.

```html
<ids-editor label="Demo Editor">
  <p>Some sample text</p>
</ids-editor>
```

Readonly editor component.

```html
<ids-editor label="Demo Editor" readonly>
  <p>Some sample text</p>
</ids-editor>
```

Disabled editor component.

```html
<ids-editor label="Demo Editor" disabled>
  <p>Some sample text</p>
</ids-editor>
```

Dirty tracking editor component.

```html
<ids-editor label="Demo Editor" dirty-tracker>
  <p>Some sample text</p>
</ids-editor>
```

Validation (required) editor component.

```html
<ids-editor label="Demo Editor" validate="required">
  <p>Some sample text</p>
</ids-editor>
```

Custom toolbar with editor component.

```html
<ids-editor label="Demo Editor">
  <ids-toolbar slot="toolbar" tabbable="true" type="formatter">
    <ids-toolbar-section type="buttonset">
      <ids-button editor-action="bold" square="true" tooltip="Toggle Bold Text">
        <span slot="text" class="audible">Bold</span>
        <ids-icon slot="icon" icon="bold"></ids-icon>
      </ids-button>
      <ids-button editor-action="italic" square="true" tooltip="Toggle Italic Text">
        <span slot="text" class="audible">Italic</span>
        <ids-icon slot="icon" icon="italic"></ids-icon>
      </ids-button>
      <ids-button editor-action="underline" square="true" tooltip="Toggle Underline Text">
        <span slot="text" class="audible">Underline</span>
        <ids-icon slot="icon" icon="underline"></ids-icon>
      </ids-button>
      <ids-separator vertical></ids-separator>
      <ids-button editor-action="sourcemode" square="true" tooltip="View Source">
        <span slot="text" class="audible">View Source</span>
        <ids-icon slot="icon" icon="html" width="38" viewbox="0 0 54 18"></ids-icon>
      </ids-button>
    </ids-toolbar-section>
  </ids-toolbar>
  <p>Some sample text</p>
</ids-editor>
```

Editor init with source mode.

```html
<ids-editor label="Demo Editor" view="source">
  <p>Some sample text</p>
</ids-editor>
```

Editor with hidden label.

```html
<ids-editor label="Demo Editor" label-hidden>
  <p>Some sample text</p>
</ids-editor>
```

Editor placeholder.

```html
<ids-editor label="Demo Editor" placeholder="Type some text here...">
</ids-editor>
```

Editor use source formatter

```html
<ids-editor label="Demo Editor" source-formatter>
  <p>Some sample text</p>
</ids-editor>
```

Editor use clickable hyperlink

```html
<ids-editor label="Demo Editor">
  <p>Some sample text <a href="https://www.example.com/" class="hyperlink" contenteditable="false" target="_blank">example hyperlink</a></p>
</ids-editor>
```

Custom default values in modals (ie. hyperlink modal)

```html
<ids-editor id="editor-demo" label="Demo Editor">
  <p>Some sample text</p>
</ids-editor>
```

```javaScript
const modals = {
  hyperlink: {
    url: 'http://www.example.com',
    classes: 'hyperlink',
    targets: [
      { text: 'Same Window', value: '' },
      { text: 'New Window', value: '_blank', selected: true }
    ],
    isClickable: false,
    showIsClickable: true
  },
  insertimage: {
    url: '../assets/images/placeholder-154x120.png',
    alt: ''
  }
};
const editorEl = document.querySelector('#editor-demo');
editorEl.modalElementsValue(modals);
```

## Settings and Attributes

- `disabled` {boolean} Sets the editor to disabled state
- `label` {string} Set the editor aria label text
- `labelHidden` {boolean} Set the label to be hidden or shown
- `labelRequired` {boolean} Set required indicator (red '*') to be hidden or shown
- `paragraphSeparator` {string} Set the placeholder text for editor
- `placeholder` {string} Sets the editor node to be selectable
- `readonly` {boolean} Sets the editor to readonly state
- `sourceFormatter` {boolean} Sets to be use source formatter for editor
- `view` {string|'editor'|'source' } Set the view mode for editor

## Theme-able Parts

- `editor` - allows you to further style the editor element
- `editor-label` - allows you to further style the editor label element
- `main-container` - allows you to further style the main container element
- `toolbar-container` - allows you to further style the toolbar container element
- `editor-container` - allows you to further style the editor container element
- `source-container` - allows you to further style the source container element

## Events

- `beforeeditormode` Fires before change view to editor mode, you can return false in the response to veto
- `aftereditormode` Fires after change view to editor mode
- `beforesourcemode` Fires before change view to source mode, you can return false in the response to veto
- `aftersourcemode` Fires after change view to source mode
- `viewchange` Fires after requested view mode changed
- `rejectviewchange` Fires if requested view mode reject
- `beforepaste` Fires before paste, you can return false in the response to veto
- `afterpaste` Fires after paste content
- `rejectpaste` Fires if reject paste content
- `initialize` Fires after initialize
- `change` Fires after value change

## Methods

- `modalElementsValue(modals: object): HTMLElement` Set default value to each element in modals
- `sourceTextareaLabel(): string` Get label text for source textarea

## States and Variations (With Code Examples)

- Custom Toolbar: End user can set custom toolbar buttons
- Disabled: Disabled editor cannot be clicked, hovered, focused or selected
- Readonly: Editor content readonly
- Dirty Tracking: Content changes can be track by display dirty icon in editor
- Validation: Can be check of required validation

## Keyboard Guidelines

- <kbd>Tab/Shift + Tab</kbd>: This will focus or unfocus the editor.
- <kbd>Ctrl + B</kbd>: Make text bold.
- <kbd>Ctrl + I</kbd>: Make text italicize.
- <kbd>Ctrl + U</kbd>: Make text underline.
- <kbd>Ctrl + Shift + S</kbd>: Make text strike through.
- <kbd>Ctrl + Shift + Equal</kbd>: Make text super script.
- <kbd>Ctrl + Equal</kbd>: Make text sub script.
- <kbd>Ctrl + Alt + Digit1</kbd>: Make header 1.
- <kbd>Ctrl + Alt + Digit2</kbd>: Make header 2.
- <kbd>Ctrl + Alt + Digit3</kbd>: Make header 3.
- <kbd>Ctrl + Alt + Digit4</kbd>: Make header 4.
- <kbd>Ctrl + Alt + Digit5</kbd>: Make header 5.
- <kbd>Ctrl + Alt + Digit6</kbd>: Make header 6.
- <kbd>Ctrl + Shift + Alt + K</kbd>: Change text fore color.
- <kbd>Ctrl + Shift + O</kbd>: Insert ordered list.
- <kbd>Ctrl + Shift + U</kbd>: Insert unordered list.
- <kbd>Ctrl + Shift + I</kbd>: Insert image.
- <kbd>Ctrl + K</kbd>: Insert/Update hyperlink.
- <kbd>Ctrl + Shift + K</kbd>: Make unlink the hyperlink.
- <kbd>Ctrl + Shift + L</kbd>: Insert horizontal line.
- <kbd>Ctrl + L</kbd>: Make text align left.
- <kbd>Ctrl + R</kbd>: Make text align right.
- <kbd>Ctrl + E</kbd>: Make text align center.
- <kbd>Ctrl + J</kbd>: Make text align justify.
- <kbd>Ctrl + Shift + Space</kbd>: Clear formatting.
- <kbd>Ctrl + Y</kbd>: History redo.
- <kbd>Ctrl + Z</kbd>: History undo.
- <kbd>Ctrl + Shift + Backquote</kbd>: Switch editor view mode.
- <kbd>Ctrl + Backquote</kbd>: Switch source view mode.

## Responsive Guidelines

- Flows with padding and margin within the width and height of the parent container.

## Converting from Previous Versions (Breaking Changes)

**3.x to 4.x**
- Editor have all new markup and classes.

**4.x to 5.x**
- The Editor component has been changed to a web component and renamed to ids-editor.
- Markup has changed to a custom element `<ids-editor><div slot="content"><p>Some sample text</p></div></ids-editor>`
- If using events, events are now plain JS events.
- Can now be imported as a single JS file and used with encapsulated styles

## Designs

[Design Specs](https://www.figma.com/file/UoCNFBhmjVZZ9CxLHQ54Mq/IDS-Editor?node-id=1%3A7)

## Accessibility Guidelines

- Editor container contained in the element has a `role="textbox"`, `aria-multiline="true"` and `aria-labelledby`
- Source container contained textarea with audible label

## Regional Considerations

In Right To Left Languages the icons, text and alignment will flow to the other side. Labels should be localized in the current language.
