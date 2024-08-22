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
    expanded: false,
    icon: 'tree-node',
    selectable: 'single',
    expandTarget: 'node',
    toggleCollapseIcon: 'plusminus-folder-closed',
    toggleExpandIcon: 'plusminus-folder-open',
    toggleIconRotate: false
  },

  SELECTABLE: ['single', 'multiple', 'none'],

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
};

export default IdsTreeShared;
