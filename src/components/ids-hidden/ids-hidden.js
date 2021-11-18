import { customElement, scss } from '../../core/ids-decorators';
import { attributes, breakpoints } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import Base from './ids-hidden-base';

import styles from './ids-hidden.scss';

/**
 * IDS Hidden Component
 * @type {IdsHidden}
 * @inherits IdsElement
 */
@customElement('ids-hidden')
@scss(styles)
class IdsHidden extends Base {
  constructor() {
    super();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      attributes.HIDE_UP,
      attributes.HIDE_DOWN
    ];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    return `<slot part="children"></slot>`;
  }

  /**
   * Sets the max-width breakpoint
   * @param {string} val xxl | xl | lg | md | sm | xs
   * @memberof IdsHidden
   */
  set hideDown(val) {
    if (val) {
      const mqUp = this.isWidthDown(breakpoints[val]);
      this.setAttribute(attributes.HIDE_DOWN, val);
      mqUp.addEventListener('change', () => {
        this.checkScreen(mqUp);
      });
      this.checkScreen(mqUp);
    } else {
      this.removeAttribute(attributes.HIDE_DOWN);
    }
  }

  /**
   * Get the hideDown attribute
   * @returns {string} hideDown
   * @readonly
   * @memberof IdsHidden
   */
  get hideDown() {
    return this.getAttribute(attributes.HIDE_DOWN);
  }

  /**
   * Sets the min-width breakpoint
   * @param {string} val xxl | xl | lg | md | sm | xs
   * @memberof IdsHidden
   */
  set hideUp(val) {
    if (val) {
      const mqUp = this.isWidthUp(breakpoints[val]);
      this.setAttribute(attributes.HIDE_UP, val);
      mqUp.addEventListener('change', () => {
        this.checkScreen(mqUp);
      });
      this.checkScreen(mqUp);
    } else {
      this.removeAttribute(attributes.HIDE_UP);
    }
  }

  /**
   * Get the hideUp attribute
   * @returns {string} hideUp
   * @readonly
   * @memberof IdsHidden
   */
  get hideUp() {
    return this.getAttribute(attributes.HIDE_UP);
  }

  /**
   * Set the visible attribute
   * @param {boolean} val of the visible attribute
   * @memberof IdsHidden
   */
  set visible(val) {
    const isValTruthy = stringToBool(val);
    if (isValTruthy) {
      this.setAttribute('visible', true);
    } else {
      this.removeAttribute('visible');
    }
  }

  /**
   * Get the visible attribute
   * @returns {boolean} visible
   * @readonly
   * @memberof IdsHidden
   */
  get visible() {
    return this.getAttribute('visible');
  }

  /**
   * Check the screen size
   * @param {object} mq media query to check against
   * @memberof IdsHidden
   */
  checkScreen(mq) {
    if (mq.matches) {
      this.hidden = true;
      this.removeAttribute('visible');
    } else {
      this.removeAttribute('hidden');
      this.setAttribute('visible', true);
    }
  }

  /**
   * Check for max width media query.
   * @param {string} width size of the breakpoint
   * @returns {object} media query
   * @memberof IdsHidden
   */
  isWidthDown(width) {
    const mq = window.matchMedia(`(max-width: ${width})`);
    return mq;
  }

  /**
   * Check for min width media query.
   * @param {string} width size of the breakpoint
   * @returns {object} media query
   * @memberof IdsHidden
   */
  isWidthUp(width) {
    const mq = window.matchMedia(`(min-width: ${width})`);
    return mq;
  }
}

export default IdsHidden;
