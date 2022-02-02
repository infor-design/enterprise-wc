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
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import { isObject } from '../../utils/ids-object-utils/ids-object-utils';

import {
  VIEWS,
  PARAGRAPH_SEPARATORS,
  BLOCK_ELEMENTS,
  FONT_SIZES,
  CLASSES,
  EDITOR_DEFAULTS,
  EDITOR_ATTRIBUTES,
  qs,
  qsAll,
  rgbToHex
} from './ids-editor-shared';

import {
  cleanHtml,
  trimContent
} from './ids-editor-clean-utils';

import {
  blockElem,
  selectionBlockElems,
  saveSelection,
  restoreSelection,
  selectionParents,
  findElementInSelection
} from './ids-editor-selection-utils';

import {
  parseTemplate,
  editorTemplate,
  btnEditorModeTemplate,
  btnSourceModeTemplate,
  toolbarTemplate,
  errorMessageTemplate,
  hyperlinkModalTemplate,
  insertimageModalTemplate
} from './ids-editor-templates';

import {
  handlePasteAsPlainText,
  handlePasteAsHtml
} from './ids-editor-handle-paste';

import { formatHtml } from './ids-editor-formatters';

import styles from './ids-editor.scss';

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
      ...qsAll('#errormessage-modal, #hyperlink-modal, #insertimage-modal', this.shadowRoot),
      ...qsAll(
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
    return [...super.attributes, ...EDITOR_ATTRIBUTES];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    this.reqInitialize = true;
    instanceCounter++;

    return parseTemplate(editorTemplate, {
      disabled: this.disabled ? ' disabled' : '',
      readonly: this.readonly ? ' readonly' : '',
      contenteditable: !this.disabled && !this.readonly ? ' contenteditable="true"' : '',
      labelClass: `editor-label${!this.labelRequired ? ` ${CLASSES.labelRequired}` : ''}`,
      labelHidden: this.labelHidden ? ' audible' : '',
      placeholder: this.placeholder ? ` placeholder="${this.placeholder}"` : '',
      hiddenClass: CLASSES.hidden,
      labelText: this.label,
      sourceTextareaLabel: this.sourceTextareaLabel()
    });
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
      this.resetDirtyTracker();
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
    const slot = this.querySelector('[slot="toolbar"]');
    if (!slot) {
      this.insertAdjacentHTML('afterbegin', parseTemplate(toolbarTemplate, { instanceCounter }));
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
      let l;

      if (!this.#elems.lineNumberCount || lineNumberCount !== this.#elems.lineNumberCount) {
        if (!this.#elems.lineNumberCount) {
          // Build the list of line numbers from scratch
          this.#elems.lineNumberCount = lineNumberCount;
          for (l = this.#elems.lineNumberCount; i < l; i++) {
            list += `<li role="presentation"><span>${(i + 1)}</span></li>`;
          }
          numberList.insertAdjacentHTML('beforeend', list);
        } else if (this.#elems.lineNumberCount < lineNumberCount) {
          // Add extra line numbers to the bottom
          for (l = (lineNumberCount - this.#elems.lineNumberCount); i < l; i++) {
            list += `<li role="presentation"><span>${(lastIdx + i + 1)}</span></li>`;
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
   * Set editor content value
   * @private
   * @param {string} content The html
   * @returns {object} This API object for chaining
   */
  #setEditorContent(content) {
    const { editor, textarea } = this.#elems;
    let html = trimContent(content || textarea.value);
    html = cleanHtml(html);
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
    let value = trimContent(content || editor.innerHTML);
    value = this.sourceFormatter ? formatHtml(value) : value;
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
    const labelEl = this.labelEl ?? qs('#editor-label', this.shadowRoot);
    const sourceLabel = qs('[for="source-textarea"]', this.shadowRoot);

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
        template.innerHTML = btnEditorModeTemplate;
        btnSource.after(template.content.cloneNode(true));
        btnEditor = this.querySelector('[editor-action="editormode"]');
      }
      if (!btnSource) {
        const template = document.createElement('template');
        template.innerHTML = btnSourceModeTemplate;
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
    this.#elems.main = qs('.main-container', this.shadowRoot);
    this.#elems.editor = qs('.editor-container', this.shadowRoot);
    this.#elems.source = qs('.source-container', this.shadowRoot);
    this.#elems.lineNumbers = qs('.line-numbers', this.shadowRoot);
    this.#elems.textarea = qs('#source-textarea', this.shadowRoot);
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
    this.labelEl = qs('#editor-label', this.shadowRoot);
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
      this.#modals[key] = { btn, modal: qs(`#${key}-modal`, this.shadowRoot) };
    };
    const hyperlinkBtn = this.querySelector('[editor-action="hyperlink"]');
    const insertimageBtn = this.querySelector('[editor-action="insertimage"]');

    // Remove elements
    const removeElems = [
      qs('#errormessage-modal', this.shadowRoot),
      qs('#hyperlink-modal', this.shadowRoot),
      qs('#insertimage-modal', this.shadowRoot),
    ];
    removeElems.forEach((elem) => elem?.remove());

    // Error message
    appendModal('errormessage', null, errorMessageTemplate);
    this.#modals.errormessage.btn = qs('#errormessage-modal-ok', this.shadowRoot);

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
      const html = parseTemplate(hyperlinkModalTemplate, {
        key,
        url,
        clickableElemHtml,
        classes,
        targetDropdownHtml,
        hiddenClass: CLASSES.hidden
      });
      appendModal(key, btn, html);
      this.#modals[key].elems = {
        url: qs(`#${key}-modal-input-url`, this.shadowRoot),
        clickable: qs(`#${key}-modal-checkbox-clickable`, this.shadowRoot),
        classes: qs(`#${key}-modal-input-classes`, this.shadowRoot),
        targets: qs(`#${key}-modal-dropdown-targets`, this.shadowRoot),
        removeContainer: qs(`#${key}-modal-checkbox-remove-container`, this.shadowRoot),
        removeElem: qs(`#${key}-modal-checkbox-remove`, this.shadowRoot)
      };
    }

    // Insert Image
    if (insertimageBtn) {
      const key = 'insertimage';
      const btn = insertimageBtn;
      const { url, alt } = this.#modals.defaults.insertimage;
      const html = parseTemplate(insertimageModalTemplate, { key, url, alt });
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
    const asPlainText = handlePasteAsPlainText(e);
    const asHtml = handlePasteAsHtml(e);
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
    const sel = this.#getSelection();
    const elems = this.#elems;
    const parents = selectionParents(sel, elems.editor);
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
    const sel = this.#getSelection();
    this.#savedSelection = saveSelection(sel);
    if (!this.#savedSelection) return false;

    // Rest all values;
    this.#modals.beforeShowValues = {};

    if (key === 'hyperlink') {
      const args = { ...this.#modals.defaults.hyperlink, hideRemoveContainer: true };
      const elems = { ...this.#modals.hyperlink.elems };
      const currentLink = findElementInSelection(sel, this.#elems.editor, 'a');
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

      if (a.value === 'blockquote' && blockElem(sel).tagName === 'blockquote') {
        a = { ...this.#actions[this.#paragraphSeparator] };
      }
      selectionBlockElems(sel, this.#elems.editor).forEach((elem) => {
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
      selectionBlockElems(sel, this.#elems.editor).forEach((elem) => {
        align === alignDoc
          ? elem?.removeAttribute('style')
          : elem?.style.setProperty('text-align', align);
      });
      return;
    }

    // Set forecolor, backcolor
    if (/^(forecolor|backcolor)$/i.test(action)) {
      this.#savedSelection = saveSelection(sel);
      if (this.#savedSelection && this.#elems[`${action}Input`]) {
        const color = action === 'backcolor'
          ? sel?.focusNode?.parentNode?.style?.getProperty?.('background-color')
          : document.queryCommandValue(a.action);
        this.#elems[`${action}Input`].value = /rgb/i.test(color) ? rgbToHex(color) : color;
        this.#elems[`${action}Input`].click();
      }
      return;
    }

    // Set ordered list, unordered list
    if (/^(orderedlist|unorderedlist)$/i.test(action)) {
      let isAdd = true;
      selectionBlockElems(sel, this.#elems.editor).forEach((elem) => {
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

    restoreSelection(this.#getSelection(), this.#savedSelection);
    const sel = this.#getSelection();
    const range = sel.getRangeAt(0);

    // Insert image
    if (key === 'insertimage') {
      a.value = qs(`#${key}-modal-input-src`, this.shadowRoot).value ?? '';
      if (a.value !== '') {
        if (sel.type === 'Caret') {
          range.insertNode(document.createTextNode(' '));
          sel.removeAllRanges();
          sel.addRange(range);
        }
        const alt = qs(`#${key}-modal-input-alt`, this.shadowRoot).value ?? '';
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
          const aLink = qs(`a[href="${a.value}"`, this.shadowRoot);
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
    this.onEvent('slotchange.editor-content', this.container, (e) => {
      const slot = e.target;
      if (slot?.name === '') {
        const html = slot.assignedElements().map((el) => el.outerHTML).join('');
        this.#setEditorContent(html);
        if (!this.reqInitialize) this.#triggerEvent('input', this.#elems.editor);
      }
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
    return trimContent?.(this.#elems.textarea.value);
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
