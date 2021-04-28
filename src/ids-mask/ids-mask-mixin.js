import maskAPI from './ids-mask-global';
import { convertPatternFromString, PLACEHOLDER_CHAR } from './ids-mask-common';
import { dateMask, numberMask } from './ids-masks';

import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import { IdsStringUtils } from '../ids-base/ids-string-utils';

/**
 * Adds validation to any input field
 * @param {any} superclass Accepts a superclass and creates a new subclass from it
 * @returns {any} The extended object
 */
// @ts-ignore
const IdsMaskMixin = (superclass) => class extends IdsEventsMixin(superclass) {
  constructor() {
    super();
    this.maskState = {
      guide: false,
      keepCharacterPositions: false,
      options: {},
      previousMaskResult: '',
      previousPlaceholder: ''
    };
  }

  connectedCallback() {
    super.connectedCallback?.();

    this.handleMaskEvents();
    this.processMaskWithCurrentValue();
  }

  /**
   * @readonly
   * @returns {maskAPI} reference to a global IDS Mask instance
   */
  get maskAPI() {
    return maskAPI;
  }

  set maskGuide(val) {
    const trueVal = IdsStringUtils.stringToBool(val);
    this.maskState.guide = trueVal;
    this.processMaskWithCurrentValue();
  }

  get maskGuide() {
    return this.maskState.guide;
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

  set maskRetainPositions(val) {
    const trueVal = IdsStringUtils.stringToBool(val);
    this.maskState.keepCharacterPositions = trueVal;
  }

  get maskRetainPositions() {
    return this.maskState.keepCharacterPositions;
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
    } else {
      // Assume string in all other cases
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
    // @ts-ignore
    this.onEvent('input', this, () => this.processMaskWithCurrentValue());
  }

  /**
   * Uses an input value and pattern options to process a masked string.
   * @param {string} rawValue the value to be checked for masking.
   * @param {object} opts various options that can be passed to the masking process.
   * @param {boolean} [doSetValue=false] if true, attempts to set input state when masking completes
   * @returns {string|boolean} the result of the mask.  If no masking was performed, return `false`
   */
  processMask = (rawValue = '', opts, doSetValue = false) => {
    // If no mask function/pattern is defined, do not process anything.
    if (!this.mask) {
      return false;
    }

    // If the passed rawValue is the same as the last result, do no masking
    const previousValue = this.maskState.previousMaskResult;
    if (rawValue === previousValue) {
      return false;
    }

    // @ts-ignore
    const posBegin = this.input.selectionStart || 0; // @ts-ignore
    const posEnd = this.input.selectionEnd || 0;

    // @TODO: Check the old source code here for Android-specific changes to the cursor position

    // Get a string-safe version of the rawValue
    // eslint-disable-next-line
    rawValue = maskAPI.getSafeRawValue(rawValue);

    // Convert `maskOptions` from the WebComponent to IDS 4.x `patternOptions`
    const processOptions = {
      caretTrapIndexes: [],
      guide: this.maskState.guide,
      keepCharacterPositions: this.maskState.keepCharacterPositions,
      pattern: this.mask,
      patternOptions: opts,
      placeholderChar: PLACEHOLDER_CHAR,
      previousMaskResult: previousValue,
      selection: {
        start: posBegin,
        end: posEnd
      }
    };

    // Modify process options in some specific cases
    /* istanbul ignore next */
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
    if (finalValue !== '' && opts.suffix && !finalValue.includes(opts.suffix)) {
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
    /* istanbul ignore next */
    if (processed.pipedCharacterIndexes) {
      adjustCaretOpts.indexesOfPipedChars = processed.pipedCharIndexes;
    }
    /* istanbul ignore next */
    if (processed.caretTrapIndexes) {
      adjustCaretOpts.caretTrapIndexes = processed.caretTrapIndexes;
    }

    // Get a corrected caret position
    processed.caretPos = maskAPI.adjustCaretPosition(adjustCaretOpts);

    // Set mask state
    this.maskState.previousMaskResult = finalValue;
    this.maskState.previousPlaceholder = processed.placeholder;

    // Set Input Component state (only occurs when triggered via event)
    if (doSetValue) {
      this.value = finalValue;
      // @ts-ignore
      this.safelySetSelection(this.shadowRoot, processed.caretPos, processed.caretPos);
    }

    return finalValue;
  }

  /**
   * Uses this current input value and pattern options defined to process a
   * masked string, also setting input state.
   * @returns {object} the result of the mask
   */
  processMaskWithCurrentValue() {
    return this.processMask(this.value, this.maskOptions, true);
  }

  /**
   * Uses a provided value with stored mask options to process a masked string,
   * without setting input state.
   * @param {string} rawValue a text value to process against the mask
   * @returns {object} the result of the mask
   */
  processMaskFromProperty(rawValue = '') {
    return this.processMask(rawValue, this.maskOptions, false);
  }

  /**
   * @private
   * @param {ShadowRoot|Document} host either the Document, or a relevant Shadow Root
   * @param {number} startPos starting position
   * @param {number} endPos end position
   * @returns {void}
   */
  /* istanbul ignore next */
  safelySetSelection(host = document, startPos = 0, endPos = 0) {
    // @ts-ignore
    if (host?.activeElement === this.input) {
      // @ts-ignore
      this.input.setSelectionRange(startPos, endPos, 'none');
    }
  }
};

export default IdsMaskMixin;
