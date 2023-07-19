/**
 * Controls the visible state of the Module Nav component.
 * In some cases this also has affects on child components and event handling
 */
export type IdsModuleNavDisplayMode = false | 'collapsed' | 'expanded';

export const DISPLAY_MODE_TYPES = [false, 'collapsed', 'expanded'];

export type IdsAccordionTextDisplay = ['default', 'tooltip', 'hidden'];

export const DISPLAY_TEXT_TYPES = ['default', 'tooltip', 'hidden'];

/**
 * @param {string} val incoming text display type
 * @returns {boolean} true if the text display is valid
 */
export const isValidTextDisplay = (val: string) => DISPLAY_TEXT_TYPES.includes(val);
