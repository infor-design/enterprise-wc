import { camelCase, stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

/**
 * Shared in between tree.
 * @private
 * @returns {void}
 */
const IdsTreeShared = {
  /**
   * Default settings
   */
  DEFAULTS: {
    collapseIcon: 'closed-folder',
    expandIcon: 'open-folder',
    expanded: true,
    icon: 'tree-node',
    selectable: 'single',
    useToggleTarget: false,
    toggleCollapseIcon: 'plusminus-folder-closed',
    toggleExpandIcon: 'plusminus-folder-open',
    toggleIconRotate: true
  },

  SELECTABLE: ['single', 'multiple', 'false'],

  EVENTS: {
    beforeselected: 'beforeselected',
    selected: 'selected',
    beforeunselected: 'beforeunselected',
    unselected: 'unselected',
    beforecollapsed: 'beforecollapsed',
    collapsed: 'collapsed',
    beforeexpanded: 'beforeexpanded',
    expanded: 'expanded'
  },

  TOGGLE_CLASSES: {
    collapsed: 'collapsed',
    expanded: 'expanded'
  },

  TREE_ARIA_LABEL: 'IDS Tree',

  /**
   * Get the value for given attribute.
   * @param {HTMLElement} elem The element.
   * @param {string} attr The attribute name to get the value.
   * @returns {string|null} The value or default value
   */
  getVal(elem, attr) {
    const value = elem?.getAttribute(attr);
    return value !== null ? value : this.DEFAULTS[camelCase(attr)];
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

export default IdsTreeShared;
