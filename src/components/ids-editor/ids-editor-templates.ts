/**
 * Parse given template string with each context.
 * @param {string} str The template string
 * @param {any} ctx The context key/value
 * @returns {string} The template value
 */
export function parseTemplate(str: string, ctx: any): string {
  return str.replace(/{(\w+)}/g, (m, p) => ctx[p]);
}

// Editor template
export const editorTemplate = `
  <div class="ids-editor" part="editor"{disabled}{readonly}>
    <slot class="{hiddenClass}"></slot>
    <ids-text id="editor-label" label class="{labelClass}{hiddenLabelCss}{requiredLabelCss}" part="editor-label"{disabled}{readonly}>{labelText}</ids-text>
    <div class="main-container" part="main-container">
      <div class="toolbar-container" part="toolbar-container">
        <slot name="toolbar"></slot>
      </div>
      <div class="editor-content">
        <div id="editor-container" class="editor-container" part="editor-container"{contenteditable} aria-multiline="true" role="textbox" aria-labelledby="editor-label"{placeholder}></div>
        <div class="source-container {hiddenClass}" part="source-container">
          <div class="source-wrapper">
            <ul class="line-numbers"></ul>
            <label class="audible" for="source-textarea">
              {sourceTextareaLabel}
            </label>
            <textarea id="source-textarea" class="source-textarea"{placeholder}></textarea>
          </div>
        </div>
      </div>
    </div>
  </div>`;

// Editor mode button template
export const btnEditorModeTemplate = `
  <ids-button editor-action="editormode" tooltip="View Visual" color-variant="alternate-formatter">
    <span class="audible">View Visual</span>
    <ids-icon icon="visual" width="50" viewbox="0 0 73 18"></ids-icon>
  </ids-button>`;

// Source mode button template
export const btnSourceModeTemplate = `
  <ids-button editor-action="sourcemode" tooltip="View Source" color-variant="alternate-formatter">
    <span class="audible">View Source</span>
    <ids-icon icon="html" width="38" viewbox="0 0 54 18"></ids-icon>
  </ids-button>`;

// Toolbar template
export const toolbarTemplate = `
  <ids-toolbar slot="toolbar" type="formatter">
    <ids-toolbar-section type="buttonset">
      <ids-menu-button
        editor-action="formatblock"
        id="btn-formatblock-{instanceCounter}"
        role="button"
        menu="menu-formatblock-{instanceCounter}"
        tooltip="Choose Font Style"
        formatter-width="125px"
        dropdown-icon
        no-padding="true"
        trigger-type="click"
        color-variant="alternate-formatter">
        <span>Normal Text</span>
      </ids-menu-button>
      <ids-popup-menu id="menu-formatblock-{instanceCounter}" target="#btn-formatblock-{instanceCounter}">
        <ids-menu-group>
          <ids-menu-item value="p" selected="true"><ids-text>Normal Text</ids-text></ids-menu-item>
          <ids-menu-item value="h1"><ids-text font-size="28">Header 1</ids-text></ids-menu-item>
          <ids-menu-item value="h2"><ids-text font-size="24">Header 2</ids-text></ids-menu-item>
          <ids-menu-item value="h3"><ids-text font-size="20">Header 3</ids-text></ids-menu-item>
        </ids-menu-group>
      </ids-popup-menu>
      <ids-separator vertical></ids-separator>
      <ids-button editor-action="bold" tooltip="Toggle Bold Text" color-variant="alternate-formatter">
        <span class="audible">Bold</span>
        <ids-icon icon="bold"></ids-icon>
      </ids-button>
      <ids-button editor-action="italic" tooltip="Toggle Italic Text" color-variant="alternate-formatter">
        <span class="audible">Italic</span>
        <ids-icon icon="italic"></ids-icon>
      </ids-button>
      <ids-button editor-action="underline" tooltip="Toggle Underline Text" color-variant="alternate-formatter">
        <span class="audible">Underline</span>
        <ids-icon icon="underline"></ids-icon>
      </ids-button>
      <ids-button editor-action="strikethrough" tooltip="Toggle Strike Through Text" color-variant="alternate-formatter">
        <span class="audible">Strike through</span>
        <ids-icon icon="strike-through"></ids-icon>
      </ids-button>
      <ids-separator vertical></ids-separator>
      <ids-button editor-action="forecolor" tooltip="Text Color" color-variant="alternate-formatter">
        <span class="audible">Text color</span>
        <ids-icon icon="fore-color"></ids-icon>
      </ids-button>
      <ids-separator vertical></ids-separator>
      <ids-button editor-action="alignleft" tooltip="Align Left" color-variant="alternate-formatter">
        <span class="audible">Align left</span>
        <ids-icon icon="left-text-align"></ids-icon>
      </ids-button>
      <ids-button editor-action="aligncenter" tooltip="Align Center" color-variant="alternate-formatter">
        <span class="audible">Align center</span>
        <ids-icon icon="center-text"></ids-icon>
      </ids-button>
      <ids-button editor-action="alignright" tooltip="Align Right" color-variant="alternate-formatter">
        <span class="audible">Align right</span>
        <ids-icon icon="right-text-align"></ids-icon>
      </ids-button>
      <ids-separator vertical></ids-separator>
      <ids-button editor-action="blockquote" tooltip="Block Quote" color-variant="alternate-formatter">
        <span class="audible">Block quote</span>
        <ids-icon icon="quote"></ids-icon>
      </ids-button>
      <ids-button editor-action="orderedlist" tooltip="Insert/Remove Numbered List" color-variant="alternate-formatter">
        <span class="audible">Ordered List</span>
        <ids-icon icon="number-list"></ids-icon>
      </ids-button>
      <ids-button editor-action="unorderedlist" tooltip="Insert/Remove Bulleted List" color-variant="alternate-formatter">
        <span class="audible">Unordered List</span>
        <ids-icon icon="bullet-list"></ids-icon>
      </ids-button>
      <ids-separator vertical></ids-separator>
      <ids-button editor-action="hyperlink" tooltip="Insert Hyperlink" color-variant="alternate-formatter">
        <span class="audible">Insert Hyperlink</span>
        <ids-icon icon="link"></ids-icon>
      </ids-button>
      <ids-button editor-action="insertimage" tooltip="Insert Image" color-variant="alternate-formatter">
        <span class="audible">Insert Image</span>
        <ids-icon icon="insert-image"></ids-icon>
      </ids-button>
      <ids-separator vertical></ids-separator>
      <ids-button editor-action="clearformatting" tooltip="Clear Formatting" color-variant="alternate-formatter">
        <span class="audible">Clear Formatting</span>
        <ids-icon icon="clear-formatting"></ids-icon>
      </ids-button>
      <ids-separator vertical></ids-separator>
      ${btnSourceModeTemplate}
      ${btnEditorModeTemplate}
    </ids-toolbar-section>
    <ids-toolbar-more-actions overflow color-variant="alternate-formatter"></ids-toolbar-more-actions>
  </ids-toolbar>`;

// Error message template
export const errorMessageTemplate = `
  <ids-message id="errormessage-modal" status="error">
    <ids-text slot="title" font-size="24" type="h2" id="errormessage-modal-title">No Selection!</ids-text>
    <ids-text class="demo-contents" align="left">Please make some selection to complete this task.</ids-text>
    <ids-modal-button slot="buttons" appearance="primary" id="errormessage-modal-ok">OK</ids-modal-button>
  </ids-message>`;

// Hyperlink modal template
export const hyperlinkModalTemplate = `
  <ids-modal id="{key}-modal">
    <ids-text slot="title" font-size="24" type="h2" id="{key}-modal-title">Insert Anchor</ids-text>
    <ids-layout-grid class="data-grid-container" auto-fit="true" gap="md" no-margins="true" min-col-width="300px">
      <ids-layout-grid-cell>
        <ids-input id="{key}-modal-input-url" label="Url" value="{url}" validate="required"></ids-input>
        {clickableElemHtml}
        <ids-input id="{key}-modal-input-classes" label="Css Class" value="{classes}"></ids-input>
        {targetDropdownHtml}
        <div id="{key}-modal-checkbox-remove-container" class="{hiddenClass}">
          <ids-checkbox id="{key}-modal-checkbox-remove" label="Remove hyperlink"></ids-checkbox>
        </div>
      </ids-layout-grid-cell>
    </ids-layout-grid>
    <ids-modal-button slot="buttons" id="{key}-modal-cancel-btn" appearance="secondary">
      <span>Cancel</span>
    </ids-modal-button>
    <ids-modal-button slot="buttons" id="{key}-modal-apply-btn" appearance="primary">
      <span>Apply</span>
    </ids-modal-button>
  </ids-modal>`;

// Insertimage modal template
export const insertimageModalTemplate = `
  <ids-modal id="{key}-modal">
    <ids-text slot="title" font-size="24" type="h2" id="{key}-modal-title">Insert Image</ids-text>
    <ids-layout-grid class="data-grid-container" auto-fit="true" gap="md" no-margins="true" min-col-width="300px">
      <ids-layout-grid-cell>
        <ids-input id="{key}-modal-input-src" label="Url" value="{url}" validate="required"></ids-input>
        <ids-input id="{key}-modal-input-alt" label="Alt text" value="{alt}"></ids-input>
      </ids-layout-grid-cell>
    </ids-layout-grid>

    <ids-modal-button slot="buttons" id="{key}-modal-cancel-btn" appearance="secondary">
      <span>Cancel</span>
    </ids-modal-button>
    <ids-modal-button slot="buttons" id="{key}-modal-apply-btn" appearance="primary">
      <span>Apply</span>
    </ids-modal-button>
  </ids-modal>`;
