import { attributes } from '../../core/ids-attributes';
import { customElement, scss } from '../../core/ids-decorators';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import { transitionToPromise } from '../../utils/ids-dom-utils/ids-dom-utils';
import { cssTransitionTimeout } from '../../utils/ids-timer-utils/ids-timer-utils';

import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsElement from '../../core/ids-element';

import styles from './ids-overlay.scss';

/**
 * IDS Overlay Component
 * @type {IdsOverlay}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 */
@customElement('ids-overlay')
@scss(styles)
export default class IdsOverlay extends IdsEventsMixin(IdsElement) {
  constructor() {
    super();
  }

  static get attributes(): Array<string> {
    return [
      ...super.attributes,
      attributes.BACKGROUND_COLOR,
      attributes.COLOR,
      attributes.OPACITY,
      attributes.VISIBLE
    ];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template(): string {
    return `<div class="ids-overlay${this.visible ? ' visible' : ''}" part="overlay"><slot></slot></div>`;
  }

  /**
   * Gets overlay visible state
   * @returns {boolean} visible flag
   */
  get visible(): boolean {
    return this.hasAttribute(attributes.VISIBLE);
  }

  /**
   * Sets overlay visible state
   * @param {boolean|string} val visible flag
   */
  set visible(val: boolean | string) {
    const isVisible = stringToBool(val);
    this.toggleAttribute(attributes.VISIBLE, isVisible);
    this.#smoothlyAnimateVisibility(isVisible);
  }

  /**
   * Gets background color
   * @returns {string} css variable for background color
   */
  get backgroundColor(): string {
    return this.getAttribute(attributes.BACKGROUND_COLOR) ?? '';
  }

  /**
   * Sets background color
   * @param {string} val css variable
   */
  set backgroundColor(val: string) {
    if (val) {
      this.setAttribute(attributes.BACKGROUND_COLOR, val);
    } else {
      this.removeAttribute(attributes.BACKGROUND_COLOR);
    }
  }

  /**
   * Gets overlay z index value
   * @returns {number} zindex
   */
  get zIndex(): number {
    return Number(this.getAttribute(attributes.Z_INDEX));
  }

  /**
   * Sets overlay z index value
   * @param {number|string} val zindex
   */
  set zIndex(val: number | string) {
    const trueVal = Number(val);

    if (trueVal) {
      this.setAttribute(attributes.Z_INDEX, String(trueVal));
      this.container?.style.setProperty('z-index', String(trueVal));
    } else {
      this.removeAttribute(attributes.Z_INDEX);
      this.container?.style.removeProperty('z-index');
    }
  }

  /**
   * Gets overlay opacity
   * @returns {number} opacity
   */
  get opacity(): number {
    const trueVal = Number(this.getAttribute(attributes.OPACITY) ?? NaN);
    return Number.isNaN(trueVal) ? 0.5 : trueVal;
  }

  /**
   * Sets overlay opacity
   * @param {number} val opacity
   */
  set opacity(val: number | string) {
    let trueVal = Number(val);

    if (Number.isNaN(trueVal) || trueVal === this.opacity) return;

    // Opacity is a percentage value between 0 and 1,
    // so adjust the number accordingly if we get something off
    trueVal = Math.max(trueVal, 0);
    trueVal = Math.min(trueVal, 1);

    this.setAttribute(attributes.OPACITY, String(trueVal));
    this.#changeOpacity(trueVal);
  }

  /**
   * Changes the amount of opacity on the overlay
   * @param {number} opacity opacity value
   * @returns {Promise} fulfilled after a CSS transition completes.
   */
  async #changeOpacity(opacity: number): Promise<any> {
    return transitionToPromise(
      this.container,
      'background-color',
      `rgba(${this.backgroundColor === 'page' ? 'var(--ids-overlay-page-background-color)' : 'var(--ids-overlay-background-color)'} / ${opacity})`
    );
  }

  /**
   * Animates in/out the visibility of the overlay
   * @param {boolean} val if true, shows the overlay.  If false, hides the overlay.
   */
  async #smoothlyAnimateVisibility(val: boolean) {
    const cl = this.container?.classList;

    if (val && !cl?.contains('visible')) {
      // Make visible
      cl?.add('visible');
      await cssTransitionTimeout(2);
      this.#changeOpacity(this.opacity);
    } else if (!val && cl?.contains('visible')) {
      // Make hidden
      await this.#changeOpacity(0);
      cl?.remove('visible');
    }
  }
}
