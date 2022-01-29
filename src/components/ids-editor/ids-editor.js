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

import { debounce } from '../../utils/ids-debounce-utils/ids-debounce-utils';
import { sanitizeHTML } from '../../utils/ids-xss-utils/ids-xss-utils';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import { isObject } from '../../utils/ids-object-utils/ids-object-utils';

import styles from './ids-editor.scss';

// List of view modes
const VIEWS = ['editor', 'source'];

// List of paragraph separators
const PARAGRAPH_SEPARATORS = ['p', 'div', 'br'];

// List of block elements
const BLOCK_ELEMENTS = ['p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre'];

// List of font size
const FONT_SIZES = ['1', '2', '3', '4', '5', '6', '7'];

// Css classes used most in editor
const CLASSES = { hidden: 'hidden', labelRequired: 'no-required-indicator' };

// List of defaults
const EDITOR_DEFAULTS = {
  disabled: false,
  label: 'Ids editor',
  labelHidden: false,
  labelRequired: true,
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
  paragraphSeparator: 'p',
  pasteAsPlainText: false,
  readonly: false,
  sourceFormatter: false,
  view: 'editor', // 'editor', 'source'
};

// Instance counter
let instanceCounter = 0;

/**
 * IDS Editor Component
 * @type {IdsEditor}
 * @inherits IdsElement
 * @mixes IdsThemeMixin
 * @mixes IdsLocaleMixin
 * @mixes IdsDirtyTrackerMixin
 * @mixes IdsValidationMixin
 * @mixes IdsEventsMixin
 * @part editor - the editor element
 * @part editor-label - the editor label element
 * @part main-container - the main container element
 * @part toolbar-container - the toolbar container element
 * @part editor-container - the editor container element
 * @part source-container - the source container element
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
      .#initToolbar()
      .#initContent()
      .modalElementsValue()
      .#setParagraphSeparator()
      .#attachEventHandlers()
      .#initView();
    super.connectedCallback?.();
  }

  disconnectedCallback() {
    super.disconnectedCallback?.();

    // Cleanup markings might still present
    [
      ...this.#qsAll('#errormessage-modal, #hyperlink-modal, #insertimage-modal'),
      ...this.#qsAll(
        `ids-button,
        ids-separator,
        ids-menu-button,
        ids-popup-menu,
        ids-toolbar-section,
        ids-toolbar-more-actions,
        ids-toolbar`,
        this
      )
    ].flat().forEach((elem) => elem?.remove());
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.DISABLED,
      attributes.LABEL,
      attributes.LABEL_HIDDEN,
      attributes.LABEL_REQUIRED,
      attributes.PARAGRAPH_SEPARATOR,
      attributes.PASTE_AS_PLAIN_TEXT,
      attributes.PLACEHOLDER,
      attributes.READONLY,
      attributes.SOURCE_FORMATTER,
      attributes.VIEW,
    ];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    this.reqInitialize = true;
    instanceCounter++;
    const disabled = this.disabled ? ' disabled' : '';
    const readonly = this.readonly ? ' readonly' : '';
    const contenteditable = !this.disabled && !this.readonly ? ' contenteditable="true"' : '';
    const labelClass = `editor-label${!this.labelRequired ? ` ${CLASSES.labelRequired}` : ''}`;
    const labelHidden = this.labelHidden ? ' audible' : '';
    const placeholder = this.placeholder ? ` placeholder="${this.placeholder}"` : '';
    return `
      <div class="ids-editor" part="editor"${disabled}${readonly}>
        <slot name="content" class="${CLASSES.hidden}"></slot>
        <ids-text id="editor-label" class="${labelClass}" part="editor-label"${disabled}${readonly}${labelHidden}>${this.label}</ids-text>
        <div class="main-container" part="main-container">
          <div class="toolbar-container" part="toolbar-container">
            <slot name="toolbar"></slot>
          </div>
          <div class="editor-content">
            <div id="editor-container" class="editor-container" part="editor-container"${contenteditable} aria-multiline="true" role="textbox" aria-labelledby="editor-label"${placeholder}></div>
            <div class="source-container ${CLASSES.hidden}" part="source-container">
              <div class="source-wrapper">
                <ul class="line-numbers"></ul>
                <label class="audible" for="source-textarea">
                  ${this.sourceTextareaLabel()}
                </label>
                <textarea id="source-textarea" class="source-textarea"${placeholder}></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>`;
  }

  /**
   * @returns {Array<string>} Drawer vetoable events
   */
  vetoableEventTypes = [
    'beforesourcemode',
    'beforeeditormode',
    'beforepaste'
  ];

  /**
   * Set default value to each element in modals.
   * @param {object} [modals] Incoming modals options.
   * @param {object} [modals.hyperlink] The hyperlink options.
   * @param {string} [modals.hyperlink.url] Url for hyperlink.
   * @param {string} [modals.hyperlink.class] Css Class for hyperlink.
   * @param {Array<object>} [modals.hyperlink.targets] List target options for hyperlink.
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
    if (m.hyperlink?.targets?.constructor === Array) {
      m.hyperlink.targets.forEach((target) => {
        if (isObject(target) && target.text) {
          const args = { text: target.text, value: target.value };
          if (target.selected) args.selected = true;
          hyperlinkTargets.push(args);
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

    this.#initModals();
    return this;
  }

  /**
   * Get label text for source textarea.
   * @returns {string} The label text for source textarea
   */
  sourceTextareaLabel() {
    return `${this.label} - HTML Source View`;
  }

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
   * extra actions get added in `#initContent()`
   * @private
   * @type {Array<object>}
   */
  #actions = {
    // STYLES
    bold: { action: 'bold', keyid: 'KeyB' },
    italic: { action: 'italic', keyid: 'KeyI' },
    underline: { action: 'underline', keyid: 'KeyU' },
    strikethrough: { action: 'strikeThrough', keyid: 'KeyS|shift' },

    // SCRIPTS
    superscript: { action: 'superscript', keyid: 'Equal|shift' },
    subscript: { action: 'subscript', keyid: 'Equal' },

    // TEXT FORMAT
    formatblock: { action: 'formatBlock', value: [...BLOCK_ELEMENTS] },

    // FONT SIZE
    fontsize: { action: 'fontSize', value: [...FONT_SIZES] },

    // COLORS
    forecolor: { action: 'foreColor', keyid: 'KeyK|shift|alt' },
    backcolor: { action: 'backColor' },

    // LISTS
    orderedlist: { action: 'insertOrderedList', keyid: 'KeyO|shift' },
    unorderedlist: { action: 'insertUnorderedList', keyid: 'KeyU|shift' },

    // INSERT
    insertimage: { action: 'insertImage', keyid: 'KeyI|shift' },
    hyperlink: { action: 'createLink', keyid: 'KeyK' },
    unlink: { action: 'unlink', keyid: 'KeyK|shift' },
    inserthtml: { action: 'insertHTML' },
    inserthorizontalrule: { action: 'insertHorizontalRule', keyid: 'KeyL|shift' },

    // ALIGNMENT
    alignleft: { action: 'justifyLeft', keyid: 'KeyL' },
    alignright: { action: 'justifyRight', keyid: 'KeyR' },
    aligncenter: { action: 'justifyCenter', keyid: 'KeyE' },
    alignjustify: { action: 'justifyFull', keyid: 'KeyJ' },

    // CLEAR FORMATTING
    clearformatting: { action: 'removeFormat', keyid: 'Space|shift' },

    // HISTORY
    redo: { action: 'redo', keyid: 'KeyY' },
    undo: { action: 'undo', keyid: 'KeyZ' },

    // EXTRA
    editormode: { action: 'editorMode', keyid: 'Backquote|shift' },
    sourcemode: { action: 'sourceMode', keyid: 'Backquote' }
  };

  /**
   * Attach the resize observer.
   * @private
   * @type {number}
   */
  #resizeObserver = new ResizeObserver(() => this.#resize());

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
   * Trigger the given event with current value.
   * @private
   * @param {string} eventtName The event name to be trigger.
   * @param {HTMLElement} target The target element.
   * @param {object} extra Extra data.
   * @returns {object} This API object for chaining.
   */
  #triggerEvent(eventtName, target = this, extra = {}) {
    this.triggerEvent(eventtName, target, {
      detail: { elem: this, value: this.value, ...extra }
    });
    return this;
  }

  /**
   * Init the current view
   * @private
   * @returns {object} This API object for chaining
   */
  #initView() {
    const shouldChange = this.#elems[this.view]?.classList?.contains(CLASSES.hidden);
    if (shouldChange) /source/i.test(this.view) ? this.#sourceMode() : this.#editorMode();

    window.requestAnimationFrame(() => {
      this.#setSourceContent();
      this.#triggerEvent('initialize');
    });
    return this;
  }

  /**
   * Init the toolbar
   * @private
   * @returns {object} This API object for chaining
   */
  #initToolbar() {
    const tmplToolbar = `
      <ids-toolbar slot="toolbar" type="formatter">
        <ids-toolbar-section type="buttonset">

          <ids-menu-button
            editor-action="formatblock"
            id="btn-formatblock-${instanceCounter}"
            role="button"
            menu="menu-formatblock-${instanceCounter}"
            tooltip="Choose Font Style"
            formatter-width="125px"
            dropdown-icon
            trigger="click">
            <span slot="text">Normal Text</span>
          </ids-menu-button>
          <ids-popup-menu id="menu-formatblock-${instanceCounter}" target="#btn-formatblock-${instanceCounter}">
            <ids-menu-group>
              <ids-menu-item value="p" selected="true"><ids-text>Normal Text</ids-text></ids-menu-item>
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

          <ids-button editor-action="hyperlink" square="true" tooltip="Insert Hyperlink">
            <span slot="text" class="audible">Insert Hyperlink</span>
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

          <ids-button editor-action="editormode" square="true" tooltip="View Visual">
            <span slot="text" class="audible">View Visual</span>
            <ids-icon slot="icon" icon="visual" width="50" viewbox="0 0 73 18"></ids-icon>
          </ids-button>

        </ids-toolbar-section>
        <ids-toolbar-more-actions overflow color-variant="alternate-formatter"></ids-toolbar-more-actions>
      </ids-toolbar>`;

    const slot = this.querySelector('[slot="toolbar"]');
    if (!slot) {
      this.insertAdjacentHTML('afterbegin', tmplToolbar);
    }

    return this;
  }

  /**
   * Get current selection
   * @private
   * @returns {Selection} The selection
   */
  #getSelection() {
    if (!this.shadowRoot.getSelection) {
      return document.getSelection();
    }
    return this.shadowRoot.getSelection();
  }

  /**
   * Get block element and tagName for given node
   * @private
   * @param {Selection|undefined} sel The selection.
   * @returns {object} The element
   */
  #blockElem(sel = this.#getSelection()) {
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
  #selectionBlockElems(sel = this.#getSelection()) {
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
    const sel = this.#getSelection();
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
    const sel = this.#getSelection();
    if (savedSel) {
      sel.removeAllRanges();
      for (let i = 0, len = savedSel.length; i < len; i += 1) {
        sel.addRange(savedSel[i]);
      }
    }
    return this;
  }

  /**
   * Get all selection parents.
   * @private
   * @returns {object} List of selection parents.
   */
  #selectionParents() {
    const parents = {};
    const sel = this.#getSelection();
    if (sel?.containsNode(this.#elems.editor, true)) {
      let node = sel?.focusNode;
      while (node?.id !== 'editor-container') {
        const tag = node?.tagName?.toLowerCase();
        if (tag) parents[tag] = { tag, node };
        node = node?.parentNode;
      }
    }
    return parents;
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
    const range = this.#getSelection().getRangeAt(0);

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
   * Format given string to proper indentation.
   * @param {string} html true will force to toggle in to source mode.
   * @returns {string} formated value
   */
  #formatHtml(html) {
    html = html.trim();
    const tokens = html.split(/</);
    let indentLevel = 0;
    let result = '';

    const getIndent = (level) => {
      const tabsize = 4;
      let indentation = '';
      let i = level * tabsize;
      if (level > -1) {
        while (i--) {
          indentation += ' ';
        }
      }
      return indentation;
    };

    for (let i = 0, l = tokens.length; i < l; i++) {
      const parts = tokens[i].split(/>/);

      if (parts.length === 2) {
        if (tokens[i][0] === '/') {
          indentLevel--;
        }
        result += getIndent(indentLevel);
        if (tokens[i][0] !== '/') {
          indentLevel++;
        }
        if (i > 0) {
          result += '<';
        }
        result += `${parts[0].trim()}>\n`;
        if (parts[1].trim() !== '') {
          result += `${getIndent(indentLevel) + parts[1].trim().replace(/\s+/g, ' ')}\n`;
        }
        if (parts[0].match(/^(area|base|br|col|command|embed|hr|img|input|link|meta|param|source)/)) {
          indentLevel--;
        }
      } else {
        result += `${getIndent(indentLevel) + parts[0]}\n`;
      }
    }
    return result.trim();
  }

  /**
   * Set the heights and adjust the line number feature.
   * @private
   * @returns {void}
   */
  #adjustSourceLineNumbers() {
    window.requestAnimationFrame(() => {
      const lineHeight = parseInt(getComputedStyle(this.#elems.textarea).lineHeight, 10);
      const YPadding = 0;
      this.#elems.textarea.style.height = '';

      const scrollHeight = this.#elems.textarea.scrollHeight;
      const lineNumberCount = Math.floor((scrollHeight - YPadding) / lineHeight);
      const numberList = this.#elems.lineNumbers;
      const lastIdx = numberList.querySelectorAll('li').length;

      let list = '';
      let i = 0;

      if (!this.#elems.lineNumberCount || lineNumberCount !== this.#elems.lineNumberCount) {
        if (!this.#elems.lineNumberCount) {
          // Build the list of line numbers from scratch
          this.#elems.lineNumberCount = lineNumberCount;
          while (i < this.#elems.lineNumberCount) {
            list += `<li role="presentation"><span>${(i + 1)}</span></li>`;
            i++;
          }
          numberList.insertAdjacentHTML('beforeend', list);
        } else if (this.#elems.lineNumberCount < lineNumberCount) {
          // Add extra line numbers to the bottom
          while (i < (lineNumberCount - this.#elems.lineNumberCount)) {
            list += `<li role="presentation"><span>${(lastIdx + i + 1)}</span></li>`;
            i++;
          }
          numberList.insertAdjacentHTML('beforeend', list);
        } else if (this.#elems.lineNumberCount > lineNumberCount) {
          // Remove extra line numbers from the bottom
          i = this.#elems.lineNumberCount - lineNumberCount;
          [...numberList.querySelectorAll('li')].slice(-(i)).forEach((item) => item?.remove());
        }
        this.#elems.lineNumberCount = lineNumberCount;
      }

      this.#elems.textarea.style.height = `${numberList.scrollHeight}px`;
    });
  }

  /**
   * Check if given html is word format
   * @private
   * @param {string} content The html
   * @returns {string} The cleaned html
   */
  #isWordFormat(content) {
    return (
      (/<font face="Times New Roman"|class="?Mso|style="[^"]*\bmso-|style='[^'']*\bmso-|w:WordDocument/i)
        .test(content)
        || (/class="OutlineElement/).test(content)
        || (/id="?docs\-internal\-guid\-/.test(content)) // eslint-disable-line
    );
  }

  /**
   * Clean word format for given html
   * @private
   * @param {string} content The html
   * @returns {string} The cleaned html
   */
  #cleanWordHtml(content) {
    let s = content;

    // Word comments like conditional comments etc
    s = s.replace(/<!--[\s\S]+?-->/gi, '');

    // Remove comments, scripts (e.g., msoShowComment), XML tag, VML content,
    // MS Office namespaced tags, and a few other tags
    s = s.replace(/<(!|script[^>]*>.*?<\/script(?=[>\s])|\/?(\?xml(:\w+)?|img|meta|link|style|\w:\w+)(?=[\s\/>]))[^>]*>/gi, ''); // eslint-disable-line

    // Convert <s> into <strike> for line-though
    s = s.replace(/<(\/?)s>/gi, '<$1strike>');

    // Replace nbsp entites to char since it's easier to handle
    s = s.replace(/&nbsp;/gi, '\u00a0');

    // Convert <span style="mso-spacerun:yes"></span> to string of alternating
    // breaking/non-breaking spaces of same length
    s = s.replace(/<span\s+style\s*=\s*"\s*mso-spacerun\s*:\s*yes\s*;?\s*"\s*>([\s\u00a0]*)<\/span>/gi, (str, spaces) => ((spaces.length > 0) ? spaces.replace(/./, ' ').slice(Math.floor(spaces.length / 2)).split('').join('\u00a0') : ''));

    // Remove line breaks / Mso classes
    s = s.replace(/(\n|\r| class=(\'|")?Mso[a-zA-Z]+(\'|")?)/g, ' '); // eslint-disable-line

    const badTags = ['style', 'script', 'applet', 'embed', 'noframes', 'noscript'];

    // Remove everything in between and including "badTags"
    for (let i = 0, l = badTags.length; i < l; i++) {
      const re = new RegExp(`<${badTags[i]}.*?${badTags[i]}(.*?)>`, 'gi');
      s = s.replace(re, '');
    }

    return s;
  }

  /**
   * Strip given styles
   * @private
   * @param {string} content The html
   * @param {RegExp} styleStripper The RegExp
   * @returns {string} The cleaned html
   */
  #stripStyles(content, styleStripper) {
    const stylesToKeep = ['color', 'font-size', 'background', 'font-weight', 'font-style', 'text-decoration', 'text-align'];
    return content.replace(styleStripper, (m) => {
      m = m.replace(/( style=|("|\'))/gi, ''); // eslint-disable-line
      const attrs = m.split(';');
      let strStyle = '';
      for (let i = 0; i < attrs.length; i++) {
        const entry = attrs[i].split(':');
        strStyle += (stylesToKeep.indexOf((entry[0] || '').trim()) > -1) ? `${entry[0]}:${entry[1]};` : '';
      }
      return (strStyle !== '') ? ` style="${strStyle}"` : '';
    });
  }

  /**
   * Strip given attribute
   * @private
   * @param {string} content The html
   * @param {string} attribute The attribute
   * @param {RegExp} attributeStripper The RegExp
   * @returns {string} The cleaned html
   */
  #stripAttribute(content, attribute, attributeStripper) {
    return (attribute === 'style')
      ? this.#stripStyles(content, attributeStripper)
      : content.replace(attributeStripper, '');
  }

  /**
   * Convert html entities
   * @private
   * @param {string} str The html
   * @returns {string} The converted html
   */
  #htmlEntities(str) {
    // converts special characters (e.g., <) into their escaped/encoded values (e.g., &lt;).
    // This allows you to display the string without the browser reading it as HTML.
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /**
   * Clean given html
   * @private
   * @param {string} content The html
   * @returns {string} The cleaned html
   */
  #cleanHtml(content) {
    let attributeStripper;
    let s = content || '';

    const badAttributes = [
      'start', 'xmlns', 'xmlns:o', 'xmlns:w', 'xmlns:x', 'xmlns:m',
      'onmouseover', 'onmouseout', 'onmouseenter', 'onmouseleave',
      'onmousemove', 'onload', 'onfocus', 'onblur', 'onclick',
      'style'
    ];

    // Remove extra word formating
    if (this.#isWordFormat(s)) {
      s = this.#cleanWordHtml(s);
    }

    // Remove bad attributes
    for (let i = 0, l = badAttributes.length; i < l; i++) {
      attributeStripper = new RegExp(` ${badAttributes[i]}="(.*?)"`, 'gi');
      s = this.#stripAttribute(s, badAttributes[i], attributeStripper);

      attributeStripper = new RegExp(` ${badAttributes[i]}='(.*?)'`, 'gi');
      s = this.#stripAttribute(s, badAttributes[i], attributeStripper);
    }

    // Remove "ng-" directives and "ng-" classes
    s = s.replace(/\sng-[a-z-]+/, '');

    // Remove comments
    s = s.replace(/<!--(.*?)-->/gm, '');

    // Remove extra spaces
    s = s.replace(/\s\s+/g, ' ').replace(/\s>+/g, '>');

    // Remove extra attributes from list elements
    s = s.replace(/<(ul)(.*?)>/gi, '<$1>');

    // Remove empty list
    s = s.replace(/<li><\/li>/gi, '');
    s = s.replace(/<(ul|ol)><\/(ul|ol)>/gi, '');

    // Remove html and body tags
    s = s.replace(/<\/?(html|body)(.*?)>/gi, '');

    // Remove header tag and content
    s = s.replace(/<head\b[^>]*>(.*?)<\/head>/gi, '');

    // Remove empty tags
    s = s.replace(/<(div|span|p)> <\/(div|span|p)>/gi, ' ');
    s = s.replace(/<[^(br|/>)]+>[\s]*<\/[^>]+>/gi, '');

    if (s.indexOf('·') > -1) {
      // Replace span and paragraph tags from bulleted list pasting
      s = s.replace(/<\/p>/gi, '</li>');
      s = s.replace(/<p><span><span>·<\/span><\/span>/gi, '<li>');
      // Remove white space
      s = s.replace(/<\/li>\s<li>/gi, '</li><li>');
      // Add in opening and closing ul tags
      s = [s.slice(0, s.indexOf('<li>')), '<ul>', s.slice(s.indexOf('<li>'))].join('');
      s = [s.slice(0, s.lastIndexOf('</li>')), '</ul>', s.slice(s.lastIndexOf('</li>'))].join('');
    }

    return s;
  }

  /**
   * Trim out the editor spaces for comparison.
   * @private
   * @param  {string} content The html.
   * @returns {string} The trimmed content.
   */
  #trimContent(content) {
    const bElems = BLOCK_ELEMENTS.join('|');
    return sanitizeHTML(content || '')
      .trim()
      .replace(/>\s+</g, '><')
      .replace(/\s+/g, ' ')
      .replace(/<br(\s?\/)?>/g, '<br>\n')
      .replace(new RegExp(`</(${bElems})>`, 'gi'), '</$1>\n\n')
      .replace(/\n\n$/, '\n')
      .replace(new RegExp(`<(${bElems})><br>\\n</(${bElems})>\\n`, 'gi'), '');
  }

  /**
   * Set editor content value
   * @private
   * @param {string} content The html
   * @returns {object} This API object for chaining
   */
  #setEditorContent(content) {
    const { editor, textarea } = this.#elems;
    let html = this.#trimContent(content || textarea.value);
    html = this.#cleanHtml(html);
    if (editor.innerHTML !== html) editor.innerHTML = html;
    return this;
  }

  /**
   * Set source content value
   * @private
   * @param {string} content The html
   * @returns {object} This API object for chaining
   */
  #setSourceContent(content) {
    const { editor, textarea } = this.#elems;
    if (editor.textContent.replace('\n', '') === '') editor.innerHTML = '';
    let value = this.#trimContent(content || editor.innerHTML);
    value = this.sourceFormatter ? this.#formatHtml(value) : value;
    if (textarea.value !== value) textarea.value = value;
    return this;
  }

  /**
   * Switch to editor mode
   * @private
   * @param {string} content The html
   * @returns {object|boolean} This API object for chaining, false if veto
   */
  #editorMode(content) {
    this.#elems.reqviewchange = true;

    // Fire the vetoable event.
    const args = { value: this.value, view: this.view };
    if (!this.triggerVetoableEvent('beforeeditormode', args)) {
      this.#triggerEvent('rejectviewchange');
      return false;
    }
    this.#setEditorContent(content);
    const elems = this.#elems;
    elems.btnSource.hidden = false;
    elems.btnEditor.hidden = true;
    elems.source.classList.add(CLASSES.hidden);
    elems.editor.classList.remove(CLASSES.hidden);
    elems.toolbar.disabled = false;
    elems.editor.focus();
    return this;
  }

  /**
   * Switch to source mode
   * @private
   * @param {string} content The html
   * @returns {object|boolean} This API object for chaining, false if veto
   */
  #sourceMode(content) {
    this.#elems.reqviewchange = true;

    // Fire the vetoable event.
    const args = { value: this.value, view: this.view };
    if (!this.triggerVetoableEvent('beforesourcemode', args)) {
      this.#triggerEvent('rejectviewchange');
      return false;
    }
    this.#setSourceContent(content);
    this.#adjustSourceLineNumbers();

    const elems = this.#elems;
    elems.btnSource.hidden = true;
    elems.btnEditor.hidden = false;
    elems.source.classList.remove(CLASSES.hidden);
    elems.editor.classList.add(CLASSES.hidden);
    elems.toolbar.disabled = true;
    elems.btnEditor.disabled = false;
    elems.textarea.focus();
    return this;
  }

  /**
   * Resize
   * @private
   * @returns {object} This API object for chaining
   */
  #resize() {
    if (this.view === 'source') {
      this.#adjustSourceLineNumbers();
    }
    return this;
  }

  /**
   * Set contenteditable
   * @private
   * @returns {object} This API object for chaining
   */
  #contenteditable() {
    const value = !this.disabled && !this.readonly;
    this.#elems?.editor?.setAttribute('contenteditable', value);
    return this;
  }

  /**
   * Set labels for editor and textarea
   * @private
   * @returns {object} This API object for chaining
   */
  #setLabels() {
    const labelEl = this.labelEl ?? this.#qs?.('#editor-label');
    const sourceLabel = this.#qs?.('[for="source-textarea"]');

    if (labelEl) labelEl.innerHTML = this.label;
    if (sourceLabel) sourceLabel.innerHTML = this.sourceTextareaLabel();
    return this;
  }

  /**
   * Set disabled hyperlinks and keep tab order in sync
   * @private
   * @returns {object} This API object for chaining
   */
  #disabledHyperlinks() {
    window.requestAnimationFrame(() => {
      if (this.disabled) {
        this.#elems?.editor?.querySelectorAll('a').forEach((a) => {
          const idx = a.getAttribute('tabindex');
          if (idx !== null) a.dataset.idsTabindex = idx;
          a.setAttribute('tabindex', '-1');
        });
      } else {
        this.#elems?.editor?.querySelectorAll('a').forEach((a) => {
          if (typeof a.dataset.idsTabindex === 'undefined') {
            a.removeAttribute('tabindex');
          } else {
            a.setAttribute('tabindex', a.dataset.idsTabindex);
            delete a.dataset.idsTabindex;
          }
        });
      }
    });
    return this;
  }

  /**
   * Set disabled state
   * @private
   * @returns {object} This API object for chaining
   */
  #setDisabled() {
    if (this.disabled) {
      this.container.setAttribute(attributes.DISABLED, '');
      this.#elems?.textarea?.setAttribute(attributes.DISABLED, '');
      this.labelEl?.setAttribute(attributes.DISABLED, '');
    } else {
      this.container.removeAttribute(attributes.DISABLED);
      this.#elems?.textarea?.removeAttribute(attributes.DISABLED);
      this.labelEl?.removeAttribute(attributes.DISABLED);
    }
    this.#contenteditable();
    this.#disabledHyperlinks();
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
    ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach((h) => {
      this.#actions[h] && (this.#actions[h].keyid = `Digit${h.replace('h', '')}|alt`);
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
        const cssText = 'border:0;padding:0;margin:0;height:0;width:0;visibility:hidden;';
        input.style.cssText = cssText;
        this.#elems[`${key}Input`] = input;
      }
    };
    setColorpicker('forecolor');
    setColorpicker('backcolor');

    // Set source/editor mode buttons
    let btnSource = this.querySelector('[editor-action="sourcemode"]');
    let btnEditor = this.querySelector('[editor-action="editormode"]');
    if (btnSource || btnEditor) {
      if (!btnEditor) {
        const template = document.createElement('template');
        template.innerHTML = `
          <ids-button editor-action="editormode" square="true" tooltip="View Visual">
            <span slot="text" class="audible">View Visual</span>
            <ids-icon slot="icon" icon="visual" width="50" viewbox="0 0 73 18"></ids-icon>
          </ids-button>`;
        btnSource.after(template.content.cloneNode(true));
        btnEditor = this.querySelector('[editor-action="editormode"]');
      }
      if (!btnSource) {
        const template = document.createElement('template');
        template.innerHTML = `
          <ids-button editor-action="sourcemode" square="true" tooltip="View Source">
            <span slot="text" class="audible">View Source</span>
            <ids-icon slot="icon" icon="html" width="38" viewbox="0 0 54 18"></ids-icon>
          </ids-button>`;
        btnEditor.after(template.content.cloneNode(true));
        btnSource = this.querySelector('[editor-action="sourcemode"]');
      }
      if (this.view === 'source') {
        btnSource.hidden = true;
        btnEditor.hidden = false;
      } else {
        btnSource.hidden = false;
        btnEditor.hidden = true;
      }
    }

    // Set to cache some elements
    this.#elems.main = this.#qs('.main-container');
    this.#elems.editor = this.#qs('.editor-container');
    this.#elems.source = this.#qs('.source-container');
    this.#elems.lineNumbers = this.#qs('.line-numbers');
    this.#elems.textarea = this.#qs('#source-textarea');
    this.#elems.toolbar = this.querySelector('ids-toolbar');
    this.#elems.btnSource = this.querySelector('[editor-action="sourcemode"]');
    this.#elems.btnEditor = this.querySelector('[editor-action="editormode"]');

    this.#elems.toolbarElms = this.querySelectorAll('[editor-action]');
    this.#elems.forecolorBtn = this.querySelector('[editor-action="forecolor"]');
    this.#elems.backcolorBtn = this.querySelector('[editor-action="backcolor"]');
    this.#elems.blockquoteBtn = this.querySelector('[editor-action="blockquote"]');
    this.#elems.hyperlinkBtn = this.querySelector('[editor-action="hyperlink"]');
    // Formatblock
    this.#elems.formatblock = { btn: this.querySelector('[editor-action="formatblock"]'), items: {} };
    this.#elems.formatblock.btn?.menuEl?.items?.forEach((item) => {
      const text = item.text || item.textContent?.trim();
      this.#elems.formatblock.items[item.value] = { text, value: item.value };
    });

    // Use for dirty-tracker and validation
    this.input = this.#elems.textarea;
    this.labelEl = this.#qs('#editor-label');
    if (this.validate) {
      this.validationEvents = 'change.editorvalidation input.editorvalidation blur.editorvalidation';
      this.validationElems = {
        main: this.#elems.main,
        editor: this.#elems.editor
      };
    }
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

    // Remove elements
    const removeElems = [
      this.#qs('#errormessage-modal'),
      this.#qs('#hyperlink-modal'),
      this.#qs('#insertimage-modal'),
    ];
    removeElems.forEach((elem) => elem?.remove());

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
        <ids-modal id="${key}-modal">
          <ids-text slot="title" font-size="24" type="h2" id="${key}-modal-title">Insert Anchor</ids-text>
          <ids-layout-grid class="data-grid-container" auto="true" gap="md" no-margins="true" min-col-width="300px">
            <ids-layout-grid-cell>
              <ids-input id="${key}-modal-input-url" label="Url" value="${url}" validate="required"></ids-input>
              ${clickableElemHtml}
              <ids-input id="${key}-modal-input-classes" label="Css Class" value="${classes}"></ids-input>
              ${targetDropdownHtml}
              <div id="${key}-modal-checkbox-remove-container" class="${CLASSES.hidden}">
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
        <ids-modal id="${key}-modal">
          <ids-text slot="title" font-size="24" type="h2" id="${key}-modal-title">Insert Image</ids-text>
          <ids-layout-grid class="data-grid-container" auto="true" gap="md" no-margins="true" min-col-width="300px">
            <ids-layout-grid-cell>
              <ids-input id="${key}-modal-input-src" label="Url" value="${url}" validate="required"></ids-input>
              <ids-input id="${key}-modal-input-alt" label="Alt text" value="${alt}"></ids-input>
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

    // Attach events to each modal
    ['errormessage', 'insertimage', 'hyperlink'].forEach((key) => {
      if (this.#modals[key]?.modal) {
        this.#attachModalEvents(key);
      }
    });

    return this;
  }

  /**
   * Paste as plain text.
   * @private
   * @param {Event} e The event
   * @returns {string|null} The updated pasted data
   */
  #pasteAsPlainText(e) {
    if (!e) return null;

    let paste;
    let html = '';
    if (e.clipboardData?.getData) {
      paste = e.clipboardData.getData('text/plain');
    } else {
      paste = window.clipboardData?.getData ? window.clipboardData.getData('Text') : false;
    }
    if (paste) {
      const paragraphs = paste.split(/[\r\n]/g);
      for (let i = 0, l = paragraphs.length; i < l; i++) {
        if (paragraphs[i] !== '') {
          if (navigator.userAgent.match(/firefox/i) && i === 0) {
            html += `<p>${this.#htmlEntities(paragraphs[i])}</p>`;
          } else if ((/\.(gif|jpg|jpeg|tiff|png)$/i).test(paragraphs[i])) {
            html += `<img src="${this.#htmlEntities(paragraphs[i])}" />`;
          } else {
            html += `<p>${this.#htmlEntities(paragraphs[i])}</p>`;
          }
        }
      }
    }
    return html;
  }

  /**
   * Paste as Html.
   * @private
   * @param {Event} e The event
   * @returns {string|null} The updated pasted data
   */
  #pasteAsHtml(e) {
    if (!e) return null;

    const clipboardData = e.clipboardData;
    let html;

    if (clipboardData?.types) {
      const types = clipboardData.types;
      if ((types instanceof DOMStringList && types.contains('text/html'))
        || (types.indexOf && types.indexOf('text/html') !== -1)) {
        html = e.clipboardData.getData('text/html');
      }
      if (types instanceof DOMStringList && types.contains('text/plain')) {
        html = e.clipboardData.getData('text/plain');
      }
      if ((typeof types === 'object' && types[0] === 'text/plain') && !types[1]) {
        html = e.clipboardData.getData('text/plain');
      }
    } else {
      const paste = window.clipboardData ? window.clipboardData.getData('Text') : '';
      const paragraphs = paste.split(/[\r\n]/g);
      html = '';
      for (let i = 0, l = paragraphs.length; i < l; i++) {
        if (paragraphs[i] !== '') {
          if (navigator.userAgent.match(/firefox/i) && i === 0) {
            html += `<p>${this.#htmlEntities(paragraphs[i])}</p>`;
          } else if ((/\.(gif|jpg|jpeg|tiff|png)$/i).test(paragraphs[i])) {
            html += `<img src="${this.#htmlEntities(paragraphs[i])}" />`;
          } else {
            html += `<p>${this.#htmlEntities(paragraphs[i])}</p>`;
          }
        }
      }
    }
    return this.#cleanHtml(html);
  }

  /**
   * Set toolbar buttons as un-active.
   * @private
   * @returns {void}
   */
  #unActiveToolbarButtons() {
    this.#elems.toolbarElms?.forEach((btn) => {
      if (btn) btn.cssClass = [];
    });
  }

  /**
   * On paste editor container.
   * @private
   * @param {Event} e The event
   * @returns {void}
   */
  #onPasteEditorContainer(e) {
    if (!e || this.view !== 'editor') return;

    e.preventDefault();
    const asPlainText = this.#pasteAsPlainText(e);
    const asHtml = this.#pasteAsHtml(e);
    const args = {
      asHtml,
      asPlainText,
      value: this.value,
      view: this.view
    };
    if (!this.triggerVetoableEvent('beforepaste', args)) {
      this.#triggerEvent('rejectpaste', this, args);
      return;
    }
    if (document.queryCommandSupported('insertText')) {
      document.execCommand('insertHTML', false, (this.pasteAsPlainText ? asPlainText : asHtml));
      debounce(() => this.#triggerEvent('afterpaste'), 410)();
    }
  }

  /**
   * On selection change.
   * @private
   * @returns {void}
   */
  #onSelectionChange() {
    const elems = this.#elems;
    const parents = this.#selectionParents();
    const setActive = (btn) => {
      if (btn) btn.cssClass = ['is-active'];
    };
    const regxFormatblock = new RegExp(`^(${Object.keys(elems.formatblock.items).join('|')})$`, 'i');
    const isEditor = elems?.editor === this.shadowRoot?.activeElement;
    this.#unActiveToolbarButtons();
    if (isEditor) {
      Object.entries(this.#actions).forEach(([k, v]) => {
        if (k === 'forecolor' && parents.font?.node?.hasAttribute('color')) {
          setActive(elems.forecolorBtn);
        }
        if (k === 'backcolor' && parents.span?.node?.style?.backgroundColor) {
          setActive(elems.backcolorBtn);
        }
        if (k === 'blockquote' && !!parents.blockquote) {
          setActive(elems.blockquoteBtn);
        }
        if (k === 'hyperlink' && !!parents.a) {
          setActive(elems.hyperlinkBtn);
        }
        if (elems.formatblock?.btn && regxFormatblock.test(k) && !!parents[k]) {
          elems.formatblock.btn.text = elems.formatblock.items[k].text;
        }
        if (document.queryCommandState(v.action)) {
          setActive(this.querySelector(`[editor-action="${k}"]`));
        }
      });
    }
  }

  /**
   * On toolbar items selected.
   * @private
   * @param {Event} e The event
   * @returns {void}
   */
  #onSelectedToolbar(e) {
    if (!e?.detail?.elem) return;

    const elem = e.detail.elem;
    let target = null;

    if (/^ids-menu-item$/i.test(elem.nodeName)) target = elem.menu?.target;
    if (/^ids-button$/i.test(elem.nodeName)) target = elem;

    const action = target?.getAttribute('editor-action');
    if (this.#actions[action]) {
      let value = null;
      if (action === 'formatblock') {
        const menuBtn = elem.menu?.target;
        if (menuBtn) menuBtn.text = elem.text || elem.textContent?.trim();
        value = e.detail.value;
      }

      if (/^(hyperlink|insertimage)$/i.test(action)) {
        this.#modals[action]?.modal?.show();
      } else {
        this.#handleAction(action, value);
      }
      this.#triggerEvent('input', this.#elems.editor);
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
      elems.removeContainer?.classList[opt](CLASSES.hidden);
      if (elems.url) {
        elems.url.value = args.url;
        elems.url.checkValidation();
      }
      if (elems.classes) elems.classes.value = args.classes;
      if (elems.targets) elems.targets.value = args.targetSelected?.value ?? '';
      if (elems.clickable) elems.clickable.checked = args.isClickable;
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
    if (a === {}) return;

    const sel = this.#getSelection();

    // Set format block
    if (a.action === 'formatBlock') {
      const blockAction = val ?? a.value;
      a = { ...this.#actions[blockAction] };

      if (a.value === 'blockquote' && this.#blockElem().tagName === 'blockquote') {
        a = { ...this.#actions[this.#paragraphSeparator] };
      }
      this.#selectionBlockElems().forEach((elem) => {
        const regx = new RegExp(`<(/?)${elem.tagName}((?:[^>"']|"[^"]*"|'[^']*')*)>`, 'gi');
        const html = elem.outerHTML.replace(regx, `<$1${a.value}$2>`);
        elem.outerHTML = html;
      });
      return;
    }

    // Set text align
    if (/^(alignleft|alignright|aligncenter|alignjustify)$/i.test(action)) {
      const alignDoc = this.locale?.isRTL() ? 'right' : 'left';
      const align = action.replace('align', '');
      this.#selectionBlockElems().forEach((elem) => {
        align === alignDoc
          ? elem?.removeAttribute('style')
          : elem?.style.setProperty('text-align', align);
      });
      return;
    }

    // Set forecolor, backcolor
    if (/^(forecolor|backcolor)$/i.test(action)) {
      this.#savedSelection = this.#saveSelection();
      if (this.#savedSelection && this.#elems[`${action}Input`]) {
        const color = action === 'backcolor'
          ? sel?.focusNode?.parentNode?.style?.getProperty?.('background-color')
          : document.queryCommandValue(a.action);
        this.#elems[`${action}Input`].value = /rgb/i.test(color) ? this.#rgbToHex(color) : color;
        this.#elems[`${action}Input`].click();
      }
      return;
    }

    // Set ordered list, unordered list
    if (/^(orderedlist|unorderedlist)$/i.test(action)) {
      let isAdd = true;
      this.#selectionBlockElems().forEach((elem) => {
        if (elem.innerHTML.includes(action === 'orderedlist' ? '<ol>' : '<ul>')) {
          isAdd = false;
        }
        elem.innerHTML = elem.innerHTML
          .replaceAll('</ul>', '')
          .replaceAll('</ol>', '')
          .replaceAll('</li>', '')
          .replaceAll('<ul>', '')
          .replaceAll('<ol>', '')
          .replaceAll('<li>', '');
      });

      if (isAdd) {
        document.execCommand(a.action, false, a.value);
      }
      return;
    }

    // Switch editor/source mode
    if (/^(editormode|sourcemode)$/i.test(action)) {
      this.view = action.replace(/mode/i, '');
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
    const sel = this.#getSelection();
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
        if (elems.url?.value) {
          a.value = 'EDITOR_CREATED_NEW_HYPERLINK';
          document.execCommand(a.action, false, a.value);
          const aLink = this.#qs(`a[href="${a.value}"`);
          aLink.setAttribute('href', elems.url.value);
          aLink.innerHTML = aLink.innerHTML.replace(a.value, elems.url.value);
          if (elems.classes?.value !== '') {
            aLink.setAttribute('class', elems.classes.value);
          }
          if (elems.targets?.value !== '') {
            aLink.setAttribute('target', elems.targets.value);
          }
          if (elems.clickable?.checked) {
            aLink.setAttribute('contenteditable', 'false');
          }
        }
      } else if (elems.removeElem?.checked || elems.url?.value === '') {
        // Remove the current hyperlink, selection was on hyperlink
        currentLink.outerHTML = currentLink.innerHTML;
      } else {
        // Update the current hyperlink, selection was on hyperlink
        const attr = (name, value) => {
          if (value !== '') {
            currentLink?.setAttribute(name, value);
          } else {
            currentLink?.removeAttribute(name);
          }
        };
        attr('href', elems.url?.value);
        attr('class', elems.classes?.value);
        attr('target', elems.targets?.value);
        attr('contenteditable', elems.clickable?.checked ? 'false' : '');
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
    this.onEvent('languagechange.editor', this.closest('ids-container'), async () => {
      // TODO: DO something changing language ?
    });

    // Attach selection change
    this.onEvent('selectionchange.editor', document, debounce(() => {
      this.#onSelectionChange();
    }, 400));

    // Attach toolbar events
    this.onEvent('selected.editor-toolbar', this.#elems.toolbar, (e) => {
      this.#onSelectedToolbar(e);
    });
    this.onEvent('input.editor-toolbar', this.#elems.toolbar, (e) => {
      this.#onInputToolbar(e);
    });
    this.onEvent('focusin.editor-toolbar', this.#elems.toolbar, () => {
      this.#unActiveToolbarButtons();
    });

    // Editor container
    this.onEvent('input.editor-editcontainer', this.#elems.editor, debounce(() => {
      if (!this.#elems.reqviewchange) {
        this.#setSourceContent();
        this.#triggerEvent('change', this.#elems.textarea);
      }
    }, 400));
    this.onEvent('blur.editor-editcontainer', this.#elems.editor, () => {
      this.#triggerEvent('blur', this.#elems.textarea);
    });
    this.onEvent('paste.editor-editcontainer', this.#elems.editor, (e) => {
      this.#onPasteEditorContainer(e);
    });

    // Textarea
    this.onEvent('input.editor-textarea', this.#elems.textarea, () => {
      this.#adjustSourceLineNumbers();
      debounce(() => {
        if (!this.#elems.reqviewchange) this.#triggerEvent('change', this.#elems.textarea);
      }, 400)();
    });
    this.onEvent('change.editor-textarea', this.#elems.textarea, () => {
      this.#triggerEvent('change');
    });

    // Other events
    this.#attachSlotchangeEvent();
    this.#attachKeyboardEvents();

    // Set observer for resize
    this.#resizeObserver.disconnect();
    this.#resizeObserver.observe(this.container);

    // EPC: @TODO replace this with the setting from infor-design/enterprise-wc#488
    const moreActions = this.querySelector('ids-toolbar-more-actions');
    this.onEvent('beforeshow.more-actions', moreActions, () => {
      const currentWidth = moreActions.menu.popup.container.style.width;
      if (!currentWidth) {
        moreActions.menu.popup.container.style.width = '175px';
      }
    });

    // Remove flags
    this.onEvent('viewchange.editor-reqviewchange', this, debounce(() => {
      delete this.#elems.reqviewchange;
    }, 410));
    this.onEvent('rejectviewchange.editor-reqviewchange', this, debounce(() => {
      delete this.#elems.reqviewchange;
    }, 410));
    this.onEvent('initialize.editor-initialize', this, debounce(() => {
      delete this.reqInitialize;
    }, 410));

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

    // Before modal open
    this.offEvent(`beforeshow.editor-modal-${key}`, modal);
    this.onEvent(`beforeshow.editor-modal-${key}`, modal, (e) => {
      if (!this.#onBeforeShowModal(key) && key !== 'errormessage') {
        e.detail.response(false);
        this.#modals.errormessage?.modal?.show();
      }
    });

    // Apply button clicked
    this.offEvent(`click.editor-modal-${key}`, modal);
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
      this.offEvent(`change.editor-modal-${key}-checkbox-remove`, removeElem);
      this.onEvent(`change.editor-modal-${key}-checkbox-remove`, removeElem, (e) => {
        elemsToDisable.forEach((elem) => {
          elem && (elem.disabled = e.detail.checked);
        });
      });
    }
  }

  /**
   * Attach slotchange events
   * @private
   * @returns {object} This API object for chaining
   */
  #attachSlotchangeEvent() {
    const html = (slot) => slot?.assignedNodes()[0]?.innerHTML ?? '';
    const contentSlot = this.#qs('slot[name="content"]');
    this.onEvent('slotchange.editor-content', contentSlot, () => {
      this.#setEditorContent(html(contentSlot) ?? '');
      if (!this.reqInitialize) this.#triggerEvent('input', this.#elems.editor);
    });
    return this;
  }

  /**
   * Attach Keyboard events
   * @private
   * @returns {object} This API object for chaining
   */
  #attachKeyboardEvents() {
    const hasKey = (action, key) => (new RegExp(key, 'i')).test(action[1].keyid);
    const getKey = (action) => action[1].keyid.replace(/\|.*$/g, '');
    const actions = Object.entries(this.#actions).filter(([, v]) => v.keyid);
    const keys = [...new Set(actions.map((action) => getKey(action)))];
    const mapped = {};
    keys.forEach((key) => {
      mapped[key] = actions.filter((action) => getKey(action) === key);
    });

    this.onEvent('keydown.editor-container', this.container, (e) => {
      if (this.disabled || this.readonly) {
        return;
      }
      const key = e.code;
      if (keys.indexOf(key) > -1 && (e.ctrlKey || e.metaKey)) {
        const action = mapped[key]?.filter((a) => (
          e.shiftKey === hasKey(a, 'shift') && e.altKey === hasKey(a, 'alt')
        )).flat();

        if (action?.length) {
          if (this.view === 'source' && action[0] !== 'editormode') {
            return;
          }
          if (['hyperlink', 'insertimage'].includes(action[0])) {
            this.#modals[action[0]]?.modal?.show();
          } else {
            this.#handleAction(action[0]);
            this.#triggerEvent('input', this.#elems.editor);
          }
          e.preventDefault();
        }
      }
    });
    return this;
  }

  /**
   * Get editor current value
   * @returns {string} The current value
   */
  get value() {
    return this.#trimContent?.(this.#elems.textarea.value);
  }

  /**
   * Sets the editor to disabled
   * @param {boolean|string} value If true will set disabled
   */
  set disabled(value) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.DISABLED, '');
    } else {
      this.removeAttribute(attributes.DISABLED);
    }
    this.#setDisabled?.();
  }

  get disabled() {
    const value = this.getAttribute(attributes.DISABLED);
    return value !== null ? stringToBool(value) : EDITOR_DEFAULTS.disabled;
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
    this.#setLabels?.();
  }

  get label() {
    return this.getAttribute(attributes.LABEL) || EDITOR_DEFAULTS.label;
  }

  /**
   * Set the label to be hidden or shown
   * @param {boolean|string} value The value
   */
  set labelHidden(value) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.LABEL_HIDDEN, '');
      this.labelEl?.setAttribute(attributes.AUDIBLE, '');
    } else {
      this.removeAttribute(attributes.LABEL_HIDDEN);
      this.labelEl?.removeAttribute(attributes.AUDIBLE);
    }
  }

  get labelHidden() {
    const value = this.getAttribute(attributes.LABEL_HIDDEN);
    return value !== null ? stringToBool(value) : EDITOR_DEFAULTS.labelHidden;
  }

  /**
   * Set required indicator (red '*') to be hidden or shown
   * @param {boolean|string} value The value
   */
  set labelRequired(value) {
    const isValid = typeof value !== 'undefined' && value !== null;
    const val = isValid ? stringToBool(value) : EDITOR_DEFAULTS.labelRequired;
    if (isValid) {
      this.setAttribute(attributes.LABEL_REQUIRED, val);
    } else {
      this.removeAttribute(attributes.LABEL_REQUIRED);
    }
    this.labelEl?.classList[!val ? 'add' : 'remove'](CLASSES.labelRequired);
  }

  get labelRequired() {
    const value = this.getAttribute(attributes.LABEL_REQUIRED);
    return value !== null ? stringToBool(value) : EDITOR_DEFAULTS.labelRequired;
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
    this.#setParagraphSeparator?.();
  }

  get paragraphSeparator() {
    return this.getAttribute(attributes.PARAGRAPH_SEPARATOR) || EDITOR_DEFAULTS.paragraphSeparator;
  }

  /**
   * Sets to be paste as plain text for editor
   * @param {boolean|string} value The value
   */
  set pasteAsPlainText(value) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.PASTE_AS_PLAIN_TEXT, '');
    } else {
      this.removeAttribute(attributes.PASTE_AS_PLAIN_TEXT);
    }
  }

  get pasteAsPlainText() {
    const value = this.getAttribute(attributes.PASTE_AS_PLAIN_TEXT);
    return value !== null ? stringToBool(value) : EDITOR_DEFAULTS.pasteAsPlainText;
  }

  /**
   * Set the placeholder text for editor
   * @param {string} value The placeholder value
   */
  set placeholder(value) {
    if (value) {
      this.setAttribute(attributes.PLACEHOLDER, value);
      this.#elems?.editor?.setAttribute(attributes.PLACEHOLDER, value);
      this.#elems?.textarea?.setAttribute(attributes.PLACEHOLDER, value);
    } else {
      this.removeAttribute(attributes.PLACEHOLDER);
      this.#elems?.editor?.removeAttribute(attributes.PLACEHOLDER);
      this.#elems?.textarea?.removeAttribute(attributes.PLACEHOLDER);
    }
  }

  get placeholder() { return this.getAttribute(attributes.PLACEHOLDER); }

  /**
   * Sets the editor to readonly
   * @param {boolean|string} value If true will set readonly
   */
  set readonly(value) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.READONLY, '');
      this.container.setAttribute(attributes.READONLY, '');
      this.#elems?.textarea?.setAttribute(attributes.READONLY, '');
      this.labelEl?.setAttribute(attributes.READONLY, '');
    } else {
      this.removeAttribute(attributes.READONLY);
      this.container.removeAttribute(attributes.READONLY);
      this.#elems?.textarea?.removeAttribute(attributes.READONLY);
      this.labelEl?.removeAttribute(attributes.READONLY);
    }
    this.#contenteditable?.();
  }

  get readonly() {
    const value = this.getAttribute(attributes.READONLY);
    return value !== null ? stringToBool(value) : EDITOR_DEFAULTS.readonly;
  }

  /**
   * Sets to be use source formatter for editor
   * @param {boolean|string} value The value
   */
  set sourceFormatter(value) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.SOURCE_FORMATTER, '');
    } else {
      this.removeAttribute(attributes.SOURCE_FORMATTER);
    }
  }

  get sourceFormatter() {
    const value = this.getAttribute(attributes.SOURCE_FORMATTER);
    return value !== null ? stringToBool(value) : EDITOR_DEFAULTS.sourceFormatter;
  }

  /**
   * Set the view mode for editor
   * @param {string} value The value: 'editor', 'source'
   */
  set view(value) {
    if (VIEWS.indexOf(value) > -1) {
      const attr = this.getAttribute(attributes.VIEW);
      let veto = null;
      if (this.view !== value) veto = /source/i.test(value) ? this.#sourceMode() : this.#editorMode();
      if (veto || (veto === null && attr !== value)) this.setAttribute(attributes.VIEW, value);
      if (veto) {
        this.#triggerEvent(`after${value}mode`);
        this.#triggerEvent('viewchange', this, { view: value });
      }
    } else {
      this.removeAttribute(attributes.VIEW);
    }
  }

  get view() {
    return this.getAttribute(attributes.VIEW) || EDITOR_DEFAULTS.view;
  }
}
