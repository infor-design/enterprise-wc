import {
  IdsElement,
  customElement,
  attributes,
  breakpoints,
  scss,
} from '../../core';

// Import Mixins
import {
  IdsEventsMixin,
  IdsThemeMixin,
} from '../../mixins';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import styles from './ids-hidden.scss';

/**
 * IDS Hidden Component
 * @type {IdsHidden}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 * @mixes IdsThemeMixin
 */
@customElement('ids-hidden')
@scss(styles)
class IdsHidden extends IdsElement {
  constructor() {
    super();
  }

  connectedCallback() {
    // this.setHidden();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      'hide-up',
      'hide-down'
    ];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    return `<slot part="children"></slot>`;
  }

  set hideDown(val) {
    if (val) {
      const mqUp = this.isWidthDown(breakpoints[val]);
      mqUp.addEventListener('change', () => {
        this.checkScreen(mqUp);
      });
      this.checkScreen(mqUp);
    }
  }

  get hideDown() {
    return this.getAttribute('hide-down');
  }

  set hideUp(val) {
    if (val) {
      const mqUp = this.isWidthUp(breakpoints[val]);
      mqUp.addEventListener('change', () => {
        this.checkScreen(mqUp);
      });
      this.checkScreen(mqUp);
    }
  }

  get hideUp() {
    return this.getAttribute('hide-up');
  }

  set visible(val) {
    const isValTruthy = stringToBool(val);
    if (isValTruthy) {
      this.setAttribute('visible', true);
    } else {
      this.removeAttribute('visible');
    }
  }

  get visible() {
    return this.getAttribute('visible');
  }

  checkScreen(mq) {
    if (mq.matches) {
      this.hidden = true;
      this.removeAttribute('visible');
    } else {
      this.removeAttribute('hidden');
      this.setAttribute('visible', true);
    }
  }

  isWidthDown(width) {
    const mq = window.matchMedia(`(max-width: ${width})`);
    return mq;
  }

  isWidthUp(width) {
    const mq = window.matchMedia(`(min-width: ${width})`);
    return mq;
  }
}

export default IdsHidden;
