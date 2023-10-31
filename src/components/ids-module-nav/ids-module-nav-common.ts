/**
 * Controls the visible state of the Module Nav component.
 * In some cases this also has affects on child components and event handling
 */
export type IdsModuleNavDisplayMode = false | 'collapsed' | 'expanded';

export const DISPLAY_MODE_TYPES = [false, 'collapsed', 'expanded'];

export type IdsAccordionTextDisplay = ['default', 'tooltip', 'hidden'];

export const DISPLAY_TEXT_TYPES = ['default', 'tooltip', 'hidden'];

export const RESPONSIVE_BREAKPOINT = 'md';

/**
 * @param {string} val incoming text display type
 * @returns {boolean} true if the text display is valid
 */
export const isValidTextDisplay = (val: string) => DISPLAY_TEXT_TYPES.includes(val);

/**
 * Checks overflow of an element by cloning/appending to body
 * @param {any} elem Element to check
 * @returns {boolean} if the element is overflowed
 */
export const checkItemOverflow = (elem: any) => {
  let clone;
  if (elem!.container) {
    clone = elem!.container.cloneNode(true);
    clone.innerHTML = `${elem!.textContent}`;
  } else {
    clone = elem!.cloneNode(true);
    clone.removeAttribute('overflow');
  }

  clone.style.display = 'inline';
  clone.style.width = 'auto';
  clone.style.visibility = 'hidden';
  document.body.append(clone);

  let result = false;
  if (clone.offsetWidth > elem.offsetWidth) result = true;

  clone.remove();
  return result;
};
