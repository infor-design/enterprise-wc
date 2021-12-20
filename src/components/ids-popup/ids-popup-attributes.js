import { attributes } from '../../core/ids-attributes';

const CENTER = 'center';

// Locations in which a parent-positioned Popup can be located
const ALIGNMENT_EDGES = [CENTER, 'bottom', 'top', 'left', 'right'];

// Methods for X/Y-coordinate alignment against a parent
const ALIGNMENTS_X = [CENTER, 'left', 'right'];
const ALIGNMENTS_Y = [CENTER, 'top', 'bottom'];
const ALIGNMENTS_EDGES_X = ALIGNMENTS_X.filter((x) => x !== CENTER);
const ALIGNMENTS_EDGES_Y = ALIGNMENTS_Y.filter((y) => y !== CENTER);

// Possible animation styles for the Popup
const ANIMATION_STYLES = [
  'fade',
  'scale-in'
];

// Arrow Directions (defaults to 'none')
const ARROW_TYPES = ['none', 'bottom', 'top', 'left', 'right'];

// Position types
const POSITION_STYLES = ['fixed', 'absolute', 'viewport'];

// Types of Popups
const TYPES = ['none', 'menu', 'menu-alt', 'modal', 'tooltip', 'tooltip-alt', 'custom', 'dropdown'];

// Properties exposed with getters/setters
// safeSet/RemoveAttribute also use these so we pull them out
const POPUP_PROPERTIES = [
  attributes.ALIGN,
  attributes.ALIGN_X,
  attributes.ALIGN_Y,
  attributes.ALIGN_EDGE,
  attributes.ALIGN_TARGET,
  attributes.ARROW,
  attributes.ARROW_TARGET,
  attributes.ANIMATED,
  attributes.ANIMATION_STYLE,
  attributes.BLEED,
  attributes.POSITION_STYLE,
  attributes.TYPE,
  attributes.VISIBLE,
  attributes.X,
  attributes.Y
];

/**
 * Formats the text value of the `align` attribute.
 * @private
 * @param {string} alignX matches a value from the ALIGNMENTS_X array
 * @param {string} alignY matches a value from the ALIGNMENTS_Y array
 * @param {string} edge matches a value from the ALIGNMENT_EDGES array
 * @returns {string} containing the properly formatted align value
 */
function formatAlignAttribute(alignX, alignY, edge) {
  // Check the edge for a "Y" alignment
  if (ALIGNMENTS_EDGES_Y.includes(edge)) {
    if (!alignX || !alignX.length || alignX === CENTER) {
      return `${edge}`;
    }
    return `${edge}, ${alignX}`;
  }

  // Alignment is definitely "X"
  if (!alignY || !alignY.length || alignY === CENTER) {
    return `${alignX}`;
  }
  if (edge === CENTER) {
    return `${alignY}`;
  }
  return `${edge}, ${alignY}`;
}

export {
  CENTER,
  ALIGNMENT_EDGES,
  ALIGNMENTS_X,
  ALIGNMENTS_Y,
  ALIGNMENTS_EDGES_X,
  ALIGNMENTS_EDGES_Y,
  ANIMATION_STYLES,
  ARROW_TYPES,
  POSITION_STYLES,
  TYPES,
  POPUP_PROPERTIES,
  formatAlignAttribute
};
