import {
  IdsElement,
  customElement,
  scss,
  attributes,
  mix,
  stringUtils
} from '../ids-base';

import styles from './ids-upload.scss';

// Import Mixins
import {
  IdsEventsMixin,
  IdsThemeMixin
} from '../ids-mixins';

// Supporting components
import '../ids-input/ids-input';
import '../ids-trigger-field/ids-trigger-field';

// Input id
const ID = 'ids-upload-id';

/**
 * IDS Upload Component
 * @type {IdsUpload}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @part container - the main container element
 * @part label - the label element
 * @part input - the visible input element
 * @part button - the trigger input element
 */
@customElement('ids-upload')
@scss(styles)
class IdsUpload extends mix(IdsElement).with(IdsEventsMixin, IdsThemeMixin) {
  constructor() {
    super();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      attributes.ACCEPT,
      attributes.DIRTY_TRACKER,
      attributes.DISABLED,
      attributes.LABEL,
      attributes.LABEL_FILETYPE,
      attributes.MULTIPLE,
      attributes.NO_TEXT_ELLIPSIS,
      attributes.PLACEHOLDER,
      attributes.SIZE,
      attributes.READONLY,
      attributes.TRIGGER_LABEL,
      attributes.VALIDATE,
      attributes.VALIDATION_EVENTS,
      attributes.VALUE,
      attributes.MODE,
      attributes.VERSION
    ];
  }

  /**
   * Custom Element `connectedCallback` implementation
   * @returns {void}
   */
  connectedCallback() {
    super.connectedCallback();
    /** @type {any} */
    this.trigger = this.shadowRoot.querySelector('.trigger');
    /** @type {any} */
    this.textInput = this.shadowRoot.querySelector('ids-input');
    /** @type {any} */
    this.fileInput = this.shadowRoot.querySelector(`#${ID}`);

    this.files = this.fileInput.files;
    this.handleEvents();
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    const trueVal = (/** @type {any} */v) => stringUtils.stringToBool(v);
    const accept = this.accept ? ` accept="${this.accept}"` : '';
    const dirtyTracker = trueVal(this.dirtyTracker) ? ` dirty-tracker="${this.dirtyTracker}"` : '';
    const disabled = trueVal(this.disabled) ? ` disabled="${this.disabled}"` : '';
    const textEllipsis = trueVal(this.noTextEllipsis) ? '' : ' text-ellipsis="true"';
    const label = this.label ? ` label="${this.label}"` : '';
    const placeholder = this.placeholder ? ` placeholder="${this.placeholder}"` : '';
    const multiple = trueVal(this.multiple) ? ` multiple="multiple"` : '';
    const readonlyBtn = trueVal(this.readonly) ? ` disabled="true"` : '';
    const bgTransparent = ` bg-transparent="${!trueVal(this.readonly)}"`;
    const clearableForced = ` clearable-forced="${this.hasAccess}"`;
    const size = this.size ? ` size="${this.size}"` : '';
    const triggerLabel = this.triggerLabel || this.triggerLabelDefault;
    const labelFiletype = this.labelFiletype || this.labelFiletypeDefault;
    const validate = this.validate ? ` validate="${this.validate}"` : '';
    const validationEvents = ` validation-events="${this.validationEvents || this.validationEventsDefault}"`;
    const value = this.value ? ` value="${this.value}"` : '';

    return `
      <div class="ids-upload" part="container">
        <label for="${ID}" class="ids-upload-filetype-label" aria-hidden="true" tabindex="-1">
          <ids-text audible="true" class="label-filetype" part="label">${labelFiletype}</ids-text>
        </label>
        <input id="${ID}" type="file" class="ids-upload-filetype" aria-hidden="true" tabindex="-1"${accept}${multiple}${value} />
        <ids-trigger-field ${label} content-borders>
          <ids-input
            part="input"
            readonly="true"
            triggerfield="true"
            ${clearableForced}${bgTransparent}${dirtyTracker}${disabled}${label}${placeholder}${size}${validate}${validationEvents}${textEllipsis}${value}
          ></ids-input>
          <ids-trigger-button part="button" class="trigger"${disabled}${readonlyBtn}>
            <ids-text slot="text" audible="true" class="trigger-label">${triggerLabel}</ids-text>
            <ids-icon slot="icon" icon="folder"></ids-icon>
          </ids-trigger-button>
        </ids-trigger-field>
      </div>`;
  }

  /**
   * Clear the value
   * @private
   * @returns {void}
   */
  clear() {
    if (this.hasAccess) {
      this.value = '';
    }
  }

  /**
   * Open file picker window
   * @private
   * @returns {void}
   */
  open() {
    if (this.hasAccess) {
      this.isFilePickerOpened = true; // track cancel button on file picker window
      this.fileInput?.click();
    }
  }

  /**
   * Dispatch change event
   * @private
   * @param  {object} e Actual event
   * @returns {void}
   */
  dispatchChangeEvent(e) {
    /**
     * Trigger event on parent and compose the args
     * will fire change event
     * @private
     * @param  {object} elem Actual event
     * @param  {string} value The updated input element value
     */
    this.triggerEvent('change', this, {
      detail: {
        files: this.fileInput.files,
        textValue: this.value,
        elem: this,
        nativeEvent: e
      }
    });
  }

  /**
   * Handle window focus event, track file picker window cancel button
   * @private
   * @returns {void}
   */
  handleWindowFocusEvent() {
    this.onEvent('focus', window, () => {
      if (this.isFilePickerOpened) {
        this.isFilePickerOpened = false;
        // Need timeout because `focus` get before the `files` on fileInput
        /* istanbul ignore next */
        setTimeout(() => {
          const files = this.fileInput.files;
          const eventName = `files${files.length ? 'select' : 'cancel'}`;
          this.triggerEvent(eventName, this.fileInput, {
            detail: { files, elem: this }
          });
        }, 20);
      }
    });
  }

  /**
   * Handle fileInput change event
   * @private
   * @returns {void}
   */
  handleFileInputChangeEvent() {
    this.onEvent('change', this.fileInput, (/** @type {any} */ e) => {
      const files = this.fileInput.files;
      /* istanbul ignore next */
      this.value = [].slice.call(files).map((f) => f.name).join(', ');
      this.dispatchChangeEvent(e);
    });
  }

  /**
   * Handle fileInput filescancel event
   * @private
   * @returns {void}
   */
  handleFileInputCancelEvent() {
    this.onEvent('filescancel', this.fileInput, () => {
      this.textInput.input?.dispatchEvent(new Event('blur', { bubbles: true }));
    });
  }

  /**
   * Handle drag-drop event
   * @private
   * @returns {void}
   */
  handleTextInputDragDrop() {
    if (this.hasAccess) {
      this.onEvent('dragenter', this.textInput, () => {
        this.fileInput.style.zIndex = '1';
      });

      const events = ['dragleave', 'dragend', 'drop'];
      events.forEach((eventName) => {
        this.onEvent(eventName, this.textInput, () => {
          setTimeout(() => {
            this.fileInput.style.zIndex = '';
          }, 1);
        });
      });
    }
  }

  /**
   * Handle keydown event
   * @private
   * @returns {void}
   */
  handleTextInputKeydown() {
    this.onEvent('keydown', this.textInput, (/** @type {any} */ e) => {
      const allow = ['Backspace', 'Enter', 'Space'];
      const key = e.code;
      /* istanbul ignore next */
      const isClearBtn = e.path?.filter((p) => p?.classList?.contains('btn-clear')).length > 0;
      if (allow.indexOf(key) > -1 && !isClearBtn) {
        if (key === 'Backspace') {
          this.clear();
          this.dispatchChangeEvent(e);
        } else {
          this.open();
        }
        e.preventDefault();
      }
    });
  }

  /**
   * Handle trigger click event
   * @private
   * @returns {void}
   */
  handleTriggerClickEvent() {
    this.onEvent('click', this.trigger, () => {
      this.open();
    });
  }

  /**
   * Handle input cleared event
   * @private
   * @returns {void}
   */
  handleInputClearedEvent() {
    this.onEvent('cleared', this.textInput, (/** @type {any} */ e) => {
      this.clear();
      this.dispatchChangeEvent(e);
    });
  }

  /**
   * Handle events
   * @private
   * @returns {void}
   */
  handleEvents() {
    this.handleWindowFocusEvent();
    this.handleFileInputChangeEvent();
    this.handleFileInputCancelEvent();
    this.handleTextInputDragDrop();
    this.handleTextInputKeydown();
    this.handleTriggerClickEvent();
    this.handleInputClearedEvent();
  }

  /**
   * Default label for filetype
   * @private
   * @returns {string} default label value
   */
  get labelFiletypeDefault() {
    const instructions = ', Press Enter to Browse for files';
    return `${(this.label || '')}${instructions}`;
  }

  /**
   * Default label for trigger button
   * @private
   * @returns {string} default label value
   */
  get triggerLabelDefault() { return `trigger button for ${(this.label || 'fileupload')}`; }

  /**
   * Default validation events
   * @private
   * @returns {string} default validation events value
   */
  get validationEventsDefault() { return `blur change`; }

  /**
   * Has access to use, if not disabled or readonly
   * @private
   * @returns {boolean} true, if not disabled or readonly
   */
  get hasAccess() {
    const trueVal = (/** @type {any} */ v) => stringUtils.stringToBool(v);
    return !(trueVal(this.disabled) || trueVal(this.readonly));
  }

  /**
   * Set `accept` attribute
   * @param {string} value `accept` attribute
   */
  set accept(value) {
    if (value) {
      this.setAttribute(attributes.ACCEPT, value);
      this.fileInput.setAttribute(attributes.ACCEPT, value);
    } else {
      this.removeAttribute(attributes.ACCEPT);
      this.fileInput.removeAttribute(attributes.ACCEPT);
    }
  }

  get accept() { return this.getAttribute(attributes.ACCEPT); }

  /**
   * Set `dirty-tracker` attribute
   * @param {boolean|string} value If true will set `dirty-tracker` attribute
   */
  set dirtyTracker(value) {
    const val = stringUtils.stringToBool(value);
    if (val) {
      this.setAttribute(attributes.DIRTY_TRACKER, val.toString());
      this.textInput.dirtyTracker = true;
    } else {
      this.removeAttribute(attributes.DIRTY_TRACKER);
      this.textInput.dirtyTracker = false;
    }
  }

  get dirtyTracker() { return this.getAttribute(attributes.DIRTY_TRACKER); }

  /**
   * Set `disabled` attribute
   * @param {boolean|string} value If true will set `disabled` attribute
   */
  set disabled(value) {
    const val = stringUtils.stringToBool(value);
    if (val) {
      this.setAttribute(attributes.DISABLED, val.toString());
      this.textInput.readonly = false;
      this.textInput.disabled = true;
      this.trigger.disabled = true;
    } else {
      this.removeAttribute(attributes.DISABLED);
      this.textInput.readonly = true;
      this.textInput.disabled = false;
      this.trigger.disabled = false;
    }
  }

  get disabled() { return this.getAttribute(attributes.DISABLED); }

  /**
   * Set the `label` text of input label
   * @param {string} value of the `label` text property
   */
  set label(value) {
    if (value) {
      this.setAttribute(attributes.LABEL, value);
      this.textInput.label = value;
    } else {
      this.removeAttribute(attributes.LABEL);
      this.textInput.label = null;
    }
  }

  get label() { return this.getAttribute(attributes.LABEL); }

  /**
   * Set the label for filetype
   * @param {string} value The label for filetype
   */
  set labelFiletype(value) {
    const labelEL = this.shadowRoot.querySelector('.label-filetype');
    if (value) {
      this.setAttribute(attributes.LABEL_FILETYPE, value);
      labelEL.textContent = value;
    } else {
      this.removeAttribute(attributes.LABEL_FILETYPE);
      labelEL.textContent = this.labelFiletypeDefault;
    }
  }

  get labelFiletype() { return this.getAttribute(attributes.LABEL_FILETYPE); }

  /**
   * Set the `multiple` attribute for filetype
   * @param {boolean|string} value of the `multiple` property
   */
  set multiple(value) {
    this.fileInput = this.shadowRoot.querySelector(`#${ID}`);
    const val = stringUtils.stringToBool(value);
    if (val) {
      this.setAttribute(attributes.MULTIPLE, val.toString());
      this.fileInput?.setAttribute(attributes.MULTIPLE, 'multiple');
      return;
    }
    this.removeAttribute(attributes.MULTIPLE);
    this.fileInput?.removeAttribute(attributes.MULTIPLE);
  }

  get multiple() { return this.getAttribute(attributes.MULTIPLE); }

  /**
   * Set the `no-text-ellipsis` attribute for text input
   * @param {boolean|string} value of the `no-text-ellipsis` property
   */
  set noTextEllipsis(value) {
    const val = stringUtils.stringToBool(value);
    if (val) {
      this.setAttribute(attributes.NO_TEXT_ELLIPSIS, val.toString());
      this.textInput.textEllipsis = false;
      return;
    }
    this.removeAttribute(attributes.NO_TEXT_ELLIPSIS);
    this.textInput.textEllipsis = true;
  }

  get noTextEllipsis() { return this.getAttribute(attributes.NO_TEXT_ELLIPSIS); }

  /**
   * Set the `placeholder` of input
   * @param {string} value of the `placeholder` property
   */
  set placeholder(value) {
    if (value) {
      this.setAttribute(attributes.PLACEHOLDER, value);
      this.textInput.placeholder = value;
      return;
    }
    this.removeAttribute(attributes.PLACEHOLDER);
    this.textInput.placeholder = null;
  }

  get placeholder() { return this.getAttribute(attributes.PLACEHOLDER); }

  /**
   * Set the `readonly` of input
   * @param {boolean|string} value If true will set `readonly` attribute
   */
  set readonly(value) {
    const val = stringUtils.stringToBool(value);
    if (val) {
      this.setAttribute(attributes.READONLY, val.toString());
      this.textInput.bgTransparent = false;
      this.trigger.container.disabled = false;
      this.trigger.container.classList.add('readonly');
    } else {
      this.removeAttribute(attributes.READONLY);
      this.textInput.bgTransparent = true;
      this.trigger.container.disabled = false;
      this.trigger.container.classList.remove('readonly');
    }
  }

  get readonly() { return this.getAttribute(attributes.READONLY); }

  /**
   * Set the size of input
   * @param {string} value [xs, sm, mm, md, lg, full]
   */
  set size(value) {
    if (value) {
      this.setAttribute(attributes.SIZE, value);
      this.textInput.size = value;
    } else {
      this.removeAttribute(attributes.SIZE);
      this.textInput.size = null;
    }
  }

  get size() { return this.getAttribute(attributes.SIZE); }

  /**
   * Set the label for trigger button
   * @param {string} value The label for trigger button
   */
  set triggerLabel(value) {
    const labelEL = this.shadowRoot.querySelector('.trigger-label');
    if (value) {
      this.setAttribute(attributes.TRIGGER_LABEL, value);
      labelEL.textContent = value;
    } else {
      this.removeAttribute(attributes.TRIGGER_LABEL);
      labelEL.textContent = this.triggerLabelDefault;
    }
  }

  get triggerLabel() { return this.getAttribute(attributes.TRIGGER_LABEL); }

  /**
   * Set `validate` attribute
   * @param {string} value The `validate` attribute
   */
  set validate(value) {
    if (value) {
      this.setAttribute(attributes.VALIDATE, value);
      this.textInput.validate = value;
    } else {
      this.removeAttribute(attributes.VALIDATE);
      this.textInput.validate = null;
    }
  }

  get validate() { return this.getAttribute(attributes.VALIDATE); }

  /**
   * Sets which events to fire validation on
   * @param {string} value The `validation-events` attribute
   */
  set validationEvents(value) {
    if (value) {
      this.setAttribute(attributes.VALIDATION_EVENTS, value);
      this.textInput.validationEvents = value;
    } else {
      this.removeAttribute(attributes.VALIDATION_EVENTS);
      this.textInput.validationEvents = this.validationEventsDefault;
    }
  }

  get validationEvents() { return this.getAttribute(attributes.VALIDATION_EVENTS); }

  /**
   * Set the `value` for text input and file input
   * @param {string} val the value property
   */
  set value(val) {
    if (val) {
      this.setAttribute(attributes.VALUE, val);
      this.textInput.value = val;
    } else {
      this.removeAttribute(attributes.VALUE);
      this.fileInput.value = null;
      this.textInput.value = '';
    }
    this.files = this.fileInput.files;
  }

  get value() { return this.getAttribute(attributes.VALUE); }
}

export default IdsUpload;
