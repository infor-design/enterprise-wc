import type IdsElement from '../../core/ids-element';
import { attributes } from '../../core/ids-attributes';

export type IdsPopupElementRef = IdsElement | HTMLElement | SVGElement | null;

const CENTER = 'center';

const DEFAULT_ALIGN_EDGE = CENTER;

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
const TYPES = [
  'none',
  'menu',
  'menu-alt',
  'modal',
  'tooltip',
  'tooltip-alt',
  'custom',
  'dropdown',
  'module-nav'
];

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
  attributes.HEIGHT,
  attributes.MAX_HEIGHT,
  attributes.POSITION_STYLE,
  attributes.TYPE,
  attributes.VISIBLE,
  attributes.WIDTH,
  attributes.X,
  attributes.Y
];

const POPUP_MAXHEIGHT_PROPNAME = '--ids-popup-maxheight';

/**
 * Defines XY Switch results
 */
export type IdsPopupXYSwitchResult = {
  flip: boolean,
  oppositeEdge: string,
  shouldSwitchXY: boolean,
  targetEdge: string,
  x: number,
  y: number
};

/**
 * Formats the text value of the `align` attribute.
 * @private
 * @param {string} alignX matches a value from the ALIGNMENTS_X array
 * @param {string} alignY matches a value from the ALIGNMENTS_Y array
 * @param {string} edge matches a value from the ALIGNMENT_EDGES array
 * @returns {string} containing the properly formatted align value
 */
function formatAlignAttribute(alignX: string, alignY: string, edge: string): string {
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

/**
 * Optional callback that can be used to adjust the Popup's placement
 * after all internal adjustments are made.
 * @param {DOMRect} popupRect a Rect object representing the current state of the popup.
 * @returns {object} an adjusted Rect object with "nudged" coordinates.
 */
function onPlace(popupRect: DOMRect): DOMRect {
  return popupRect;
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
  DEFAULT_ALIGN_EDGE,
  POSITION_STYLES,
  TYPES,
  POPUP_MAXHEIGHT_PROPNAME,
  POPUP_PROPERTIES,
  formatAlignAttribute,
  onPlace
};
