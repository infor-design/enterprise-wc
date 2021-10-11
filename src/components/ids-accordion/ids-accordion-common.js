export const ALIGNMENT_TYPES = ['has-icon'];

export const applyContentAlignmentClass = (cl, thisAlignment) => {
  /* istanbul ignore next */
  ALIGNMENT_TYPES.forEach((alignment) => {
    if (!thisAlignment || (alignment !== thisAlignment && cl.contains(alignment))) {
      cl.remove(alignment);
    } else if (alignment === thisAlignment && !cl.contains(alignment)) {
      cl.add(alignment);
    }
  });
};

/**
 * @param {DOMTokenList} cl the classlist of an IdsElement's `container`
 * @param {boolean} val true if this component should be displayed with RTL styles
 * @returns {void}
 */
export const refreshRTLStyle = (cl, val) => {
  cl[val ? 'add' : 'remove']('rtl');
};
