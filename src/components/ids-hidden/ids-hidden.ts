import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import {
  Breakpoints,
  isWidthBelow,
  isWidthAbove,
} from '../../utils/ids-breakpoint-utils/ids-breakpoint-utils';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import IdsElement from '../../core/ids-element';
import styles from './ids-hidden.scss';

/**
 * IDS Hidden Component
 * @type {IdsHidden}
 * @inherits IdsElement
 */
@customElement('ids-hidden')
@scss(styles)
export default class IdsHidden extends IdsElement {
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
      attributes.CONTAINER_TARGET,
      attributes.ENABLE_CONTAINER,
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
  set hideDown(val: keyof Breakpoints | null) {
    if (val) {
      const mqUp = isWidthBelow(val);
      this.setAttribute(attributes.HIDE_DOWN, String(val));
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
  get hideDown(): keyof Breakpoints | null {
    return this.getAttribute(attributes.HIDE_DOWN);
  }

  /**
   * Sets the min-width breakpoint
   * @param {string} val xxl | xl | lg | md | sm | xs
   * @memberof IdsHidden
   */
  set hideUp(val: keyof Breakpoints | null) {
    if (val) {
      const mqUp = isWidthAbove(val);
      this.setAttribute(attributes.HIDE_UP, String(val));
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
  get hideUp(): keyof Breakpoints | null {
    return this.getAttribute(attributes.HIDE_UP);
  }

  /**
   * Set the visible attribute
   * @param {boolean} val of the visible attribute
   * @memberof IdsHidden
   */
  set visible(val: boolean | string | null) {
    const isValTruthy = stringToBool(val);
    if (isValTruthy) {
      this.setAttribute(attributes.VISIBLE, 'true');
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
  set condition(val: string | boolean | null) {
    if (val) {
      this.setAttribute(attributes.CONDITION, String(val));
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
  set value(val: string | boolean | null) {
    if (val) {
      this.setAttribute(attributes.VALUE, String(val === 'undefined' ? '' : val));
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
   * Set the enable-container attribute
   * Tells the component to use container queries
   * @memberof IdsHidden
   */
  set enableContainer(val: string) {
    const value = stringToBool(val);
    if (value) {
      this.setAttribute(attributes.ENABLE_CONTAINER, '');
      this.classList.add(attributes.ENABLE_CONTAINER);
    } else {
      this.removeAttribute(attributes.ENABLE_CONTAINER);
      this.classList.remove(attributes.ENABLE_CONTAINER);
    }
  }

  /**
   * Get the enable-container attribute
   * @returns {boolean} enable-container
   * @readonly
   * @memberof IdsHidden
   */
  get enableContainer(): boolean {
    return this.hasAttribute(attributes.ENABLE_CONTAINER);
  }

  /**
   * Sets the container target
   * @param {string} val container target
   * @memberof IdsHidden
   */
  set containerTarget(val: string) {
    if (val) {
      this.setAttribute('container-target', val);
      const target = document.getElementById(val)!;
      target.style.containerType = 'inline-size';
    } else {
      this.removeAttribute('container-target');
    }
  }

  /**
   * Get the container target
   * @readonly
   * @type {(string | null)}
   * @memberof IdsHidden
   */
  get containerTarget(): string | null {
    return this.getAttribute('container-target');
  }

  /**
   * Check the screen size
   * @param {MediaQueryList} mq media query to check against
   * @memberof IdsHidden
   */
  checkScreen(mq: MediaQueryList) {
    if (this.enableContainer) return;

    if (mq.matches) {
      this.hidden = true;
      this.removeAttribute('visible');
    } else {
      this.removeAttribute('hidden');
      this.setAttribute('visible', 'true');
    }
  }

  /**
   * Check value agains the comparison
   * @memberof IdsHidden
   */
  checkCompare() {
    let condition = this.condition;
    let value = this.value;
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
      this.setAttribute('visible', 'true');
    }
  }
}
