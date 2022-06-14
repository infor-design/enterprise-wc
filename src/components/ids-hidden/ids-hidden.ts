import { customElement, scss } from '../../core/ids-decorators';
import { attributes, Breakpoints, breakpoints } from '../../core/ids-attributes';
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
export default class IdsHidden extends Base {
  constructor() {
    super();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array<string>} The attributes in an array
   */
  static get attributes(): Array<string> {
    return [
      attributes.CONDITION,
      attributes.HIDE_UP,
      attributes.HIDE_DOWN,
      attributes.VALUE,
      attributes.VISIBLE,
    ];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template(): string {
    return `<slot part="children"></slot>`;
  }

  /**
   * Sets the max-width breakpoint
   * @param {string} val xxl | xl | lg | md | sm | xs
   * @memberof IdsHidden
   */
  set hideDown(val: keyof Breakpoints) {
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
  get hideDown(): keyof Breakpoints {
    return this.getAttribute(attributes.HIDE_DOWN);
  }

  /**
   * Sets the min-width breakpoint
   * @param {string} val xxl | xl | lg | md | sm | xs
   * @memberof IdsHidden
   */
  set hideUp(val: keyof Breakpoints) {
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
  get hideUp(): keyof Breakpoints {
    return this.getAttribute(attributes.HIDE_UP);
  }

  /**
   * Set the visible attribute
   * @param {boolean} val of the visible attribute
   * @memberof IdsHidden
   */
  set visible(val: boolean) {
    const isValTruthy = stringToBool(val);
    if (isValTruthy) {
      this.setAttribute(attributes.VISIBLE, true);
      this.hidden = false;
    } else {
      this.removeAttribute(attributes.VISIBLE);
      this.hidden = true;
    }
  }

  /**
   * Get the visible attribute
   * @returns {boolean} visible
   * @readonly
   * @memberof IdsHidden
   */
  get visible() {
    return this.getAttribute(attributes.VISIBLE);
  }

  /**
   * Set the compare condition
   * @param {string} val the value to compare
   * @memberof IdsHidden
   */
  set condition(val: string) {
    if (val) {
      this.setAttribute(attributes.CONDITION, val);
    } else {
      this.removeAttribute(attributes.CONDITION);
    }
    this.checkCompare();
  }

  /**
   * Get the compare condition
   * @returns {boolean} visible
   * @readonly
   * @memberof IdsHidden
   */
  get condition() {
    return this.getAttribute(attributes.CONDITION);
  }

  /**
   * Set the compare value
   * @param {boolean} val the value to compare
   * @memberof IdsHidden
   */
  set value(val: string) {
    if (val) {
      this.setAttribute(attributes.VALUE, val === 'undefined' ? '' : val);
    } else {
      this.removeAttribute(attributes.VALUE);
    }
    this.checkCompare();
  }

  /**
   * Get the compare value
   * @returns {string} the value to compare
   * @readonly
   * @memberof IdsHidden
   */
  get value() {
    return this.getAttribute(attributes.VALUE);
  }

  /**
   * Check the screen size
   * @param {MediaQueryList} mq media query to check against
   * @memberof IdsHidden
   */
  checkScreen(mq: MediaQueryList) {
    if (mq.matches) {
      this.hidden = true;
      this.removeAttribute('visible');
    } else {
      this.removeAttribute('hidden');
      this.setAttribute('visible', true);
    }
  }

  /**
   * Check value agains the comparison
   * @memberof IdsHidden
   */
  checkCompare() {
    let condition: string | boolean = this.condition;
    let value: string | boolean = this.value;
    let isMatch = false;
    value = value === 'undefined' ? '' : value;
    if (condition === 'false' || condition === 'true') {
      condition = stringToBool(condition);
      value = (value === 'false' || value === 'true') ? stringToBool(value) : value;
      if (condition && value) {
        isMatch = true;
      }
      if (!condition && !value) {
        isMatch = true;
      }
    } else {
      isMatch = this.value === this.condition;
    }

    if (isMatch) {
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
   * @returns {MediaQueryList} media query
   * @memberof IdsHidden
   */
  isWidthDown(width: string): MediaQueryList {
    const mq = window.matchMedia(`(max-width: ${width})`);
    return mq;
  }

  /**
   * Check for min width media query.
   * @param {string} width size of the breakpoint
   * @returns {MediaQueryList} media query
   * @memberof IdsHidden
   */
  isWidthUp(width: string): MediaQueryList {
    const mq = window.matchMedia(`(min-width: ${width})`);
    return mq;
  }
}
