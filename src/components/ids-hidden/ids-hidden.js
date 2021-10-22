import {
  IdsElement,
  customElement,
  attributes,
  scss,
} from '../../core';

// Import Mixins
import {
  IdsEventsMixin,
  IdsThemeMixin,
} from '../../mixins';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import styles from './ids-hidden.scss';

const breakpoints = [
  { bpXxl: '1440px' },
  { bpXl: '1280px' },
  { bpLg: '1024px' },
  { bpMd: '840px' },
  { bpSm: '600px' },
  { bpXs: '360px' }
];

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
    this.setHidden();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      attributes.BP_XXL_UP,
      attributes.BP_XXL_DOWN,
      attributes.BP_XL_UP,
      attributes.BP_XL_DOWN,
      attributes.BP_LG_UP,
      attributes.BP_LG_DOWN,
      attributes.BP_MD_UP,
      attributes.BP_MD_DOWN,
      attributes.BP_SM_UP,
      attributes.BP_SM_DOWN,
      attributes.BP_XS_UP,
      attributes.BP_XS_DOWN,
      'visible'
    ];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    return `<slot part="children"></slot>`;
  }

  set bpXxlUp(val) {
    const isValTruthy = stringToBool(val);
    if (isValTruthy) {
      this.setAttribute(attributes.BP_XXL_UP, true);
    } else {
      this.removeAttribute(attributes.BP_XXL_UP);
    }
  }

  get bpXxlUp() {
    return this.getAttribute(attributes.BP_XXL_UP);
  }

  set bpXxlDown(val) {
    const isValTruthy = stringToBool(val);
    if (isValTruthy) {
      this.setAttribute(attributes.BP_XXL_DOWN, true);
    } else {
      this.removeAttribute(attributes.BP_XXL_DOWN);
    }
  }

  get bpXxlDown() {
    return this.getAttribute(attributes.BP_XXL_DOWN);
  }

  set bpXlUp(val) {
    const isValTruthy = stringToBool(val);
    if (isValTruthy) {
      this.setAttribute(attributes.BP_XL_UP, true);
    } else {
      this.removeAttribute(attributes.BP_XL_UP);
    }
  }

  get bpXlUp() {
    return this.getAttribute(attributes.BP_XL_UP);
  }

  set bpXlDown(val) {
    const isValTruthy = stringToBool(val);
    if (isValTruthy) {
      this.setAttribute(attributes.BP_XL_DOWN, true);
    } else {
      this.removeAttribute(attributes.BP_XL_DOWN);
    }
  }

  get bpXlDown() {
    return this.getAttribute(attributes.BP_XL_DOWN);
  }

  set bpLgUp(val) {
    const isValTruthy = stringToBool(val);
    if (isValTruthy) {
      this.setAttribute(attributes.BP_LG_UP, true);
    } else {
      this.removeAttribute(attributes.BP_LG_UP);
    }
  }

  get bpLgUp() {
    return this.getAttribute(attributes.BP_LG_UP);
  }

  set bpLgDown(val) {
    const isValTruthy = stringToBool(val);
    if (isValTruthy) {
      this.setAttribute(attributes.BP_LG_DOWN, true);
    } else {
      this.removeAttribute(attributes.BP_LG_DOWN);
    }
  }

  get bpLgDown() {
    return this.getAttribute(attributes.BP_LG_DOWN);
  }

  set bpMdUp(val) {
    const isValTruthy = stringToBool(val);
    if (isValTruthy) {
      this.setAttribute(attributes.BP_MD_UP, true);
      this.bp = breakpoints[3].md;
    } else {
      this.removeAttribute(attributes.BP_MD_UP);
      this.bg = null;
    }
  }

  get bpMdUp() {
    return this.getAttribute(attributes.BP_MD_UP);
  }

  set bpMdDown(val) {
    const isValTruthy = stringToBool(val);
    if (isValTruthy) {
      this.setAttribute(attributes.BP_MD_DOWN, true);
    } else {
      this.removeAttribute(attributes.BP_MD_DOWN);
    }
  }

  get bpMdDown() {
    return this.getAttribute(attributes.BP_MD_DOWN);
  }

  set bpSmUp(val) {
    const isValTruthy = stringToBool(val);
    if (isValTruthy) {
      this.setAttribute(attributes.BP_SM_UP, true);
    } else {
      this.removeAttribute(attributes.BP_SM_UP);
    }
  }

  get bpSmUp() {
    return this.getAttribute(attributes.BP_SM_UP);
  }

  set bpSmDown(val) {
    const isValTruthy = stringToBool(val);
    if (isValTruthy) {
      this.setAttribute(attributes.BP_SM_DOWN, true);
      this.bp = breakpoints[4].sm;
    } else {
      this.removeAttribute(attributes.BP_SM_DOWN);
      this.bp = null;
    }
  }

  get bpSmDown() {
    return this.getAttribute(attributes.BP_SM_DOWN);
  }

  set bpXsUp(val) {
    const isValTruthy = stringToBool(val);
    if (isValTruthy) {
      this.setAttribute(attributes.BP_XS_UP, true);
    } else {
      this.removeAttribute(attributes.BP_XS_UP);
    }
  }

  get bpXsUp() {
    return this.getAttribute(attributes.BP_XS_UP);
  }

  set bpXsDown(val) {
    const isValTruthy = stringToBool(val);
    if (isValTruthy) {
      this.setAttribute(attributes.BP_XS_DOWN, true);
    } else {
      this.removeAttribute(attributes.BP_XS_DOWN);
    }
  }

  get bpXsDown() {
    return this.getAttribute(attributes.BP_XS_DOWN);
  }

  checkScreen(e) {
    if (e.matches) {
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

  setHidden() {
    breakpoints.forEach((breakpoint) => {
      const breakpointKey = Object.keys(breakpoint)[0];
      const breakpointUp = `${breakpointKey}Up`;
      const breakpointDown = `${breakpointKey}Down`;

      if (this[breakpointUp]) {
        const mqUp = this.isWidthUp(breakpoint[breakpointKey]);
        mqUp.addEventListener('change', (e) => {
          if (e.matches) {
            this.hidden = true;
            this.removeAttribute('visible');
          } else {
            this.removeAttribute('hidden');
            this.setAttribute('visible', true);
          }
        });
        this.checkScreen(mqUp);
      }

      if (this[breakpointDown]) {
        const mqDown = this.isWidthDown(breakpoint[breakpointKey]);
        mqDown.addEventListener('change', (e) => {
          if (e.matches) {
            this.hidden = true;
            this.removeAttribute('visible');
          } else {
            this.removeAttribute('hidden');
            this.setAttribute('visible', true);
          }
        });
        this.checkScreen(mqDown);
      }
    });
  }
}

export default IdsHidden;
