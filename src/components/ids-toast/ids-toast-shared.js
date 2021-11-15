import { stringToBool, camelCase } from '../../utils/ids-string-utils/ids-string-utils';

/**
 * Shared in between toast.
 * @private
 * @returns {void}
 */
const IdsToastShared = {
  /**
   * Default settings
   */
  DEFAULTS: {
    // Slots default text
    closeButtonLabel: 'Close',
    message: '(Content)',
    title: '(Title)',

    // Api default settings
    allowLink: false,
    audible: false,
    destroyOnComplete: true,
    draggable: false,
    position: 'top-end',
    progressBar: true,
    savePosition: false,
    timeout: 6000,
    uniqueId: null
  },

  // Audible timeout
  AUDIBLE_TIMEOUT: 100,

  // Extra attribute use
  ATTRIBUTE_MESSAGE_ID: 'message-id',
  ATTRIBUTE_TOAST_DESTROY_ON_COMPLETE: 'destroy-on-complete',

  // Toast message css classes use for animation
  TOAST_MESSAGE_CLASSES: { start: 'effect-scale', end: 'effect-scale-hide' },

  // Positions can be use
  POSITIONS: ['bottom-end', 'bottom-start', 'top-end', 'top-start'],

  // Events to be trigger
  EVENTS: {
    addMessage: 'add-message',
    removeMessage: 'remove-message',
    savePosition: 'save-position',
    clearPosition: 'clear-position',
    removeContainer: 'remove-container',
  },

  /**
   * Get the id to be use with current container.
   * @private
   * @param {string} uniqueId The uniqueId.
   * @param {string} suffix Optional suffix string to make the id more unique.
   * @param {string} prefix Optional prefix string to make the id more unique.
   * @returns {string} The id.
   */
  id(uniqueId, suffix, prefix) {
    const defaults = { uniqueId: '', prefix: 'ids-toast-container', suffix: 'usersettings-position' };
    const hasValue = [uniqueId, suffix, prefix].some((x) => (x !== undefined && x !== null));
    let id = defaults.prefix;
    if (hasValue) {
      const use = (key, val) => ((val === undefined || val === null) ? defaults[key] : val);
      id = `${use('prefix', prefix)}-${use('uniqueId', uniqueId)}-${use('suffix', suffix)}`;
      id = id.replace(/--/g, '-').replace(/-$/g, '');
    }
    return id;
  },

  /**
   * Get the Message ID to be use with current message in current container.
   * @private
   * @param {string} uniqueId The uniqueId.
   * @param {string} id The id.
   * @returns {string} The message id.
   */
  messageId(uniqueId, id) {
    return `${this.id(uniqueId, 'message')}-${id}`;
  },

  /**
   * Get the value for given slot.
   * @private
   * @param {object} root The shadow root.
   * @param {string} slotName The slot name.
   * @returns {string} The slot val.
   */
  slotVal(root, slotName) {
    const d = this.DEFAULTS;
    const html = (slot) => slot?.assignedNodes()[0]?.innerHTML;
    const slot = root?.querySelector(`slot[name="${slotName}"]`);
    return html(slot) || d[camelCase(slotName)];
  },

  /**
   * Get the boolean value for given attribute.
   * @param {HTMLElement} elem The element.
   * @param {string} attr The attribute name to get the value.
   * @returns {boolean} The value
   */
  getBoolVal(elem, attr) {
    const value = elem?.getAttribute(attr);
    return value !== null
      ? stringToBool(value) : this.DEFAULTS[camelCase(attr)];
  },

  /**
   * Check the given value is boolean.
   * @param {boolean|string} val The value.
   * @returns {boolean} true if the value boolean
   */
  isBool(val) {
    return val === true || val === 'true' || val === false || val === 'false';
  }
};

export default IdsToastShared;
