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

    this.state = {
      opacity: 0.5,
      backgroundColor: '',
      visible: false,
    };
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
   * @returns {boolean} true if the overlay is visible
   */
  get visible(): boolean {
    return this.state.visible;
  }

  /**
   * @param {boolean} val true if the overlay should be made visible
   */
  set visible(val: boolean) {
    const trueVal = stringToBool(val);

    this.state.visible = trueVal;
    this.#smoothlyAnimateVisibility(trueVal);
  }

  /**
   * @returns {string} css variable for background color
   */
  get backgroundColor(): string {
    return this.state.backgroundColor;
  }

  /**
   * @param {string} val css variable for background color
   */
  set backgroundColor(val: string) {
    this.state.backgroundColor = val;
  }

  /**
   * @returns {string} value for zindex
   */
  get zIndex(): string {
    return this.state.zIndex;
  }

  /**
   * @param {boolean} val value for zindex
   */
  set zIndex(val: string) {
    this.state.zIndex = val;
  }

  /**
   * @returns {number} the percent opacity
   */
  get opacity(): number {
    return this.state.opacity;
  }

  /**
   * @param {number} val a percentage number for setting overlay transparency
   */
  set opacity(val: number | string) {
    let trueVal = Number(val);
    if (Number.isNaN(trueVal)) {
      return;
    }

    // Opacity is a percentage value between 0 and 1,
    // so adjust the number accordingly if we get something off
    if (trueVal < 0) {
      trueVal = 0;
    }
    if (trueVal > 1) {
      trueVal = 1;
    }
    this.state.opacity = trueVal;
    this.#changeOpacity(trueVal);
  }

  /**
   * Changes the amount of opacity on the overlay
   * @param {number} val the opacity value to set on the overlay
   * @returns {Promise} fulfilled after a CSS transition completes.
   */
  async #changeOpacity(val: any): Promise<any> {
    return transitionToPromise(this.container, 'background-color', `rgba(${this.backgroundColor === 'page' ? 'var(--ids-overlay-page-background-color)' : 'var(--ids-overlay-background-color)'} / ${val})`);
  }

  /**
   * Animates in/out the visibility of the overlay
   * @param {boolean} val if true, shows the overlay.  If false, hides the overlay.
   */
  async #smoothlyAnimateVisibility(val: any) {
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
