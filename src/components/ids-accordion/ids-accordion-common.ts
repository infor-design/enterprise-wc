export const ALIGNMENT_TYPES = ['has-icon'];

export type IdsAccordionTextDisplay = ['default', 'tooltip', 'hidden'];

export const DISPLAY_TEXT_TYPES = ['default', 'tooltip', 'hidden'];

export const applyContentAlignmentClass = (
  cl: { contains: (arg0: string) => any; remove: (arg0: string) => void; add: (arg0: string) => void; },
  thisAlignment: string | null
) => {
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
export const refreshRTLStyle = (cl: DOMTokenList, val: boolean): void => {
  cl[val ? 'add' : 'remove']('rtl');
};

/**
 * @param {string} val incoming text display type
 * @returns {boolean} true if the text display is valid
 */
export const isValidTextDisplay = (val: string) => DISPLAY_TEXT_TYPES.includes(val);
