import { stringToBool, camelCase } from '../../utils/ids-string-utils/ids-string-utils';

/**
 * Default settings
 */
export const DEFAULTS = {
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
};

// Audible timeout
export const AUDIBLE_TIMEOUT = 100;

// Extra attribute use
export const ATTRIBUTE_MESSAGE_ID = 'message-id';
export const ATTRIBUTE_TOAST_DESTROY_ON_COMPLETE = 'destroy-on-complete';

// Toast message css classes use for animation
export const TOAST_MESSAGE_CLASSES = { start: 'effect-scale', end: 'effect-scale-hide' };

// The positions that can be used
export const POSITIONS = ['bottom-end', 'bottom-start', 'top-end', 'top-start'];

// Events to be trigger
export const EVENTS = {
  addMessage: 'add-message',
  removeMessage: 'remove-message',
  savePosition: 'save-position',
  clearPosition: 'clear-position',
  removeContainer: 'remove-container',
};

/**
 * Get the id to be use with current container.
 * @private
 * @param {string} uniqueId The uniqueId.
 * @param {string} suffix Optional suffix string to make the id more unique.
 * @param {string} prefix Optional prefix string to make the id more unique.
 * @returns {string} The id.
 */
export function id(uniqueId, suffix, prefix) {
  const defaults = { uniqueId: '', prefix: 'ids-toast-container', suffix: 'usersettings-position' };
  const hasValue = [uniqueId, suffix, prefix].some((x) => (x !== undefined && x !== null));
  let returnId = defaults.prefix;
  if (hasValue) {
    const use = (key, val) => ((val === undefined || val === null) ? defaults[key] : val);
    returnId = `${use('prefix', prefix)}-${use('uniqueId', uniqueId)}-${use('suffix', suffix)}`;
    returnId = returnId.replace(/--/g, '-').replace(/-$/g, '');
  }
  return returnId;
}

/**
 * Get the Message ID to be use with current message in current container.
 * @private
 * @param {string} uniqueId The uniqueId.
 * @param {string} idSegment The id part with out the uniqueId.
 * @returns {string} The message id.
 */
export function messageId(uniqueId, idSegment) {
  return `${id(uniqueId, 'message')}-${idSegment}`;
}

/**
 * Get the value for given slot.
 * @private
 * @param {object} root The shadow root.
 * @param {string} slotName The slot name.
 * @returns {string} The slot val.
 */
export function slotVal(root, slotName) {
  const d = DEFAULTS;
  const html = (slot) => slot?.assignedNodes()[0]?.innerHTML;
  const slot = root?.querySelector(`slot[name="${slotName}"]`);
  return html(slot) || d[camelCase(slotName)];
}

/**
 * Get the boolean value for given attribute.
 * @param {HTMLElement} elem The element.
 * @param {string} attr The attribute name to get the value.
 * @returns {boolean} The value
 */
export function getBoolVal(elem, attr) {
  const value = elem?.getAttribute(attr);
  return value !== null
    ? stringToBool(value) : DEFAULTS[camelCase(attr)];
}

/**
 * Check the given value is boolean.
 * @param {boolean|string} val The value.
 * @returns {boolean} true if the value boolean
 */
export function isBool(val) {
  return val === true || val === 'true' || val === false || val === 'false';
}
