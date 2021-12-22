import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';

import Base from './ids-editor-base';
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
const BLOCK_ELEMENTS = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre'];

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
      .elementsValueInModals()
      .#addDefaultToolbar()
      .#initContent()
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
          <div id="editor-container" class="editor-container" part="editor-container" contenteditable="true" aria-multiline="true" role="textbox" aria-label="${this.label}"></div>
          <div class="source-container" part="source-container"></div>
        </div>
      </div>`;
  }

  /**
   * Set default value for each elements in modals.
   * @param {{
   *  hyperlink: {
   *    url: string,
   *    class: string,
   *    targets: [{ text: string, value: string }],
   *    isClickable: boolean,
   *    showIsClickable: boolean
   *  },
   *  insertimage: {
   *    url: string,
   *    alt: string,
   *  }
   * }|undefined} modals incoming modals options
   * @returns {object} This API object for chaining
   */
  elementsValueInModals(modals) {
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
   * List of modals attached to editor.
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
    h1: { action: 'formatBlock', value: 'h1' },
    h2: { action: 'formatBlock', value: 'h2' },
    h3: { action: 'formatBlock', value: 'h3' },
    h4: { action: 'formatBlock', value: 'h4' },
    h5: { action: 'formatBlock', value: 'h5' },
    h6: { action: 'formatBlock', value: 'h6' },
    div: { action: 'formatBlock', value: 'div' },
    p: { action: 'formatBlock', value: 'p' },
    pre: { action: 'formatBlock', value: 'pre' },
    blockquote: { action: 'formatBlock', value: 'blockquote' },
    formatblock: { action: 'formatBlock', value: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'blockquote'] },

    // FONT SIZE
    fontsize1: { action: 'fontSize', value: '1' },
    fontsize2: { action: 'fontSize', value: '2' },
    fontsize3: { action: 'fontSize', value: '3' },
    fontsize4: { action: 'fontSize', value: '4' },
    fontsize5: { action: 'fontSize', value: '5' },
    fontsize6: { action: 'fontSize', value: '6' },
    fontsize7: { action: 'fontSize', value: '7' },
    fontsize: { action: 'fontSize', value: ['1', '2', '3', '4', '5', '6', '7'] },

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
   * Add the default toolbar
   * @private
   * @returns {object} This API object for chaining
   */
  #addDefaultToolbar() {
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

          <ids-button editor-action="forecolor" editor-action-value="#ff0000" square="true" tooltip="Text Color">
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
   * Get block element for given node
   * @private
   * @param {Selection} sel The selection.
   * @returns {object} The element
   */
  #blockElem(sel) {
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
   * Check if current selection block element tagName same as given tagName
   * @private
   * @param {Selection} sel The selection.
   * @param {string} tagName Element tag name.
   * @returns {boolean} true if same tagName
   */
  #isBlockTag(sel, tagName) {
    return this.#blockElem(sel).tagName === tagName;
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
    const html = (slot) => slot?.assignedNodes()[0]?.innerHTML;
    const slot = this.shadowRoot?.querySelector('slot[name="content"]');
    const editor = this.shadowRoot.querySelector('.editor-container');
    editor.innerHTML = html(slot) || '';
    // editor.innerHTML = xssUtils.stripHTML(html(slot) || '');
    return this;
  }

  /**
   * Initialize the modals to attach with editor
   * @private
   * @returns {object} This API object for chaining
   */
  #initModals() {
    const qs = (s) => this.shadowRoot?.querySelector(s);
    const appendModal = (key, btn, html) => {
      const template = document.createElement('template');
      template.innerHTML = html;
      this.container.appendChild(template.content.cloneNode(true));
      this.#modals[key] = { btn, modal: qs(`#${key}-modal`) };
    };
    const hyperlinkBtn = qs('[editor-action="hyperlink"]');
    const insertimageBtn = qs('[editor-action="insertimage"]');

    // Error message
    const errorMessageHtml = `
      <ids-message id="errormessage-modal" status="error">
        <ids-text slot="title" font-size="24" type="h2" id="errormessage-modal-title">No Selection!</ids-text>
        <ids-text class="demo-contents" align="left">Please make some selection to complete this task.</ids-text>
        <ids-modal-button slot="buttons" type="primary" id="errormessage-modal-ok">OK</ids-modal-button>
      </ids-message>`;
    appendModal('errormessage', null, errorMessageHtml);
    this.#modals.errormessage.btn = qs('#errormessage-modal-ok');

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
        url: qs(`#${key}-modal-input-url`),
        clickable: qs(`#${key}-modal-checkbox-clickable`),
        classes: qs(`#${key}-modal-input-classes`),
        targets: qs(`#${key}-modal-dropdown-targets`),
        removeContainer: qs(`#${key}-modal-checkbox-remove-container`),
        removeElem: qs(`#${key}-modal-checkbox-remove`)
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
   * Handle given action.
   * @private
   * @param {string} action The action
   * @param {string|undefined} val The value
   * @returns {void}
   */
  #handleAction(action, val) {
    let a = { ...this.#actions[action] };
    if (typeof a === 'undefined' || /hyperlink|insertimage/i.test(action)) return;

    const sel = this.shadowRoot.getSelection();
    if (action === 'hyperlink'
      && sel.anchorNode.parentNode.tagName === 'A'
      && sel.anchorNode === sel.focusNode) {
      a = { ...this.#actions.unlink };
    }
    if (a.action === 'formatBlock') {
      const v = val ?? a.value;
      const blockAction = v === 'normal' ? this.#paragraphSeparator : v;
      a = { ...this.#actions[blockAction] };

      if (a.value === 'blockquote' && this.#isBlockTag(sel, 'blockquote')) {
        a = { ...this.#actions[this.#paragraphSeparator] };
      }
    }
    a.value = a.value ?? val;
    document.execCommand(a.action, false, a.value);
  }

  /**
   * Handle modal before show.
   * @private
   * @param {string} key The modal key
   * @returns {boolean} false if, should not proseed
   */
  #handleModalBeforeshow(key) {
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
   * Handle modal action.
   * @private
   * @param {string} key The modal key
   * @returns {void}
   */
  #handleModalAction(key) {
    const qs = (s) => this.shadowRoot?.querySelector(s);
    this.#restoreSelection(this.#savedSelection);
    const sel = this.shadowRoot.getSelection();
    const range = sel.getRangeAt(0);
    let a = { ...this.#actions[key] };

    // Insert image
    if (key === 'insertimage') {
      a.value = qs(`#${key}-modal-input-src`).value ?? '';
      if (a.value !== '') {
        if (sel.type === 'Caret') {
          range.insertNode(document.createTextNode(' '));
          sel.removeAllRanges();
          sel.addRange(range);
        }
        const alt = qs(`#${key}-modal-input-alt`).value ?? '';
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
          const aLink = qs(`a[href="${a.value}"`);
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
    qs('.editor-container').focus();
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
    const container = this.shadowRoot.querySelector('#editor-container');
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
          if (/^menu-button-/i.test(action)) {
            args.isPopup = true;
            args.popup = btn?.menuEl?.popup;
            availabileElems.push(args.popup);
          } else {
            args.value = btn.getAttribute('editor-action-value');
          }
          return args;
        });
        if (Object.values(availabileElems).some((v) => typeof v === 'undefined') && max > 0) {
          reqUntilAvailabile();
        } else {
          // Reday to bind events
          this.#toolbarActions.forEach((a) => {
            if (a.isPopup) {
              const action = a.action.replace(/^menu-button-/i, '');
              this.offEvent('selected.editor-toolbar-popup', a.popup);
              this.onEvent('selected.editor-toolbar-popup', a.popup, (e) => {
                a.btn.text = e.detail.elem.text;
                this.#handleAction(action, e.detail.value);
              });
            } else {
              this.offEvent('click.editor-toolbar-btn', a.btn);
              this.onEvent('click.editor-toolbar-btn', a.btn, () => {
                this.#handleAction(a.action, a.value);
              });
            }
          });

          // Link the Modal to its trigger button (sets up click/focus events)
          this.#initModals();
          const attachModalEvents = (key) => {
            const modal = this.#modals[key].modal;
            modal.target = this.#modals[key].btn;
            modal.trigger = 'click';
            this.offEvent(`beforeshow.editor-modal-${key}`, modal);
            this.onEvent(`beforeshow.editor-modal-${key}`, modal, (e) => {
              if (!this.#handleModalBeforeshow(key)) {
                e.detail.response(false);
                this.#modals.errormessage?.modal?.show();
              }
            });
            this.offEvent(`click.editor-modal-${key}`, modal);
            this.onEvent(`click.editor-modal-${key}`, modal, (e) => {
              if (e.target.getAttribute('id') === `${key}-modal-cancel-btn`) {
                modal.hide();
              }
              if (e.target.getAttribute('id') === `${key}-modal-apply-btn`) {
                modal.hide();
                this.#handleModalAction(key);
              }
            });
          };

          // Hide error message
          if (this.#modals.errormessage?.modal) {
            this.#modals.errormessage.modal.onButtonClick = () => {
              this.#modals.errormessage?.modal.hide();
            };
          }

          if (this.#modals.hyperlink?.modal) {
            attachModalEvents('hyperlink');

            // list all hyperlink-modal elements, except remove checkbox
            const elems = Object.entries(this.#modals.hyperlink.elems)
              .filter(([k]) => (!(/^(removeElem|removeContainer)$/.test(k)))).map((x) => x[1]);

            // Bind toggle disable with remove checkbox
            const removeElem = this.#modals.hyperlink.elems.removeElem;
            this.offEvent('change.editor-modal-hyperlink-checkbox-remove', removeElem);
            this.onEvent('change.editor-modal-hyperlink-checkbox-remove', removeElem, (e) => {
              elems.forEach((elem) => {
                elem && (elem.disabled = e.detail.checked);
              });
            });
          }
          if (this.#modals.insertimage?.modal) {
            attachModalEvents('insertimage');
          }
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
    this.#setParagraphSeparator();
  }

  get paragraphSeparator() {
    return this.getAttribute(attributes.PARAGRAPH_SEPARATOR) || EDITOR_DEFAULTS.paragraphSeparator;
  }
}
