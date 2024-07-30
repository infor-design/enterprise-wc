import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';

import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsLabelStateMixin from '../../mixins/ids-label-state-mixin/ids-label-state-mixin';
import IdsDirtyTrackerMixin from '../../mixins/ids-dirty-tracker-mixin/ids-dirty-tracker-mixin';
import IdsValidationMixin from '../../mixins/ids-validation-mixin/ids-validation-mixin';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsElement from '../../core/ids-element';
import '../ids-button/ids-button';
import '../ids-text/ids-text';
import '../ids-checkbox/ids-checkbox';
import '../ids-dropdown/ids-dropdown';
import '../ids-input/ids-input';
import '../ids-message/ids-message';
import '../ids-modal/ids-modal';
import '../ids-toolbar/ids-toolbar';

import debounce from '../../utils/ids-debounce-utils/ids-debounce-utils';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import { isObject } from '../../utils/ids-object-utils/ids-object-utils';

import type IdsButton from '../ids-button/ids-button';
import type IdsToolbarMoreActions from '../ids-toolbar/ids-toolbar-more-actions';
import type IdsText from '../ids-text/ids-text';

import {
  VIEWS,
  PARAGRAPH_SEPARATORS,
  EditorAction,
  CLASSES,
  EDITOR_DEFAULTS,
  EDITOR_ATTRIBUTES,
  qs,
  qsAll,
  rgbToHex,
  FONT_SIZE_ACTIONS,
  TEXT_FORMAT_ACTIONS
} from './ids-editor-shared';

import {
  cleanHtml,
  trimContent
} from './ids-editor-clean-utils';

import {
  blockElem,
  saveSelection,
  restoreSelection,
  selectionBlockElems,
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

import formatHtml from './ids-editor-formatters';

import styles from './ids-editor.scss';
import type IdsIcon from '../ids-icon/ids-icon';

export interface IdsEditorModals {
  /** The hyperlink options */
  hyperlink: {
    /** Url for hyperlink */
    url: string;
    /** Css Class for hyperlink */
    classes: string;
    /** List target options for hyperlink */
    targets: Array<{ text: string, value: string, selected?: boolean }>;
    /** If true, isClickable checkbox should checked */
    isClickable: boolean;
    /** If true, will show isClickable checkbox */
    showIsClickable: boolean;
  };
  /** The insertimage options */
  insertimage: {
    /** Url for insertimage */
    url: string;
    /** Alt text for insertimage */
    alt: string;
  };
}

// Instance counter
let instanceCounter = 0;

const Base = IdsValidationMixin(
  IdsLabelStateMixin(
    IdsDirtyTrackerMixin(
      IdsLocaleMixin(
        IdsEventsMixin(
          IdsElement
        )
      )
    )
  )
);

/**
 * IDS Editor Component
 * @type {IdsEditor}
 * @inherits IdsElement
 * @mixes IdsDirtyTrackerMixin
 * @mixes IdsEventsMixin
 * @mixes IdsLabelStateMixin
 * @mixes IdsLocaleMixin
 * @mixes IdsValidationMixin
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

  validationElems?: Record<string, any>;

  reqInitialize?: boolean;

  isFormComponent = true;

  #resizeObserver = new ResizeObserver(() => this.#resize());

  /**
   * Modals attached to editor.
   * @private
   */
  #modals: any = {};

  /**
   * Current paragraph separator.
   * @private
   */
  #paragraphSeparator?: string;

  /**
   * Saved current selection ranges.
   * @private
   */
  #savedSelection: Array<Range> | null = null;

  /**
   * Cache elements use most.
   * @private
   */
  #elems: any = {};

  input?: any;

  labelEl?: IdsText | null;

  #editorTextContainer: HTMLElement | null = null;

  /**
   * List of actions can be execute with editor.
   * extra actions get added in `#initContent()`
   * @private
   */
  #actions: Record<string, EditorAction> = {
    // STYLES
    bold: { action: 'bold', keyid: 'KeyB' },
    italic: { action: 'italic', keyid: 'KeyI' },
    underline: { action: 'underline', keyid: 'KeyU' },
    strikethrough: { action: 'strikeThrough', keyid: 'KeyS|shift' },

    // SCRIPTS
    superscript: { action: 'superscript', keyid: 'Equal|shift' },
    subscript: { action: 'subscript', keyid: 'Equal' },

    // TEXT FORMATS
    formatblock: { action: 'formatBlock' },
    ...TEXT_FORMAT_ACTIONS,

    // FONT SIZE
    fontsize: { action: 'fontSize' },
    ...FONT_SIZE_ACTIONS,

    // COLORS
    forecolor: { action: 'forecolor', keyid: 'KeyK|shift|alt' },
    backcolor: { action: 'backcolor' },

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
    alignleft: { action: 'alignLeft', keyid: 'KeyL' },
    alignright: { action: 'alignRight', keyid: 'KeyR' },
    aligncenter: { action: 'alignCenter', keyid: 'KeyE' },
    alignjustify: { action: 'alignJustify', keyid: 'KeyJ' },

    // CLEAR FORMATTING
    clearformatting: { action: 'removeFormat', keyid: 'Space|shift' },

    // HISTORY
    redo: { action: 'redo', keyid: 'KeyY' },
    undo: { action: 'undo', keyid: 'KeyZ' },

    // EXTRA
    editormode: { action: 'editorMode', keyid: 'Backquote|shift' },
    sourcemode: { action: 'sourceMode', keyid: 'Backquote' }
  };

  vetoableEventTypes = [
    'beforesourcemode',
    'beforeeditormode',
    'beforepaste'
  ];

  /**
   * Invoked each time the custom element is appended into a document-connected element.
   */
  connectedCallback(): void {
    super.connectedCallback();
    this.#contenteditable();
    this.#initToolbar();
    this.#initContent();
    this.modalElementsValue();
    this.#setParagraphSeparator();
    this.#attachEventHandlers();
    this.#initView();
  }

  disconnectedCallback() {
    super.disconnectedCallback?.();

    // Cleanup marking that might still be present
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
        (this as any)
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
  template(): string {
    this.reqInitialize = true;
    instanceCounter++;

    const ariaLabel = this.hasAttribute(attributes.LABEL_STATE) && this.label ? `aria-label="${this.label}"` : '';
    const hiddenLabelCss = !this.label.length || this.labelState === 'hidden' ? ' empty' : '';
    const requiredLabelCss = !this.labelRequired ? ` ${CLASSES.labelRequired}` : '';

    return parseTemplate(editorTemplate, {
      ariaLabel,
      disabled: this.disabled ? ' disabled' : '',
      readonly: this.readonly ? ' readonly' : '',
      contenteditable: !this.disabled && !this.readonly ? ' contenteditable="true"' : '',
      labelClass: `editor-label`,
      requiredLabelCss,
      hiddenLabelCss,
      placeholder: this.placeholder ? ` placeholder="${this.placeholder}"` : '',
      hiddenClass: CLASSES.hidden,
      labelText: this.label,
      sourceTextareaLabel: this.sourceTextareaLabel()
    });
  }

  /**
   * Set default value to each element in modals.
   * @param {object} [modals] Incoming modals options.
   * @param {object} [modals.hyperlink] The hyperlink options.
   * @param {string} [modals.hyperlink.url] Url for hyperlink.
   * @param {string} [modals.hyperlink.classes] Css Class for hyperlink.
   * @param {Array<object>} [modals.hyperlink.targets] List target options for hyperlink.
   * @param {boolean} [modals.hyperlink.isClickable] If true, isClickable checkbox should checked.
   * @param {boolean} [modals.hyperlink.showIsClickable] If true, will show isClickable checkbox.
   * @param {object} [modals.insertimage] The insertimage options.
   * @param {string} [modals.insertimage.url] Url for insertimage.
   * @param {string} [modals.insertimage.alt] Alt text for insertimage.
   * @returns {object} This API object for chaining
   */
  modalElementsValue(modals?: IdsEditorModals): object {
    const m = (isObject(modals) ? modals : {}) as IdsEditorModals;
    const d = EDITOR_DEFAULTS.modals;

    // Set hyperlink targets
    let hyperlinkTargets: Array<object> = [];
    if (m.hyperlink?.targets?.constructor === Array) {
      m.hyperlink.targets.forEach((target) => {
        if (isObject(target) && target.text) {
          const args: any = { text: target.text, value: target.value };
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
        targetSelected: hyperlinkTargets.find((t: any) => t.selected),
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
  sourceTextareaLabel(): string {
    return `${this.label} - HTML Source View`;
  }

  /**
   * Trigger the given event with current value.
   * @private
   * @param {string} eventtName The event name to be trigger.
   * @param {object|HTMLElement} target The target element.
   * @param {object} extra Extra data.
   * @returns {object} This API object for chaining.
   */
  #triggerEvent(eventtName: string, target: object | HTMLElement = this, extra: object = {}): object {
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
  #initView(): object {
    const shouldChange = this.#elems[this.view]?.classList?.contains(CLASSES.hidden);
    if (shouldChange) {
      if (/source/i.test(this.view)) this.#sourceMode();
      else this.#editorMode();
    }

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
  #initToolbar(): object {
    const slot = this.querySelector('[slot="toolbar"]');
    if (!slot) {
      this.insertAdjacentHTML('afterbegin', parseTemplate(toolbarTemplate, { instanceCounter }));
    }
    return this;
  }

  /**
   * Get current selection
   * @private
   * @returns {Selection|null} The selection
   */
  #getSelection(): Selection | null {
    return document.getSelection();
  }

  /**
   * Set default paragraph separator
   * @private
   * @returns {object} This API object for chaining
   */
  #setParagraphSeparator(): object {
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
  #adjustSourceLineNumbers(): void {
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
   * Copies content from textarea to editor
   */
  #setEditorContent() {
    const { textarea } = this.#elems;
    let html = trimContent(textarea.value);
    html = cleanHtml(html);
    if (this.#editorTextContainer && this.#editorTextContainer.innerHTML !== html) {
      this.#editorTextContainer.innerHTML = html;
    }
  }

  /**
   * Copies editor content to textarea
   */
  #setSourceContent(): void {
    const { textarea } = this.#elems;

    // if empty
    if (this.#editorTextContainer?.textContent?.replace('\n', '') === '') {
      this.#editorTextContainer.innerHTML = '';
    }

    let htmlContent = trimContent(this.#editorTextContainer?.innerHTML ?? '');
    htmlContent = this.sourceFormatter ? formatHtml(htmlContent) : htmlContent;
    if (textarea.value !== htmlContent) {
      textarea.value = htmlContent;
    }
  }

  /**
   * Switch to editor mode
   * @returns {object|boolean} This API object for chaining, false if veto
   */
  #editorMode(): object | boolean {
    this.#elems.reqviewchange = true;

    // Fire the vetoable event.
    const args = { value: this.value, view: this.view };
    if (!this.triggerVetoableEvent('beforeeditormode', args)) {
      this.#triggerEvent('rejectviewchange');
      return false;
    }
    this.#setEditorContent();
    this.#toggleContentStyles(true);
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
   * @returns {object|boolean} This API object for chaining, false if veto
   */
  #sourceMode(): object | boolean {
    this.#elems.reqviewchange = true;

    // Fire the vetoable event.
    const args = { value: this.value, view: this.view };
    if (!this.triggerVetoableEvent('beforesourcemode', args)) {
      this.#triggerEvent('rejectviewchange');
      return false;
    }

    this.#toggleContentStyles(false);
    this.#setSourceContent();
    this.#adjustSourceLineNumbers();

    const elems = this.#elems;
    elems.btnSource.hidden = true;
    elems.btnEditor.hidden = false;
    elems.source.classList.remove(CLASSES.hidden);
    elems.editor.classList.add(CLASSES.hidden);
    elems.toolbar.disabled = true;
    elems.btnEditor.disabled = false;
    elems.toolbar.querySelector('#more-actions').disabled = false;
    elems.textarea.focus();

    return this;
  }

  /**
   * Handle resize events
   */
  #resize(): void {
    if (this.view === 'source') this.#adjustSourceLineNumbers();
  }

  /**
   * Set contenteditable
   * @returns {object} This API object for chaining
   */
  #contenteditable(): object {
    const value = !this.disabled && !this.readonly;
    this.#editorTextContainer?.setAttribute('contenteditable', `${value}`);
    return this;
  }

  /**
   * Set disabled hyperlinks and keep tab order in sync
   * @returns {object} This API object for chaining
   */
  #disabledHyperlinks(): object {
    window.requestAnimationFrame(() => {
      if (this.disabled) {
        this.querySelectorAll('a').forEach((a: HTMLElement) => {
          const idx = a.getAttribute('tabindex');
          if (idx !== null) a.dataset.idsTabindex = idx;
          a.setAttribute('tabindex', '-1');
        });
      } else {
        this.querySelectorAll('a').forEach((a: HTMLElement) => {
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
   * Initialize the raw content
   * @returns {object} This API object for chaining
   */
  #initContent(): object {
    if (!this.#editorTextContainer) {
      this.#editorTextContainer = document.createElement('div');
      this.#editorTextContainer.contentEditable = 'true';
      this.#editorTextContainer.slot = 'editor-slot';
      this.#editorTextContainer.id = 'editor-container';
      this.#editorTextContainer.setAttribute('placeholder', this.placeholder ?? '');
      this.append(this.#editorTextContainer);
    }

    // set colorpicker
    const setColorpicker = (key: string) => {
      const btn = this.querySelector<IdsButton>(`[editor-action="${key}"]`);
      if (btn) {
        let input = this.querySelector<HTMLElement>(`.${key}-input`);
        if (!input) {
          const elem = document.createElement('input');
          elem.setAttribute('type', 'color');
          elem.setAttribute('aria-label', 'Text Color');
          elem.classList.add(`${key}-input`);
          btn.append(elem);
          input = this.querySelector(`.${key}-input`);
        }
        const cssText = 'border:0;padding:0;margin:0;height:100%;width:100%;opacity:0;position:absolute;top:0;left:0;';
        if (input) input.style.cssText = cssText;
        this.#elems[`${key}Input`] = input;
        const btnIcon = btn.querySelector<IdsIcon>('ids-icon');
        const colorPickerSVGDefs = `<defs>
          <linearGradient id="colorpicker-underline" gradientTransform="rotate(90)">
            <stop class="stop-base" offset="80%"></stop>
            <stop class="stop-underline" offset="20%"></stop>
          </linearGradient>
        </defs>`;
        btnIcon?.classList.add('editor-forecolor');
        btnIcon?.pathElem?.setAttribute('fill', 'url(#colorpicker-underline)');
        btnIcon?.appendSVGDefs(colorPickerSVGDefs);
        btn.onEvent('click', btn, () => {
          input?.focus();
          input?.click();
        });
      }
    };
    setColorpicker('forecolor');
    setColorpicker('backcolor');

    // Set source/editor mode buttons
    let btnSource = this.querySelector<IdsButton>('[editor-action="sourcemode"]');
    let btnEditor = this.querySelector<IdsButton>('[editor-action="editormode"]');
    if (btnSource || btnEditor) {
      btnSource?.container?.setAttribute('editor-action', 'sourcemode');
      btnEditor?.container?.setAttribute('editor-action', 'editormode');
      if (!btnEditor) {
        const template = document.createElement('template');
        template.innerHTML = btnEditorModeTemplate;
        btnSource?.after(template.content.cloneNode(true));
        btnEditor = this.querySelector('[editor-action="editormode"]');
      }
      if (!btnSource) {
        const template = document.createElement('template');
        template.innerHTML = btnSourceModeTemplate;
        btnEditor?.after(template.content.cloneNode(true));
        btnSource = this.querySelector('[editor-action="sourcemode"]');
      }
      if (this.view === 'source') {
        btnSource?.setAttribute(attributes.HIDDEN, 'true');
        btnEditor?.setAttribute(attributes.HIDDEN, 'false');
      } else {
        btnSource?.setAttribute(attributes.HIDDEN, 'false');
        btnEditor?.setAttribute(attributes.HIDDEN, 'true');
      }
    }

    // Set to cache some elements
    this.#elems.main = qs('.main-container', this.shadowRoot);
    this.#elems.editor = qs('.editor-container', this.shadowRoot);
    this.#elems.editorSlot = qs('slot#editor-slot', this.shadowRoot);
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
    this.#elems.formatblock.btn?.configureMenu();
    this.#elems.formatblock.btn?.menuEl?.items?.forEach((item: any) => {
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
  #initModals(): object {
    const appendModal = (key: string, btn: HTMLElement | null, html: string) => {
      const template = document.createElement('template');
      template.innerHTML = html;
      this.container?.appendChild(template.content.cloneNode(true));
      this.#modals[key] = { btn, modal: qs(`#${key}-modal`, this.shadowRoot) };
    };
    const hyperlinkBtn = this.querySelector<IdsButton>('[editor-action="hyperlink"]');
    const insertimageBtn = this.querySelector<IdsButton>('[editor-action="insertimage"]');

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
        const options = targets.map((t: { value: string, text: string }) => `<ids-list-box-option value="${t.value}">${t.text}</ids-list-box-option>`).join('');
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
  #unActiveToolbarButtons(): void {
    this.#elems.toolbarElms?.forEach((btn: any) => {
      if (btn) btn.cssClass = [];

      // remove underline style for color picker
      if (btn.getAttribute('editor-action') === 'forecolor') {
        btn.querySelector('ids-icon')?.classList.remove('is-active');
      }
    });
  }

  /**
   * On paste editor container.
   * @private
   * @param {ClipboardEvent} e The event
   * @returns {void}
   */
  #onPasteEditorContainer(e: ClipboardEvent): void {
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
      document.execCommand('insertHTML', false, (this.pasteAsPlainText ? asPlainText : asHtml) as any);
      (debounce(() => this.#triggerEvent('afterpaste'), 410) as any)();
    }
  }

  /**
   * Check if slotted content contains current selection focus node
   * @param {Node} focusNode Selection focus node
   * @returns {boolean} true if focus node is within editor
   */
  #contentContainsFocusNode(focusNode: Node | null): boolean {
    return this.#editorTextContainer?.contains(focusNode) || false;
  }

  /**
   * On selection change.
   * @param {Selection} selection Selection Object
   * @private
   * @returns {void}
   */
  #onSelectionChange(selection: Selection): void {
    const elems = this.#elems;
    const parents: any = selectionParents(selection, this.#editorTextContainer!);
    const setActive = (btn: any) => {
      if (btn) btn.cssClass = ['is-active'];
    };
    const regxFormatblock = new RegExp(`^(${Object.keys(elems.formatblock.items).join('|')})$`, 'i');
    Object.entries(this.#actions).forEach(([k, v]) => {
      if (k.substring(0, 5) === 'align') return;
      if (k === 'forecolor' && parents.font?.node?.hasAttribute('color')) {
        setActive(elems.forecolorBtn);
        this.#setForecolorActiveColor(elems.forecolorBtn, parents.font?.node?.getAttribute('color'));
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
      if (document.queryCommandState((<any>v).action) && this.#contentContainsFocusNode(selection.focusNode)) {
        setActive(this.querySelector(`[editor-action="${k}"]`));
      }
    });
  }

  /**
   * Updates forecolor toolbar button with selected font color
   * @param {IdsButton} btn forecolor button
   * @param {string} color hex color
   */
  #setForecolorActiveColor(btn: IdsButton, color: string): void {
    if (!btn || !color) return;
    const btnIcon = btn.querySelector<IdsIcon>('ids-icon');
    btnIcon?.classList.add('is-active');
    btnIcon?.style.setProperty('--forecolor-active-color', color);
  }

  /**
   * On toolbar items selected.
   * @param {CustomEvent} e The event
   */
  #onSelectedToolbar(e: CustomEvent): void {
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
        const sel = document.getSelection();
        if (menuBtn) menuBtn.text = elem.text || elem.textContent?.trim();
        value = e.detail.value;

        // format dropdown changes selection
        // previous editor selection must be restored
        if (sel) {
          restoreSelection(sel, this.#savedSelection);
        }
      }

      if (/^(hyperlink|insertimage)$/i.test(action)) {
        this.#modals[action]?.modal?.show();
      } else {
        this.#handleAction(action, value);
      }
      this.#triggerEvent('input', this.#elems.editor);
      this.#toggleContentStyles(true);
    }
  }

  /**
   * On toolbar items input event.
   * @param {MouseEvent} e The event
   */
  #onInputToolbar(e: MouseEvent): void {
    if (!e) return;

    if (/forecolor-input|backcolor-input/i.test((<any>e.target).className)) {
      const action = /forecolor-input/i.test((<any>e.target).className) ? 'forecolor' : 'backcolor';
      const a = { ...this.#actions[action], value: (<any>e.target).value };
      document.execCommand(a.action, false, a.value);
    }
  }

  /**
   * On modal before show.
   * @param {string} key The modal key
   * @returns {boolean} false if, should not proseed
   */
  #onBeforeShowModal(key: string): boolean {
    const sel: any = this.#getSelection();
    this.#savedSelection = <any>saveSelection(sel);
    if (!this.#savedSelection) return false;

    // Rest all values;
    this.#modals.beforeShowValues = {};

    if (key === 'hyperlink') {
      const args = { ...this.#modals.defaults.hyperlink, hideRemoveContainer: true };
      const elems = { ...this.#modals.hyperlink.elems };
      const currentLink = findElementInSelection(sel, this, 'a');

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
   * Formats selected text to h1, h2, h3, or normal
   * @param {Selection} selection Selection object
   * @param {EditorAction} action action config
   */
  #formatBlock(selection: Selection, action: EditorAction): void {
    if (!action) return;

    if (action.value === 'blockquote' && blockElem(selection).tagName === 'blockquote') {
      action = { ...this.#actions[this.#paragraphSeparator as any] };
    }

    selectionBlockElems(selection, this.#editorTextContainer!).forEach((elem) => {
      const regx = new RegExp(`<(/?)${elem.tagName}((?:[^>"']|"[^"]*"|'[^']*')*)>`, 'gi');
      const html = elem.outerHTML.replace(regx, `<$1${action.value}$2>`);
      elem.outerHTML = html;
    });

    this.#toggleBlockFormatStyles(true);
  }

  /**
   * Sets text alignment to selection
   * @param {Selection} selection Selection object
   * @param {EditorAction} action action config
   */
  #alignText(selection: Selection, action: EditorAction): void {
    const alignDoc = this.localeAPI?.isRTL() ? 'right' : 'left';
    const align = action.action.replace('align', '').toLowerCase();
    selectionBlockElems(selection, this.#editorTextContainer!).forEach((elem) => {
      if (align === alignDoc) elem?.removeAttribute('style');
      else elem?.style.setProperty('text-align', align);
    });
  }

  /**
   * Sets text color to selection
   * @param {Selection} selection Selection object
   * @param {EditorAction} action action config
   */
  #setTextColor(selection: Selection, action: EditorAction): void {
    this.#savedSelection = saveSelection(selection);

    if (this.#savedSelection && this.#elems[`${action.action}Input`]) {
      const color = action.value === 'backcolor'
        ? (selection?.focusNode?.parentNode as HTMLElement)?.style.getPropertyValue?.('background-color')
        : document.queryCommandValue(action.action);
      this.#elems[`${action.action}Input`].value = /rgb/i.test(color) ? rgbToHex(color) : color;
    }
  }

  /**
   * Formats selection into ordererd/unordered list
   * @param {Selection} selection Selection object
   * @param {EditorAction} action action config
   */
  #createList(selection: Selection, action: EditorAction): void {
    let isAdd = true;

    selectionBlockElems(selection, this.#editorTextContainer!).forEach((elem) => {
      const listTagType = action.action === 'insertOrderedList' ? '<ol>' : '<ul>';
      if (elem.innerHTML.includes(listTagType)) isAdd = false;

      elem.innerHTML = (elem.innerHTML as any)
        .replaceAll('</ul>', '')
        .replaceAll('</ol>', '')
        .replaceAll('</li>', '')
        .replaceAll('<ul>', '')
        .replaceAll('<ol>', '')
        .replaceAll('<li>', '');
    });

    if (isAdd) {
      document.execCommand(action.action, false, action.value);
    }
  }

  /**
   * Create hyperlink at selection
   * @param {Range} range Selection range
   */
  #createHyperlink(range: Range): void {
    const elems = { ...this.#modals.hyperlink.elems };
    const { currentLink, hideRemoveContainer } = this.#modals.beforeShowValues.hyperlink;
    const urlValue = elems?.url?.value ?? '';
    const classValue = elems?.classes?.value;
    const targetValue = elems.targets?.value;
    const clickableValue = elems.clickable?.checked ? 'false' : '';
    const attr = (link: HTMLElement, name: string, value: string) => {
      if (value) link.setAttribute(name, value);
      else link.removeAttribute(name);
    };

    if (hideRemoveContainer) {
      // Create new hyperlink
      if (urlValue) {
        const rangeString = range.toString();
        const aLink = document.createElement('a');
        attr(aLink, 'href', urlValue);
        attr(aLink, 'class', classValue);
        attr(aLink, 'target', targetValue);
        attr(aLink, 'contenteditable', clickableValue);

        if (rangeString) {
          range.surroundContents(aLink);
        } else {
          aLink.textContent = urlValue;
          range.insertNode(aLink);
        }
      }
    } else if (elems.removeElem?.checked || urlValue === '') {
      // Remove the current hyperlink, selection was on hyperlink
      currentLink.outerHTML = currentLink.innerHTML;
    } else {
      // Update the current hyperlink, selection was on hyperlink
      attr(currentLink, 'href', urlValue);
      attr(currentLink, 'class', classValue);
      attr(currentLink, 'target', targetValue);
      attr(currentLink, 'contenteditable', clickableValue);
    }

    // Reset all hyperlink related elements in modal, for next time open
    elems.removeElem.checked = false;
    Object.entries(elems)
      .filter(([k]) => (!(/^(removeElem|removeContainer)$/.test(k))))
      .map((x) => x[1])
      .forEach((elem: any) => {
        if (elem) elem.disabled = false;
      });

    this.#toggleHyperlinkStyles(true);
  }

  /**
   * Create image at selection
   * @param {Selection} selection Selection object
   * @param {Range} range selection range
   */
  #createImage(selection: Selection, range: Range): void {
    let action = { ...this.#actions.insertimage };
    action.value = qs(`#insertimage-modal-input-src`, this.shadowRoot)?.value ?? '';

    if (action.value !== '') {
      if (selection.type === 'Caret') {
        range?.insertNode(document.createTextNode(' '));
        selection.removeAllRanges();
        if (range) selection.addRange(range);
      }
      const alt = qs(`#insertimage-modal-input-alt`, this.shadowRoot).value ?? '';
      if (alt !== '') {
        action = { ...this.#actions.inserthtml, value: `<img src="${action.value}" alt="${alt}" />` };
      }
      document.execCommand(action.action, false, action.value);
    }
  }

  /**
   * Handle given action
   * @param {string} actionName Name of action
   * @param {string} val The option value
   * @returns {void}
   */
  #handleAction(actionName: string, val = ''): void {
    const a: EditorAction = { ...this.#actions[actionName] };
    const sel = document.getSelection();

    // Switch editor/source mode
    if (/^(editormode|sourcemode)$/i.test(actionName)) {
      this.view = actionName.replace(/mode/i, '');
      return;
    }

    if (!sel) return;

    // Set text format
    if (a.action === 'formatBlock') {
      return this.#formatBlock(sel, this.#actions[val] ?? this.#actions[actionName]);
    }

    // Set text align
    if (/^(alignleft|alignright|aligncenter|alignjustify)$/i.test(actionName)) {
      return this.#alignText(sel, this.#actions[actionName]);
    }

    // Set forecolor, backcolor
    if (/^(forecolor|backcolor)$/i.test(actionName)) {
      return this.#setTextColor(sel, this.#actions[actionName]);
    }

    // Set ordered list, unordered list
    if (/^(orderedlist|unorderedlist)$/i.test(actionName)) {
      return this.#createList(sel, this.#actions[actionName]);
    }

    // Exec command all other actions
    // NOTE: execCommand() is deprecated
    a.value = a.value ?? val;
    document.execCommand(a.action, false, a.value);
  }

  /**
   * Handle modal action.
   * @private
   * @param {string} key The modal key
   * @returns {void}
   */
  #handleModalAction(key: string): void {
    const sel = this.#getSelection();
    if (!sel || !this.#actions[key]) return;

    restoreSelection(sel, this.#savedSelection);
    const range = sel?.getRangeAt(0);

    // Insert image
    if (key === 'insertimage') {
      this.#createImage(sel, range);
    }

    if (key === 'hyperlink') {
      this.#createHyperlink(range);
    }
  }

  /**
   * Establish Internal Event Handlers
   * @private
   * @returns {object} The object for chaining.
   */
  #attachEventHandlers(): object {
    // Attach selection change
    this.onEvent('selectionchange.editor', document, debounce(() => {
      const selection = document.getSelection();
      const isSelectedInEditor = this.#contentContainsFocusNode(selection?.focusNode ?? null);
      this.#unActiveToolbarButtons();
      this.#elems.main.classList.toggle('focused', isSelectedInEditor);

      if (selection?.focusNode && isSelectedInEditor) {
        this.#savedSelection = saveSelection(selection);
        this.#onSelectionChange(selection);
      }
    }, 200));

    // Attach toolbar events
    this.onEvent('selected.editor-toolbar', this.#elems.toolbar, (e: CustomEvent) => {
      this.#onSelectedToolbar(e);
    });
    this.onEvent('input.editor-toolbar', this.#elems.toolbar, (e: MouseEvent) => {
      this.#onInputToolbar(e);
    });
    this.onEvent('focusin.editor-toolbar', this.#elems.toolbar, () => {
      this.#unActiveToolbarButtons();
    });

    // Textarea
    this.onEvent('input.editor-textarea', this.#elems.textarea, (evt) => {
      evt.stopPropagation();
      this.#adjustSourceLineNumbers();
      (debounce(() => {
        if (!this.#elems.reqviewchange) this.#triggerEvent('change', this.#elems.textarea);
      }, 400) as any)();
    });
    this.onEvent('change.editor-textarea', this.#elems.textarea, () => {
      this.#triggerEvent('change');
    });

    // Editor container
    this.onEvent('input.editor-editcontainer', this, debounce(() => {
      if (!this.#elems.reqviewchange) {
        this.#setSourceContent();
        this.#triggerEvent('change', this.#elems.textarea);
      }
    }, 400));
    this.onEvent('blur.editor-editcontainer', this, () => {
      this.#triggerEvent('blur', this.#elems.textarea);
    });
    this.onEvent('paste.editor-editcontainer', this, (e: ClipboardEvent) => {
      this.#onPasteEditorContainer(e);
    });

    // Other events
    this.#attachKeyboardEvents();

    // Set observer for resize
    this.#resizeObserver.disconnect();
    if (this.container) this.#resizeObserver.observe(this.container);

    // EPC: @TODO replace this with the setting from infor-design/enterprise-wc#488
    const moreActions = this.querySelector<IdsToolbarMoreActions>('ids-toolbar-more-actions');
    this.onEvent('beforeshow.more-actions', moreActions, () => {
      const popupContainer = moreActions?.menu?.popup?.container;
      const currentWidth = popupContainer?.style.width;
      if (!currentWidth && popupContainer) {
        popupContainer.style.width = '175px';
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

    // Editor Slot change
    this.offEvent('slotchange.hidden-slot', this.hiddenSlot);
    this.onEvent('slotchange.hidden-slot', this.hiddenSlot, () => {
      // move user provided elements to internally handled text container slot dev#editor-slot
      this.#editorTextContainer?.append(...this.hiddenSlot.assignedElements());
    });

    this.offEvent('slotchange.editor-slot', this.editorSlot);
    this.onEvent('slotchange.editor-slot', this.editorSlot, () => {
      this.#toggleContentStyles(true);
    });

    return this;
  }

  #toggleBlockFormatStyles(applyStyles: boolean): void {
    const blockQuoteElems = this.#editorTextContainer!.querySelectorAll<HTMLElement>('blockquote');
    const firstParagraph = this.#editorTextContainer!.querySelector<HTMLParagraphElement>('p:first-of-type');

    if (!applyStyles) {
      firstParagraph?.removeAttribute('style');
      blockQuoteElems.forEach((elem) => elem.removeAttribute('style'));
      return;
    }

    // remove margin from first paragraph
    firstParagraph?.style.setProperty('margin-block-start', '0');

    // add border to blockquotes and set dimensions
    blockQuoteElems.forEach((block) => {
      block.style.setProperty('border-inline-start', 'var(--ids-editor-blockquote-border-inline-start)');
      block.style.setProperty('margin-inline-start', 'var(--ids-editor-blockquote-margin-inline-start)');
      block.style.setProperty('margin-inline-end', 'var(--ids-editor-blockquote-margin-inline-end)');
      block.style.setProperty('padding-inline-start', 'var(--ids-editor-blockquote-padding-inline-start)');
    });
  }

  #toggleHyperlinkStyles(applyStyles: boolean) {
    const linkElems = this.#editorTextContainer!.querySelectorAll<HTMLAnchorElement>('a');

    linkElems.forEach((link) => {
      if (applyStyles) {
        link.style.setProperty('color', 'var(--ids-editor-link-color-text-link)');
      } else {
        link.removeAttribute('style');
      }
    });
  }

  #toggleContentStyles(applyStyles: boolean) {
    this.#toggleHyperlinkStyles(applyStyles);
    this.#toggleBlockFormatStyles(applyStyles);
  }

  /**
   * Attach modal events
   * @private
   * @param {string} key The modal key
   * @returns {void}
   */
  #attachModalEvents(key: string): void {
    const modal = this.#modals[key].modal;

    // Hide modal
    modal.onButtonClick = () => {
      modal?.hide();
    };

    // No need to bind else, if modal has no target-btn
    if (!this.#modals[key].btn) return;

    // Before modal open
    this.offEvent(`beforeshow.editor-modal-${key}`, modal);
    this.onEvent(`beforeshow.editor-modal-${key}`, modal, (e: CustomEvent) => {
      if (!this.#onBeforeShowModal(key) && key !== 'errormessage') {
        e.detail.response(false);
        this.#modals.errormessage?.modal?.show();
      }
    });

    // Apply button clicked
    this.offEvent(`click.editor-modal-${key}`, modal);
    this.onEvent(`click.editor-modal-${key}`, modal, (e: MouseEvent) => {
      if ((e.target as any).getAttribute('id') === `${key}-modal-apply-btn`) {
        this.#handleModalAction(key);
      }
      if ((e.target as any)?.nodeName === 'IDS-MODAL-BUTTON') modal?.hide();
    });

    // Toggle disable elements in hyperlink modal
    if (key === 'hyperlink') {
      const elems = this.#modals[key].elems;
      const removeElem = elems.removeElem;
      const elemsToDisable = Object.entries(elems)
        .filter(([k]) => (!(/^(removeElem|removeContainer)$/.test(k)))).map((x) => x[1]);
      this.offEvent(`change.editor-modal-${key}-checkbox-remove`, removeElem);
      this.onEvent(`change.editor-modal-${key}-checkbox-remove`, removeElem, (e: CustomEvent) => {
        elemsToDisable.forEach((elem: any) => {
          if (elem) elem.disabled = e.detail.checked;
        });
      });
    }
  }

  /**
   * Attach Keyboard events
   * @private
   * @returns {object} This API object for chaining
   */
  #attachKeyboardEvents(): object {
    const hasKey = (action: any[], key: string) => (new RegExp(key, 'i')).test(action[1].keyid);
    const getKey = (action: any[]) => action[1].keyid.replace(/\|.*$/g, '');
    const actions = Object.entries(this.#actions).filter(([, v]) => (v as any).keyid);
    const keys = [...new Set(actions.map((action) => getKey(action)))];
    const mapped: any = {};
    keys.forEach((key: string) => {
      mapped[key] = actions.filter((action) => getKey(action) === key);
    });

    this.onEvent('keydown.editor-container', this, (e: KeyboardEvent) => {
      if (this.disabled || this.readonly) {
        return;
      }
      const key = e.code;
      if (keys.indexOf(key) > -1 && (e.ctrlKey || e.metaKey)) {
        const action = mapped[key]?.filter((a: any) => (
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
  get value(): string {
    return trimContent?.(this.#elems.textarea.value);
  }

  /**
   * Sets the editor to disabled
   * @param {boolean|string} value If true will set disabled
   */
  set disabled(value: boolean | string) {
    const isDisabled = stringToBool(value);
    this.toggleAttribute(attributes.DISABLED, isDisabled);
    this.container?.toggleAttribute(attributes.DISABLED, isDisabled);
    this.#elems?.textarea?.toggleAttribute(attributes.DISABLED, isDisabled);
    this.labelEl?.toggleAttribute(attributes.DISABLED, isDisabled);
    this.#contenteditable();
    this.#disabledHyperlinks();
  }

  get disabled() {
    const value = this.getAttribute(attributes.DISABLED);
    return value !== null ? stringToBool(value) : EDITOR_DEFAULTS.disabled;
  }

  /**
   * Used for setting the text contents of the shadowroot label
   * @param {string} [value] of label
   * @returns {void}
   */
  setLabelText(value = this.state?.label): void {
    const labelEl = this.labelEl ?? qs('#editor-label', this.shadowRoot);
    const sourceLabel = qs('[for="source-textarea"]', this.shadowRoot);
    const shouldDisplayLabel = this.labelState === null;

    if (labelEl) labelEl.innerHTML = shouldDisplayLabel ? value : '';
    if (sourceLabel) sourceLabel.innerHTML = shouldDisplayLabel ? this.sourceTextareaLabel() : '';
  }

  /**
   * Set the paragraph separator for editor
   * @param {string} value The value
   */
  set paragraphSeparator(value: string) {
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
  set pasteAsPlainText(value: boolean | string) {
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
  set placeholder(value: string | null) {
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

  get placeholder() {
    return this.getAttribute(attributes.PLACEHOLDER);
  }

  /**
   * Sets the editor to readonly
   * @param {boolean|string} value If true will set readonly
   */
  set readonly(value: boolean | string) {
    const isReadOnly = stringToBool(value);
    this.toggleAttribute(attributes.READONLY, isReadOnly);
    this.container?.toggleAttribute(attributes.READONLY, isReadOnly);
    this.#elems?.textarea?.toggleAttribute(attributes.READONLY, isReadOnly);
    this.labelEl?.toggleAttribute(attributes.READONLY, isReadOnly);
    this.#contenteditable();
  }

  get readonly() {
    const value = this.getAttribute(attributes.READONLY);
    return value !== null ? stringToBool(value) : EDITOR_DEFAULTS.readonly;
  }

  /**
   * Sets to be use source formatter for editor
   * @param {boolean|string} value The value
   */
  set sourceFormatter(value: boolean | string) {
    this.toggleAttribute(attributes.SOURCE_FORMATTER, stringToBool(value));
  }

  get sourceFormatter() {
    const value = this.getAttribute(attributes.SOURCE_FORMATTER);
    return value !== null ? stringToBool(value) : EDITOR_DEFAULTS.sourceFormatter;
  }

  /**
   * Set the view mode for editor
   * @param {string} value The value: 'editor', 'source'
   */
  set view(value: string) {
    if (VIEWS.includes(value)) {
      const attr = this.getAttribute(attributes.VIEW);
      let veto = null;

      if (this.view !== value) {
        veto = /source/i.test(value) ? this.#sourceMode() : this.#editorMode();
      }

      if (veto || (veto === null && attr !== value)) {
        this.setAttribute(attributes.VIEW, value);
      }

      if (veto) {
        this.#triggerEvent(`after${value}mode`);
        this.#triggerEvent('viewchange', this, { view: value });
      }
    } else {
      this.removeAttribute(attributes.VIEW);
    }
  }

  get view(): string {
    return this.getAttribute(attributes.VIEW) || EDITOR_DEFAULTS.view;
  }

  get editorSlot(): HTMLSlotElement {
    return this.container!.querySelector('slot#editor-slot')!;
  }

  get hiddenSlot(): HTMLSlotElement {
    return this.container!.querySelector('slot#hidden-slot')!;
  }
}
