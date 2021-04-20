import maskAPI from './ids-mask-global';
import { convertPatternFromString } from './ids-mask-common';
import { dateMask, numberMask } from './ids-masks';

import { props } from '../ids-base/ids-constants';
import { IdsEventsMixin } from '../ids-base/ids-events-mixin';

const MASK_PROPS = [
  props.MASK,
  props.MASK_OPTIONS
];

/**
 * Adds validation to any input field
 * @param {any} superclass Accepts a superclass and creates a new subclass from it
 * @returns {any} The extended object
 */
const IdsMaskMixin = (superclass) => class extends IdsEventsMixin(superclass) {
  constructor() {
    super();
    this.maskState = {
      options: {},
      previousMaskResult: '',
      previousPlaceholder: ''
    };
  }

  static get properties() {
    return super.properties.concat(MASK_PROPS);
  }

  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }

    this.handleMaskEvents();
    this.processMaskWithCurrentValue();
  }

  /**
   * @readonly
   * @returns {IdsMask} reference to a global IDS Mask instance
   */
  get maskAPI() {
    return maskAPI;
  }

  /**
   * @returns {object} defined Mask options
   */
  get maskOptions() {
    return this.maskState.options;
  }

  /**
   * @param {object} val incoming Mask options
   */
  set maskOptions(val) {
    if (typeof val === 'object') {
      this.maskState.options = val;
    }
  }

  /**
   * @returns {Function} a Pipe Function for modifying Mask output
   */
  get maskPipe() {
    return this.maskState.pipe;
  }

  /**
   * @param {Function} val a Pipe Function for modifying Mask output
   */
  set maskPipe(val) {
    if (typeof val === 'function') {
      this.maskState.pipe = val;
    }
  }

  /**
   * Retrieves the currently-stored mask pattern.
   * @returns {string|Function|Array<string|RegExp>} representing the stored mask pattern
   */
  get mask() {
    return this.maskState.pattern;
  }

  /**
   * Sets the Mask pattern to be used.
   * @param {string|Function|Array<string|RegExp>} val the mask pattern on which to conform input
   */
  set mask(val) {
    let trueVal;

    // In cases where the mask is a string (Legacy Soho Mask), the string is automatically converted
    // to an array containing regex patterns.
    // In cases where the mask is a function, the function call is stored and called when the mask
    // needs to be processed.
    if (Array.isArray(val) || typeof val === 'function') {
      trueVal = val;
    } else if (typeof val === 'string') {
      switch (val) {
      // Using 'date' as a string automatically connects the standard date mask function
      case 'date':
        trueVal = dateMask;
        break;
      // Using 'number' as a string automatically connects the standard number mask function
      case 'number':
        trueVal = numberMask;
        break;
      default:
        trueVal = convertPatternFromString(val);
        break;
      }
    }

    this.maskState.pattern = trueVal;
  }

  handleMaskEvents() {
    this.onEvent('input', this, () => this.processMaskWithCurrentValue());
  }

  /**
   * Uses an input value and pattern options to process a masked string.
   * @param {string} rawValue the value to be checked for masking.
   * @param {IdsMaskOptions} opts various options that can be passed to the masking process.
   * @returns {object} the result of the mask
   */
  processMask = (rawValue = '', opts) => {
    // If no mask function/pattern is defined, do not process anything.
    if (!this.mask) {
      return true;
    }

    // If the passed rawValue is the same as the last result, do no masking
    const previousValue = this.maskState.previousMaskResult;
    if (rawValue === previousValue) {
      return false;
    }

    let posBegin = this.input.selectionStart || 0;
    let posEnd = this.input.selectionEnd || 0;

    // @TODO: Check the old source code here for Android-specific modifications to the cursor position

    // Get a string-safe version of the rawValue
    rawValue = maskAPI.getSafeRawValue(rawValue);

    // Convert `maskOptions` from the WebComponent to IDS 4.x `patternOptions`
    const processOptions = {
      caretTrapIndexes: [],
      guide: false,
      keepCharacterPositions: false,
      pattern: this.mask,
      patternOptions: opts,
      placeholderChar: '_',
      previousMaskResult: previousValue,
      selection: {
        start: posBegin,
        end: posEnd
      }
    };

    // Modify process options in some specific cases
    if (posBegin !== posEnd) {
      processOptions.selection.contents = rawValue.substring(posBegin, posEnd);
    }
    if (typeof this.maskPipe === 'function') {
      processOptions.pipe = this.maskPipe;
    }

    // Process the mask
    const processed = maskAPI.process(rawValue, processOptions);
    if (!processed.maskResult) {
      return false;
    }

    // Get a conformed, final value from the completed masking process.
    // Use a "piped" value if one is available.
    let finalValue = processed.conformedValue;
    if (processed.pipedValue) {
      finalValue = processed.pipedValue;
    }

    // Append a suffix from the mask options, if one is defined by settings, but doesn't exist
    // in the final value yet (may not have been added to the string by the mask,
    // depending on caret position)
    if (finalValue !== '' && opts.suffix && finalValue.includes(opts.suffix)) {
      finalValue += `${opts.suffix}`;
    }

    // Generate options for the Caret adjustment process based on the conformed value
    // and its matching mask placeholder.
    const adjustCaretOpts = {
      conformedValue: finalValue,
      rawValue,
      caretPos: processed.caretPos,
      placeholder: processed.placeholder,
      placeholderChar: processOptions.placeholderChar,
      previousMaskResult: previousValue,
      previousPlaceholder: this.maskState.previousPlaceholder,
    };
    if (processed.pipedCharacterIndexes) {
      adjustCaretOpts.indexesOfPipedChars = processed.pipedCharIndexes;
    }
    if (processed.caretTrapIndexes) {
      adjustCaretOpts.caretTrapIndexes = processed.caretTrapIndexes;
    }

    // Get a corrected caret position
    processed.caretPos = maskAPI.adjustCaretPosition(adjustCaretOpts);

    // Set component state
    this.maskState.previousMaskResult = finalValue;
    this.maskState.previousPlaceholder = processed.placeholder;
    this.value = finalValue;
    this.safelySetSelection(this.shadowRoot, processed.caretPos, processed.caretPos);

    // Return out if there was no visible change in the conformed result
    // (causes state not to change, events not to fire)
    if (previousValue === finalValue) {
      return false;
    }

    // @TODO Trigger a `write` event if necessary?

    return true;
  }

  /**
   * Uses this current input value and pattern options defined to process a masked string.
   * @returns {object} the result of the mask
   */
  processMaskWithCurrentValue() {
    return this.processMask(this.value, this.maskOptions);
  }

  /**
   * @param {ShadowRoot|Document} host either the Document, or a relevant Shadow Root
   * @param {number} startPos starting position
   * @param {number} endPos end position
   * @returns {void}
   */
  safelySetSelection(host = document, startPos = 0, endPos = 0) {
    const validInputElementTypes = ['text', 'password', 'search', 'url', 'week', 'month'];
    if (!validInputElementTypes.includes(this.input.type)) {
      return;
    }
    if (host.activeElement === this.input) {
      this.input.setSelectionRange(startPos, endPos, 'none');
    }
  }
};

export default IdsMaskMixin;
