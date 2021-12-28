import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';

import Base from './ids-editor-base';
import IdsButton from '../ids-button/ids-button';
import IdsText from '../ids-text/ids-text';
import IdsCheckbox from '../ids-checkbox/ids-checkbox';
import IdsDropdown from '../ids-dropdown/ids-dropdown';
import IdsInput from '../ids-input/ids-input';
import IdsMessage from '../ids-message/ids-message';
import IdsModal from '../ids-modal/ids-modal';
import IdsToolbar, {
  IdsToolbarSection,
  IdsToolbarMoreActions
} from '../ids-toolbar/ids-toolbar';

// import { unescapeHTML, htmlEntities } from '../../utils/ids-xss-utils/ids-xss-utils';
// import { stringToBool, camelCase } from '../../utils/ids-string-utils/ids-string-utils';
import { isObject } from '../../utils/ids-object-utils/ids-object-utils';

import styles from './ids-editor.scss';

// List of paragraph separators
const PARAGRAPH_SEPARATORS = ['p', 'div', 'br'];

// List of block elements
const BLOCK_ELEMENTS = ['p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre'];

// List of font size
const FONT_SIZES = ['1', '2', '3', '4', '5', '6', '7'];

// List of defaults
const EDITOR_DEFAULTS = {
  label: 'Ids editor',
  modals: {
    hyperlink: {
      url: 'http://www.example.com',
      classes: 'hyperlink',
      targets: [
        { text: 'Same Window', value: '' },
        { text: 'New Window', value: '_blank', selected: true }
      ],
      // Clickable hyperlink in editor
      isClickable: false,
      showIsClickable: true
    },
    insertimage: {
      url: '/assets/placeholder-154x120.png',
      alt: ''
    }
  },
  paragraphSeparator: 'p'
};

/**
 * IDS Editor Component
 * @type {IdsEditor}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @mixes IdsLocaleMixin
 * @part editor - the editor element
 */
@customElement('ids-editor')
@scss(styles)
export default class IdsEditor extends Base {
  constructor() {
    super();
  }

  /**
   * Invoked each time the custom element is appended into a document-connected element.
   */
  connectedCallback() {
    this
      .modalElementsValue()
      .#initToolbar()
      .#initContent()
      .#initModals()
      .#setParagraphSeparator()
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
    return `
      <div class="ids-editor" part="editor">
        <slot name="content" class="hidden"></slot>
        <div class="main-container" part="main-container">
          <div class="toolbar-container" part="toolbar-container">
            <slot name="toolbar"></slot>
          </div>
          <div class="editor-container" part="editor-container" contenteditable="true" aria-multiline="true" role="textbox" aria-label="${this.label}"></div>
          <div class="source-container" part="source-container"></div>
        </div>
      </div>`;
  }

  /**
   * Set default value to each element in modals.
   * @param {object} [modals] Incoming modals options.
   * @param {object} [modals.hyperlink] The hyperlink options.
   * @param {string} [modals.hyperlink.url] Url for hyperlink.
   * @param {string} [modals.hyperlink.class] Css Class for hyperlink.
   * @param {Array} [modals.hyperlink.targets] List target options for hyperlink.
   * @param {boolean} [modals.hyperlink.isClickable] If true, isClickable checkbox should checked.
   * @param {boolean} [modals.hyperlink.showIsClickable] If true, will show isClickable checkbox.
   * @param {object} [modals.insertimage] The insertimage options.
   * @param {string} [modals.insertimage.url] Url for insertimage.
   * @param {string} [modals.insertimage.alt] Alt text for insertimage.
   * @returns {object} This API object for chaining
   */
  modalElementsValue(modals) {
    const m = isObject(modals) ? modals : {};
    const d = EDITOR_DEFAULTS.modals;

    // Set hyperlink targets
    let hyperlinkTargets = [];
    if (m.hyperlink?.targets && m.hyperlink.targets.constructor === Array) {
      m.hyperlink.targets.forEach((target) => {
        if (isObject(target) && target.text) {
          hyperlinkTargets.push({ text: target.text, value: target.value });
        }
      });
    } else {
      hyperlinkTargets = [...d.hyperlink.targets];
    }

    // Set defaults value for each modal
    this.#modals.defaults = {
      hyperlink: {
        url: m.hyperlink?.url ?? d.hyperlink.url,
        classes: m.hyperlink?.classes ?? d.hyperlink.classes,
        targets: hyperlinkTargets,
        targetSelected: hyperlinkTargets.find((t) => t.selected),
        isClickable: m.hyperlink?.isClickable ?? d.hyperlink.isClickable,
        showIsClickable: m.hyperlink?.showIsClickable ?? d.hyperlink.showIsClickable
      },
      insertimage: {
        url: m.insertimage?.url ?? d.insertimage.url,
        alt: m.insertimage?.alt ?? d.insertimage.alt
      }
    };

    return this;
  }

  /**
   * List of toolbar actions attached to editor.
   * @private
   * @type {Array<object>}
   */
  #toolbarActions = [];

  /**
   * Modals attached to editor.
   * @private
   * @type {object}
   */
  #modals = {};

  /**
   * Current paragraph separator.
   * @private
   * @type {string}
   */
  #paragraphSeparator;

  /**
   * Saved current selection ranges.
   * @private
   * @type {Array<Range>|null}
   */
  #savedSelection;

  /**
   * Cache elements use most.
   * @private
   * @type {object}
   */
  #elems = {};

  /**
   * List of actions can be execute with editor.
   * @private
   * @type {Array<object>}
   */
  #actions = {
    // STYLES
    bold: { action: 'bold' },
    italic: { action: 'italic' },
    underline: { action: 'underline' },
    strikethrough: { action: 'strikeThrough' },

    // SCRIPTS
    superscript: { action: 'superscript' },
    subscript: { action: 'subscript' },

    // TEXT FORMAT
    formatblock: { action: 'formatBlock', value: [...BLOCK_ELEMENTS] },

    // FONT SIZE
    fontsize: { action: 'fontSize', value: [...FONT_SIZES] },

    // COLORS
    forecolor: { action: 'foreColor' },
    backcolor: { action: 'backColor' },

    // LISTS
    orderedlist: { action: 'insertOrderedList' },
    unorderedlist: { action: 'insertUnorderedList' },

    // INSERT
    insertimage: { action: 'insertImage' },
    hyperlink: { action: 'createLink' },
    unlink: { action: 'unlink' },
    inserthtml: { action: 'insertHTML' },
    inserthorizontalrule: { action: 'insertHorizontalRule' },

    // ALIGNMENT
    alignleft: { action: 'justifyLeft' },
    alignright: { action: 'justifyRight' },
    aligncenter: { action: 'justifyCenter' },
    alignjustify: { action: 'justifyFull' },

    // CLEAR FORMATTING
    clearformatting: { action: 'removeFormat' },

    // HISTORY
    redo: { action: 'redo' },
    undo: { action: 'undo' },
  };

  /**
   * Query selector in shadow root or given element.
   * @private
   * @param {string} s The selector.
   * @param {ShadowRoot|HTMLElement|undefined} root The root element.
   * @returns {HTMLElement|null} First matched selector element.
   */
  #qs(s, root = this.shadowRoot) {
    return root?.querySelector(s);
  }

  /**
   * Query selector all in shadow root or given element.
   * @private
   * @param {string} s The selector.
   * @param {ShadowRoot|HTMLElement|undefined} root The root element.
   * @returns {Array<NodeList>} List of elements that matched.
   */
  #qsAll(s, root = this.shadowRoot) {
    return Array.from(root?.querySelectorAll(s));
  }

  /**
   * Convert rgb to hex color value.
   * @private
   * @param {string} rgb The rgb value
   * @returns {string} the hex value
   */
  #rgbToHex(rgb) {
    const arrayRgb = rgb.split('(')[1].split(')')[0].split(',');
    const hex = arrayRgb.map((item) => {
      const x = parseInt(item).toString(16);
      return (x.length === 1) ? `0${x}` : x;
    }).join('');
    return `#${hex}`;
  }

  /**
   * Init the toolbar
   * @private
   * @returns {object} This API object for chaining
   */
  #initToolbar() {
    const tmplToolbar = `
      <ids-toolbar slot="toolbar" tabbable="true" type="formatter">
        <ids-toolbar-section type="buttonset" favor>

          <ids-menu-button editor-action="menu-button-formatblock" id="btn-formatblock" role="button" menu="menu-formatblock" tooltip="Choose Font Style" formatter-width="125px" dropdown-icon>
            <span slot="text">Normal Text</span>
          </ids-menu-button>
          <ids-popup-menu id="menu-formatblock" target="#btn-formatblock">
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

          <ids-button editor-action="strikethrough" square="true" tooltip="Toggle Strike Through Text">
            <span slot="text" class="audible">Strike through</span>
            <ids-icon slot="icon" icon="strike-through"></ids-icon>
          </ids-button>

          <ids-separator vertical></ids-separator>

          <ids-button editor-action="forecolor" square="true" tooltip="Text Color">
            <span slot="text" class="audible">Text color</span>
            <ids-icon slot="icon" icon="fore-color"></ids-icon>
          </ids-button>

          <ids-separator vertical></ids-separator>

          <ids-button editor-action="alignleft" square="true" tooltip="Align Left">
            <span slot="text" class="audible">Align left</span>
            <ids-icon slot="icon" icon="left-text-align"></ids-icon>
          </ids-button>

          <ids-button editor-action="aligncenter" square="true" tooltip="Align Center">
            <span slot="text" class="audible">Align center</span>
            <ids-icon slot="icon" icon="center-text"></ids-icon>
          </ids-button>

          <ids-button editor-action="alignright" square="true" tooltip="Align Right">
            <span slot="text" class="audible">Align right</span>
            <ids-icon slot="icon" icon="right-text-align"></ids-icon>
          </ids-button>

          <ids-separator vertical></ids-separator>

          <ids-button editor-action="blockquote" square="true" tooltip="Block Quote">
            <span slot="text" class="audible">Block quote</span>
            <ids-icon slot="icon" icon="quote"></ids-icon>
          </ids-button>

          <ids-button editor-action="orderedlist" square="true" tooltip="Insert/Remove Numbered List">
            <span slot="text" class="audible">Ordered List</span>
            <ids-icon slot="icon" icon="number-list"></ids-icon>
          </ids-button>

          <ids-button editor-action="unorderedlist" square="true" tooltip="Insert/Remove Bulleted List">
            <span slot="text" class="audible">Unordered List</span>
            <ids-icon slot="icon" icon="bullet-list"></ids-icon>
          </ids-button>

          <ids-separator vertical></ids-separator>

          <ids-button editor-action="hyperlink" square="true" tooltip="Insert Anchor">
            <span slot="text" class="audible">Insert Anchor</span>
            <ids-icon slot="icon" icon="link"></ids-icon>
          </ids-button>

          <ids-button editor-action="insertimage" square="true" tooltip="Insert Image">
            <span slot="text" class="audible">Insert Image</span>
            <ids-icon slot="icon" icon="insert-image"></ids-icon>
          </ids-button>

          <ids-separator vertical></ids-separator>

          <ids-button editor-action="clearformatting" square="true" tooltip="Clear Formatting">
            <span slot="text" class="audible">Clear Formatting</span>
            <ids-icon slot="icon" icon="clear-formatting"></ids-icon>
          </ids-button>

          <ids-separator vertical></ids-separator>

          <ids-button editor-action="sourcemode" square="true" tooltip="View Source">
            <span slot="text" class="audible">View Source</span>
            <ids-icon slot="icon" icon="html" width="38" viewbox="0 0 54 18"></ids-icon>
          </ids-button>

        </ids-toolbar-section>
      </ids-toolbar>`;

    const slot = this.querySelector('[slot="toolbar"]');
    if (!slot) {
      this.insertAdjacentHTML('afterbegin', tmplToolbar);
    }

    return this;
  }

  /**
   * Get block element and tagName for given node
   * @private
   * @param {Selection|undefined} sel The selection.
   * @returns {object} The element
   */
  #blockElem(sel = this.shadowRoot.getSelection()) {
    let tagName;
    let el = sel.anchorNode;
    if (el && el.tagName) tagName = el.tagName.toLowerCase();
    while (el && BLOCK_ELEMENTS.indexOf(tagName) === -1) {
      el = el.parentNode;
      if (el && el.tagName) tagName = el.tagName.toLowerCase();
    }
    return { el, tagName };
  }

  /**
   * Get list of block elements for selection
   * @private
   * @param {Selection|undefined} sel The selection.
   * @returns {Array<HTMLElement>} List of selection block elements
   */
  #selectionBlockElems(sel = this.shadowRoot.getSelection()) {
    const blockElems = [];
    this.#qsAll(BLOCK_ELEMENTS.join(', '), this.#elems.editor).forEach((elem) => {
      if (sel.containsNode(elem, true)) {
        blockElems.push(elem);
      }
    });
    return blockElems;
  }

  /**
   * Save current selection.
   * @private
   * @returns {Array<Range>|null} The selection ranges.
   */
  #saveSelection() {
    const sel = this.shadowRoot.getSelection();
    if (sel.getRangeAt && sel.rangeCount) {
      const ranges = [];
      for (let i = 0, l = sel.rangeCount; i < l; i += 1) {
        ranges.push(sel.getRangeAt(i));
      }
      return ranges;
    }
    return null;
  }

  /**
   * Restore selection.
   * @private
   * @param {Array<Range>|null} savedSel Saved selection ranges.
   * @returns {object} The object for chaining.
   */
  #restoreSelection(savedSel = this.#savedSelection) {
    const sel = this.shadowRoot.getSelection();
    if (savedSel) {
      sel.removeAllRanges();
      for (let i = 0, len = savedSel.length; i < len; i += 1) {
        sel.addRange(savedSel[i]);
      }
    }
    return this;
  }

  /**
   * Find element within the selection
   * http://stackoverflow.com/questions/6052870/how-to-know-if-there-is-a-link-element-within-the-selection
   * @private
   * @param {string} tagname The tagname to find.
   * @returns {HTMLElement|null} The found element.
   */
  #findElementInSelection(tagname) {
    let el;
    let comprng;
    let selparent;
    const container = this.#elems.editor;
    const range = this.shadowRoot.getSelection().getRangeAt(0);

    if (range) {
      selparent = range.commonAncestorContainer || range.parentElement();
      // Look for an element *around* the selected range
      for (el = selparent; el !== container; el = el?.parentNode) {
        if (el && el.tagName && el.tagName.toLowerCase() === tagname) {
          return el;
        }
      }

      // Look for an element *within* the selected range
      if (!range.collapsed
        && (range.text === undefined || range.text)
        && selparent.getElementsByTagName) {
        el = selparent.getElementsByTagName(tagname);
        comprng = document.createRange ? document.createRange() : document.body.createTextRange();

        for (let i = 0, len = el.length; i < len; i++) {
          // determine if element el[i] is within the range
          if (document.createRange) {
            comprng.selectNodeContents(el[i]);
            if (range.compareBoundaryPoints(Range.END_TO_START, comprng) < 0
              && range.compareBoundaryPoints(Range.START_TO_END, comprng) > 0) {
              return el[i];
            }
          } else {
            comprng.moveToElementText(el[i]);
            if (range.compareEndPoints('StartToEnd', comprng) < 0
              && range.compareEndPoints('EndToStart', comprng) > 0) {
              return el[i];
            }
          }
        }
      }
    }
    return null;
  }

  /**
   * Set default paragraph separator
   * @private
   * @returns {object} This API object for chaining
   */
  #setParagraphSeparator() {
    document.execCommand('defaultParagraphSeparator', false, this.paragraphSeparator);
    this.#paragraphSeparator = this.paragraphSeparator !== 'br'
      ? this.paragraphSeparator : EDITOR_DEFAULTS.paragraphSeparator;
    return this;
  }

  /**
   * Initialize the raw content
   * @private
   * @returns {object} This API object for chaining
   */
  #initContent() {
    // Format block action
    this.#actions.formatblock?.value.forEach((value) => {
      this.#actions[value] = { value, action: 'formatBlock' };
    });

    // Font size action
    this.#actions.fontsize?.value.forEach((value) => {
      this.#actions[`fontsize${value}`] = { value, action: 'fontSize' };
    });

    // set colorpicker
    const setColorpicker = (key) => {
      const btn = this.querySelector(`[editor-action="${key}"]`);
      if (btn) {
        let input = this.querySelector(`.${key}-input`);
        if (!input) {
          const elem = document.createElement('input');
          elem.setAttribute('type', 'color');
          elem.classList.add(`${key}-input`);
          btn.after(elem);
          input = this.querySelector(`.${key}-input`);
        }
        input?.style.setProperty('visibility', 'hidden');
        input?.style.setProperty('width', '0');
        input?.style.setProperty('height', '0');
        this.#elems[`${key}Input`] = input;
      }
    };
    setColorpicker('forecolor');
    setColorpicker('backcolor');

    // Set to cache some elements
    this.#elems.main = this.#qs('.main-container');
    this.#elems.editor = this.#qs('.editor-container');
    this.#elems.source = this.#qs('.source-container');
    this.#elems.toolbar = this.querySelector('ids-toolbar');

    const html = (slot) => slot?.assignedNodes()[0]?.innerHTML;
    const slot = this.#qs('slot[name="content"]');
    this.#elems.editor.innerHTML = html(slot) || '';
    // this.#elems..innerHTML = xssUtils.stripHTML(html(slot) || '');
    return this;
  }

  /**
   * Initialize the modals to attach with editor
   * @private
   * @returns {object} This API object for chaining
   */
  #initModals() {
    const appendModal = (key, btn, html) => {
      const template = document.createElement('template');
      template.innerHTML = html;
      this.container.appendChild(template.content.cloneNode(true));
      this.#modals[key] = { btn, modal: this.#qs(`#${key}-modal`) };
    };
    const hyperlinkBtn = this.querySelector('[editor-action="hyperlink"]');
    const insertimageBtn = this.querySelector('[editor-action="insertimage"]');

    // Error message
    const errorMessageHtml = `
      <ids-message id="errormessage-modal" status="error">
        <ids-text slot="title" font-size="24" type="h2" id="errormessage-modal-title">No Selection!</ids-text>
        <ids-text class="demo-contents" align="left">Please make some selection to complete this task.</ids-text>
        <ids-modal-button slot="buttons" type="primary" id="errormessage-modal-ok">OK</ids-modal-button>
      </ids-message>`;
    appendModal('errormessage', null, errorMessageHtml);
    this.#modals.errormessage.btn = this.#qs('#errormessage-modal-ok');

    // Hyperlink
    if (hyperlinkBtn) {
      const key = 'hyperlink';
      const btn = hyperlinkBtn;
      const {
        url,
        classes,
        targets,
        targetSelected,
        isClickable,
        showIsClickable
      } = this.#modals.defaults.hyperlink;

      const clickableElemHtml = !showIsClickable ? ''
        : `<ids-checkbox id="${key}-modal-checkbox-clickable" label="Clickable in editor"${isClickable ? ' checked="true"' : ''}></ids-checkbox>`;

      let targetDropdownHtml = '';
      if (targets.length) {
        const options = targets.map((t) => `<ids-list-box-option value="${t.value}">${t.text}</ids-list-box-option>`).join('');
        const val = targetSelected?.value ?? '';
        targetDropdownHtml = `
          <ids-dropdown id="${key}-modal-dropdown-targets" label="Target" value="${val}">
            <ids-list-box>${options}</ids-list-box>
          </ids-dropdown>`;
      }

      const html = `
        <ids-modal id="${key}-modal" part="${key}-modal">
          <ids-text slot="title" font-size="24" type="h2" id="${key}-modal-title">Insert Anchor</ids-text>
          <ids-layout-grid class="data-grid-container" auto="true" gap="md" no-margins="true" min-col-width="300px">
            <ids-layout-grid-cell>
              <ids-input id="${key}-modal-input-url" label="Url" value="${url}" validate="required"></ids-input>
              ${clickableElemHtml}
              <ids-input id="${key}-modal-input-classes" label="Css Class" value="${classes}"></ids-input>
              ${targetDropdownHtml}
              <div id="${key}-modal-checkbox-remove-container" class="hidden">
                <ids-checkbox id="${key}-modal-checkbox-remove" label="Remove hyperlink"></ids-checkbox>
              </div>
            </ids-layout-grid-cell>
          </ids-layout-grid>

          <ids-modal-button slot="buttons" id="${key}-modal-cancel-btn" type="secondary">
            <span slot="text">Cancel</span>
          </ids-modal-button>
          <ids-modal-button slot="buttons" id="${key}-modal-apply-btn" type="primary">
            <span slot="text">Apply</span>
          </ids-modal-button>
        </ids-modal>`;
      appendModal(key, btn, html);
      this.#modals[key].elems = {
        url: this.#qs(`#${key}-modal-input-url`),
        clickable: this.#qs(`#${key}-modal-checkbox-clickable`),
        classes: this.#qs(`#${key}-modal-input-classes`),
        targets: this.#qs(`#${key}-modal-dropdown-targets`),
        removeContainer: this.#qs(`#${key}-modal-checkbox-remove-container`),
        removeElem: this.#qs(`#${key}-modal-checkbox-remove`)
      };
    }

    // Insert Image
    if (insertimageBtn) {
      const key = 'insertimage';
      const btn = insertimageBtn;
      const { url, alt } = this.#modals.defaults.insertimage;
      const html = `
        <ids-modal id="${key}-modal" part="${key}-modal">
          <ids-text slot="title" font-size="24" type="h2" id="${key}-modal-title">Insert Image</ids-text>
          <ids-layout-grid class="data-grid-container" auto="true" gap="md" no-margins="true" min-col-width="300px">
            <ids-layout-grid-cell>
              <ids-input id="${key}-modal-input-src" label="Url" value="${url}" validate="required"></ids-input>
              <ids-input id="${key}-modal-input-alt" label="Alt text">${alt}</ids-input>
            </ids-layout-grid-cell>
          </ids-layout-grid>

          <ids-modal-button slot="buttons" id="${key}-modal-cancel-btn" type="secondary">
            <span slot="text">Cancel</span>
          </ids-modal-button>
          <ids-modal-button slot="buttons" id="${key}-modal-apply-btn" type="primary">
            <span slot="text">Apply</span>
          </ids-modal-button>
        </ids-modal>`;
      appendModal(key, btn, html);
    }

    return this;
  }

  /**
   * On toolbar items click.
   * @private
   * @param {Event} e The event
   * @returns {void}
   */
  #onClickToolbar(e) {
    if (!e) return;

    if (/^ids-button$/i.test(e.target.nodeName)) {
      const modals = ['hyperlink', 'insertimage'];
      const action = e.target.getAttribute('editor-action');
      const a = { ...this.#actions[action] };
      if (typeof a === 'undefined' || modals.includes(action)) return;
      this.#handleAction(action);
    }
  }

  /**
   * On toolbar items selected.
   * @private
   * @param {Event} e The event
   * @returns {void}
   */
  #onSelectedToolbar(e) {
    if (!e) return;

    if (/^ids-menu-item$/i.test(e.target.nodeName)) {
      const action = `${e.target?.menu?.target?.getAttribute('editor-action') ?? ''}`.replace(/^menu-button-/i, '');
      if (action === 'formatblock') {
        this.#handleAction(action, e.detail.value);
      }
    }
  }

  /**
   * On toolbar items input event.
   * @private
   * @param {Event} e The event
   * @returns {void}
   */
  #onInputToolbar(e) {
    if (!e) return;

    if (/forecolor-input|backcolor-input/i.test(e.target.className)) {
      const action = /forecolor-input/i.test(e.target.className) ? 'forecolor' : 'backcolor';
      const a = { ...this.#actions[action], value: e.target.value };
      document.execCommand(a.action, false, a.value);
    }
  }

  /**
   * On modal before show.
   * @private
   * @param {string} key The modal key
   * @returns {boolean} false if, should not proseed
   */
  #onBeforeShowModal(key) {
    this.#savedSelection = this.#saveSelection();
    if (!this.#savedSelection) return false;

    // Rest all values;
    this.#modals.beforeShowValues = {};

    if (key === 'hyperlink') {
      const args = { ...this.#modals.defaults.hyperlink, hideRemoveContainer: true };
      const elems = { ...this.#modals.hyperlink.elems };
      const currentLink = this.#findElementInSelection('a');
      if (currentLink) {
        args.currentLink = currentLink;
        args.hideRemoveContainer = false;
        args.url = currentLink?.getAttribute('href') ?? '';
        args.classes = currentLink?.getAttribute('class') ?? '';
        args.isClickable = currentLink?.getAttribute('contenteditable') === 'false';
        args.targetSelected = { value: currentLink?.getAttribute('target') ?? '' };
      }
      const opt = args.hideRemoveContainer ? 'add' : 'remove';
      elems.removeContainer?.classList[opt]('hidden');
      elems.url.value = args.url;
      elems.url.checkValidation();
      elems.classes.value = args.classes;
      elems.targets.value = args.targetSelected?.value ?? '';
      elems.clickable.checked = args.isClickable;
      this.#modals.beforeShowValues.hyperlink = { ...args };
    }
    return true;
  }

  /**
   * Handle given action.
   * @private
   * @param {string} action The action
   * @param {string|undefined} val The value
   * @returns {void}
   */
  #handleAction(action, val) {
    let a = { ...this.#actions[action] };
    if (typeof a === 'undefined') return;

    const sel = this.shadowRoot.getSelection();

    // Set format block
    if (a.action === 'formatBlock') {
      const v = val ?? a.value;
      const blockAction = v === 'normal' ? this.#paragraphSeparator : v;
      a = { ...this.#actions[blockAction] };

      if (a.value === 'blockquote' && this.#blockElem().tagName === 'blockquote') {
        a = { ...this.#actions[this.#paragraphSeparator] };
      }
    }

    // Set text align
    if (/^(alignleft|alignright|aligncenter|alignjustify)$/i.test(action)) {
      const alignDoc = this.locale.isRTL() ? 'right' : 'left';
      const align = action.replace('align', '');
      const value = align === alignDoc ? '' : align;
      this.#selectionBlockElems()
        .forEach((elem) => elem?.style.setProperty('text-align', value));
      return;
    }

    // Set forecolor, backcolor
    if (/^(forecolor|backcolor)$/i.test(action)) {
      this.#savedSelection = this.#saveSelection();
      if (this.#savedSelection && this.#elems[`${action}Input`]) {
        const color = action === 'backcolor'
          ? sel?.focusNode?.parentNode?.style?.getProperty('background-color')
          : document.queryCommandValue(a.action);
        this.#elems[`${action}Input`].value = /rgb/i.test(color) ? this.#rgbToHex(color) : color;
        this.#elems[`${action}Input`].click();
      }
      return;
    }
    a.value = a.value ?? val;
    document.execCommand(a.action, false, a.value);
  }

  /**
   * Handle modal action.
   * @private
   * @param {string} key The modal key
   * @returns {void}
   */
  #handleModalAction(key) {
    let a = { ...this.#actions[key] };
    if (typeof a === 'undefined') return;

    this.#restoreSelection(this.#savedSelection);
    const sel = this.shadowRoot.getSelection();
    const range = sel.getRangeAt(0);

    // Insert image
    if (key === 'insertimage') {
      a.value = this.#qs(`#${key}-modal-input-src`).value ?? '';
      if (a.value !== '') {
        if (sel.type === 'Caret') {
          range.insertNode(document.createTextNode(' '));
          sel.removeAllRanges();
          sel.addRange(range);
        }
        const alt = this.#qs(`#${key}-modal-input-alt`).value ?? '';
        if (alt !== '') {
          a = { ...this.#actions.inserthtml, value: `<img src="${a.value}" alt="${alt}" />` };
        }
        document.execCommand(a.action, false, a.value);
      }
    }

    // Hyperlink
    if (key === 'hyperlink') {
      const elems = { ...this.#modals.hyperlink.elems };
      const {
        currentLink,
        hideRemoveContainer
      } = this.#modals.beforeShowValues.hyperlink;

      if (hideRemoveContainer) {
        // Create new hyperlink
        if (elems.url.value) {
          a.value = 'EDITOR_CREATED_NEW_HYPERLINK';
          document.execCommand(a.action, false, a.value);
          const aLink = this.#qs(`a[href="${a.value}"`);
          aLink.setAttribute('href', elems.url.value);
          aLink.innerHTML = aLink.innerHTML.replace(a.value, elems.url.value);
          if (elems.classes.value !== '') {
            aLink.setAttribute('class', elems.classes.value);
          }
          if (elems.targets.value !== '') {
            aLink.setAttribute('target', elems.targets.value);
          }
          if (elems.clickable.checked) {
            aLink.setAttribute('contenteditable', 'false');
          }
        }
      } else if (elems.removeElem.checked || elems.url.value === '') {
        // Remove the current hyperlink, selection was on hyperlink
        currentLink.outerHTML = currentLink.innerHTML;
      } else {
        // Update the current hyperlink, selection was on hyperlink
        const attr = (name, value) => {
          if (value !== '') {
            currentLink.setAttribute(name, value);
          } else {
            currentLink.removeAttribute(name);
          }
        };
        attr('href', elems.url.value);
        attr('class', elems.classes.value);
        attr('target', elems.targets.value);
        attr('contenteditable', elems.clickable.checked ? 'false' : '');
      }

      // Reset all hyperlink related elements in modal, for next time open
      elems.removeElem.checked = false;
      Object.entries(elems)
        .filter(([k]) => (!(/^(removeElem|removeContainer)$/.test(k))))
        .map((x) => x[1])
        .forEach((elem) => { elem && (elem.disabled = false); });
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

    // Attach toolbar events
    const toolbar = this.querySelector('[slot="toolbar"]');
    this.onEvent('click.editor-toolbar', toolbar, (e) => {
      this.#onClickToolbar(e);
    });
    this.onEvent('selected.editor-toolbar', toolbar, (e) => {
      this.#onSelectedToolbar(e);
    });
    this.onEvent('input.editor-toolbar', toolbar, (e) => {
      this.#onInputToolbar(e);
    });

    // Attach events to each modal
    ['errormessage', 'insertimage', 'hyperlink'].forEach((key) => {
      if (this.#modals[key]?.modal) {
        this.#attachModalEvents(key);
      }
    });

    return this;
  }

  /**
   * Attach modal events
   * @private
   * @param {string} key The modal key
   * @returns {void}
   */
  #attachModalEvents(key) {
    const modal = this.#modals[key].modal;

    // Hide modal
    modal.onButtonClick = () => {
      modal?.hide();
    };

    // No need to bind else, if modal has no target-btn
    if (!this.#modals[key].btn) return;

    // Set modal trigger
    modal.target = this.#modals[key].btn;
    modal.trigger = 'click';

    // Before modal open
    this.onEvent(`beforeshow.editor-modal-${key}`, modal, (e) => {
      if (!this.#onBeforeShowModal(key) && key !== 'errormessage') {
        e.detail.response(false);
        this.#modals.errormessage?.modal?.show();
      }
    });

    // Apply button clicked
    this.onEvent(`click.editor-modal-${key}`, modal, (e) => {
      if (e.target.getAttribute('id') === `${key}-modal-apply-btn`) {
        this.#handleModalAction(key);
      }
    });

    // Toggle disable elements in hyperlink modal
    if (key === 'hyperlink') {
      const elems = this.#modals[key].elems;
      const removeElem = elems.removeElem;
      const elemsToDisable = Object.entries(elems)
        .filter(([k]) => (!(/^(removeElem|removeContainer)$/.test(k)))).map((x) => x[1]);
      this.onEvent(`change.editor-modal-${key}-checkbox-remove`, removeElem, (e) => {
        elemsToDisable.forEach((elem) => {
          elem && (elem.disabled = e.detail.checked);
        });
      });
    }
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
    this.#setParagraphSeparator();
  }

  get paragraphSeparator() {
    return this.getAttribute(attributes.PARAGRAPH_SEPARATOR) || EDITOR_DEFAULTS.paragraphSeparator;
  }
}
