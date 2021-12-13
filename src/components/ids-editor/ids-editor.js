import {
  IdsElement,
  customElement,
  scss,
  mix,
  attributes
} from '../../core';

// Import Mixins
import {
  IdsEventsMixin,
  IdsKeyboardMixin,
  IdsLocaleMixin,
  IdsThemeMixin
} from '../../mixins';

// Import Utils
import {
  IdsStringUtils as stringUtils,
  // IdsXssUtils as xssUtils
} from '../../utils';

import styles from './ids-editor.scss';
import execActions from './exec-actions';

const PARAGRAPH_SEPARATORS = ['p', 'div', 'br'];

const EDITOR_DEFAULTS = {
  paragraphSeparator: 'p',
  label: 'Ids editor',
};

/**
 * IDS Editor Component
 * @type {IdsEditor}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 * @mixes IdsLocaleMixin
 * @mixes IdsThemeMixin
 * @part editor - the editor element
 * @part icon - the icon element
 */
@customElement('ids-editor')
@scss(styles)
class IdsEditor extends mix(IdsElement).with(
    IdsEventsMixin,
    IdsKeyboardMixin,
    IdsLocaleMixin,
    IdsThemeMixin
  ) {
  constructor() {
    super();
  }

  /**
   * Invoked each time the custom element is appended into a document-connected element.
   */
  connectedCallback() {
    this
      .#initContent()
      .#attachEventHandlers();
    super.connectedCallback();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.PARAGRAPH_SEPARATOR,
      attributes.LABEL,
    ];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    const tmplToolbar = `
      <ids-toolbar tabbable="true" type="formatter">
        <ids-toolbar-section type="buttonset">

          <ids-menu-button editor-action="blockpicker" id="btn-blockpicker" role="button" menu="menu-blockpicker" tooltip="Choose Font Style" formatter-width="125px" dropdown-icon>
            <span slot="text">Normal Text</span>
          </ids-menu-button>
          <ids-popup-menu id="menu-blockpicker" target="#btn-blockpicker">
            <ids-menu-group>
              <ids-menu-item value="normal" selected="true"><ids-text>Normal Text</ids-text></ids-menu-item>
              <ids-menu-item value="h1"><ids-text font-size="28">Header 1</ids-text></ids-menu-item>
              <ids-menu-item value="h2"><ids-text font-size="24">Header 2</ids-text></ids-menu-item>
              <ids-menu-item value="h3"><ids-text font-size="20">Header 3</ids-text></ids-menu-item>
            </ids-menu-group>
          </ids-popup-menu>

          <ids-separator vertical></ids-separator>

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

          <ids-button editor-action="strike-through" square="true" tooltip="Toggle Strike Through Text">
            <span slot="text" class="audible">Strike through</span>
            <ids-icon slot="icon" icon="strike-through"></ids-icon>
          </ids-button>

          <ids-separator vertical></ids-separator>

          <ids-button editor-action="fore-color" editor-action-value="#ff0000" square="true" tooltip="Text Color">
            <span slot="text" class="audible">Text color</span>
            <ids-icon slot="icon" icon="fore-color"></ids-icon>
          </ids-button>

          <ids-separator vertical></ids-separator>

          <ids-button editor-action="align-left" square="true" tooltip="Align Left">
            <span slot="text" class="audible">Align left</span>
            <ids-icon slot="icon" icon="left-text-align"></ids-icon>
          </ids-button>

          <ids-button editor-action="align-center" square="true" tooltip="Align Center">
            <span slot="text" class="audible">Align center</span>
            <ids-icon slot="icon" icon="center-text"></ids-icon>
          </ids-button>

          <ids-button editor-action="align-right" square="true" tooltip="Align Right">
            <span slot="text" class="audible">Align right</span>
            <ids-icon slot="icon" icon="right-text-align"></ids-icon>
          </ids-button>

          <ids-separator vertical></ids-separator>

          <ids-button editor-action="blockquote" square="true" tooltip="Block Quote">
            <span slot="text" class="audible">Block quote</span>
            <ids-icon slot="icon" icon="quote"></ids-icon>
          </ids-button>

          <ids-button editor-action="ordered-list" square="true" tooltip="Insert/Remove Numbered List">
            <span slot="text" class="audible">Ordered List</span>
            <ids-icon slot="icon" icon="number-list"></ids-icon>
          </ids-button>

          <ids-button editor-action="unordered-list" square="true" tooltip="Insert/Remove Bulleted List">
            <span slot="text" class="audible">Unordered List</span>
            <ids-icon slot="icon" icon="bullet-list"></ids-icon>
          </ids-button>

          <ids-separator vertical></ids-separator>

          <ids-button editor-action="hyperlink" square="true" tooltip="Insert Anchor">
            <span slot="text" class="audible">Insert Anchor</span>
            <ids-icon slot="icon" icon="link"></ids-icon>
          </ids-button>

          <ids-button editor-action="insert-image" square="true" tooltip="Insert Image">
            <span slot="text" class="audible">Insert Image</span>
            <ids-icon slot="icon" icon="insert-image"></ids-icon>
          </ids-button>

          <ids-separator vertical></ids-separator>

          <ids-button editor-action="clear-formatting" square="true" tooltip="Clear Formatting">
            <span slot="text" class="audible">Clear Formatting</span>
            <ids-icon slot="icon" icon="clear-formatting"></ids-icon>
          </ids-button>

          <ids-separator vertical></ids-separator>

          <ids-button editor-action="source-mode" square="true" tooltip="View Source">
            <span slot="text" class="audible">View Source</span>
            <ids-icon slot="icon" icon="html" width="38" viewbox="0 0 54 18"></ids-icon>
          </ids-button>

        </ids-toolbar-section>
      </ids-toolbar>`;

    return `
      <div class="ids-editor" part="editor">
        <slot name="content" class="hidden"></slot>
        <div class="main-container" part="main-container">
          <div class="toolbar-container" part="toolbar-container">
            <slot name="toolbar">${tmplToolbar}</slot>
          </div>
          <div id="editor-container" class="editor-container" part="editor-container" contenteditable="true" aria-multiline="true" role="textbox" aria-label="${this.label}"></div>
          <div class="source-container" part="source-container"></div>
        </div>
      </div>`;
  }

  /**
   * List of toolbar actions attached to editor.
   * @private
   * @type {Array<object>}
   */
  #toolbarActions = [];

  /**
   * Initialize the raw content
   * @private
   * @returns {object} This API object for chaining
   */
  #initContent() {
    const html = (slot) => slot?.assignedNodes()[0]?.innerHTML;
    const slot = this.shadowRoot?.querySelector('slot[name="content"]');
    const editor = this.shadowRoot.querySelector('.editor-container');
    editor.innerHTML = html(slot) || '';
    // editor.innerHTML = xssUtils.stripHTML(html(slot) || '');
    return this;
  }

  /**
   * Handle given action.
   * @private
   * @param {string} action The action
   * @param {string|undefined} val The value
   * @returns {void}
   */
  #handleAction(action, val) {
    const sel = this.shadowRoot.getSelection();
    if (action === 'blockpicker') {
      if (/^(h1|h2|h3|h4|h5|h6)$/gi.test(val)) {
        execActions.heading(sel, val);
      } else if (val === 'p') {
        execActions.paragraph(sel);
      } else if (val === 'pre') {
        execActions.pre(sel);
      } else if (val === 'blockquote') {
        execActions.blockquote(sel);
      } else {
        execActions.paragraph(sel);
      }
    } else {
      execActions[action](sel);
    }
  }

  /**
   * Establish Internal Event Handlers
   * @private
   * @returns {object} The object for chaining.
   */
  #attachEventHandlers() {
    // Respond to parent changing language
    this.offEvent('languagechange.editor');
    this.onEvent('languagechange.editor', this.closest('ids-container'), async (e) => {
      await this.setLanguage(e.detail.language.name);
    });

    // Get toolbar actions attached toolbarActions
    let max = 100;
    const reqUntilAvailabile = () => {
      const actionBtns = [].slice.call(this.shadowRoot.querySelectorAll('[editor-action]'));
      max--;
      window.requestAnimationFrame(() => {
        const availabileElems = [];
        this.#toolbarActions = actionBtns.map((btn) => {
          const action = btn.getAttribute('editor-action');
          const args = { btn, action };
          availabileElems.push(btn);
          if (action === 'blockpicker') {
            args.isPopup = true;
            args.popup = btn?.menuEl?.popup;
            availabileElems.push(args.popup);
          }
          return args;
        });
        if (Object.values(availabileElems).some((v) => typeof v === 'undefined') && max > 0) {
          reqUntilAvailabile();
        } else {
          // Reday to bind events
          this.#toolbarActions.forEach((a) => {
            if (a.isPopup) {
              this.onEvent('selected.editor', a.popup, (e) => {
                a.btn.text = e.detail.elem.text;
                this.#handleAction(a.action, e.detail.value);
              });
            } else {
              this.onEvent('click.editor', a.btn, () => {
                this.#handleAction(stringUtils.camelCase(a.action));
              });
            }
          });
        }
      });
    };
    reqUntilAvailabile();

    return this;
  }

  /**
   * Set the editor aria label text
   * @param {string} value of the label text
   */
  set label(value) {
    if (value) {
      this.setAttribute(attributes.LABEL, value);
    } else {
      this.removeAttribute(attributes.LABEL);
    }
  }

  get label() {
    return this.getAttribute(attributes.LABEL) || EDITOR_DEFAULTS.label;
  }

  /**
   * Set the paragraph separator for editor
   * @param {string} value The value
   */
  set paragraphSeparator(value) {
    if (PARAGRAPH_SEPARATORS.indexOf(value) > -1) {
      this.setAttribute(attributes.PARAGRAPH_SEPARATOR, value);
    } else {
      this.removeAttribute(attributes.PARAGRAPH_SEPARATOR);
    }
  }

  get paragraphSeparator() {
    return this.getAttribute(attributes.PARAGRAPH_SEPARATOR) || EDITOR_DEFAULTS.paragraphSeparator;
  }
}

export default IdsEditor;
