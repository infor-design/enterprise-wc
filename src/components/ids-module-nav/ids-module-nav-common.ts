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

/**
 * @param {HTMLElement} el target element
 * @param {boolean | undefined} [doToggle] if true, toggles the scrollbar
 * @returns {boolean} true if the scrollbar was toggled
 */
export const toggleScrollbar = (el: HTMLElement, doToggle?: boolean) => {
  let didToggle = false;
  if (el instanceof HTMLElement) {
    if ((doToggle === undefined && el.scrollHeight > el.clientHeight) || doToggle === true) {
      el.classList.add('has-scrollbar');
      didToggle = true;
    } else {
      el.classList.remove('has-scrollbar');
    }
  }
  return didToggle;
};
