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

  connectedCallback() {}

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
      attributes.BP_XS_DOWN
    ];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    return `<slot></slot>`;
  }

  set BpXxlUp(val) {
    const isValTruthy = stringToBool(val);
    if (isValTruthy) {
      this.setAttribute(attributes.BP_XXL_UP, true);
    } else {
      this.removeAttribute(attributes.BP_XXL_UP);
    }
  }

  get BpXxlUp() {
    return this.getAttribute(attributes.BP_XXL_UP);
  }

  set BpXxlDown(val) {
    const isValTruthy = stringToBool(val);
    if (isValTruthy) {
      this.setAttribute(attributes.BP_XXL_DOWN, true);
    } else {
      this.removeAttribute(attributes.BP_XXL_DOWN);
    }
  }

  get BpXxlDown() {
    return this.getAttribute(attributes.BP_XXL_DOWN);
  }

  set BpXlUp(val) {
    const isValTruthy = stringToBool(val);
    if (isValTruthy) {
      this.setAttribute(attributes.BP_XL_UP, true);
    } else {
      this.removeAttribute(attributes.BP_XL_UP);
    }
  }

  get BpXlUp() {
    return this.getAttribute(attributes.BP_XL_UP);
  }

  set BpXlDown(val) {
    const isValTruthy = stringToBool(val);
    if (isValTruthy) {
      this.setAttribute(attributes.BP_XL_DOWN, true);
    } else {
      this.removeAttribute(attributes.BP_XL_DOWN);
    }
  }

  get BpXlDown() {
    return this.getAttribute(attributes.BP_XL_DOWN);
  }

  set BpLgUp(val) {
    const isValTruthy = stringToBool(val);
    if (isValTruthy) {
      this.setAttribute(attributes.BP_LG_UP, true);
    } else {
      this.removeAttribute(attributes.BP_LG_UP);
    }
  }

  get BpLgUp() {
    return this.getAttribute(attributes.BP_LG_UP);
  }

  set BpLgDown(val) {
    const isValTruthy = stringToBool(val);
    if (isValTruthy) {
      this.setAttribute(attributes.BP_LG_DOWN, true);
    } else {
      this.removeAttribute(attributes.BP_LG_DOWN);
    }
  }

  get BpLgDown() {
    return this.getAttribute(attributes.BP_LG_DOWN);
  }

  set BpMdUp(val) {
    const isValTruthy = stringToBool(val);
    if (isValTruthy) {
      this.setAttribute(attributes.BP_MD_UP, true);
    } else {
      this.removeAttribute(attributes.BP_MD_UP);
    }
  }

  get BpMdUp() {
    return this.getAttribute(attributes.BP_MD_UP);
  }

  set BpMdDown(val) {
    const isValTruthy = stringToBool(val);
    if (isValTruthy) {
      this.setAttribute(attributes.BP_MD_DOWN, true);
    } else {
      this.removeAttribute(attributes.BP_MD_DOWN);
    }
  }

  get BpMdDown() {
    return this.getAttribute(attributes.BP_MD_DOWN);
  }

  set BpSmUp(val) {
    const isValTruthy = stringToBool(val);
    if (isValTruthy) {
      this.setAttribute(attributes.BP_SM_UP, true);
    } else {
      this.removeAttribute(attributes.BP_SM_UP);
    }
  }

  get BpSmUp() {
    return this.getAttribute(attributes.BP_SM_UP);
  }

  set BpSmDown(val) {
    const isValTruthy = stringToBool(val);
    if (isValTruthy) {
      this.setAttribute(attributes.BP_SM_DOWN, true);
    } else {
      this.removeAttribute(attributes.BP_SM_DOWN);
    }
  }

  get BpSmDown() {
    return this.getAttribute(attributes.BP_SM_DOWN);
  }

  set BpXsUp(val) {
    const isValTruthy = stringToBool(val);
    if (isValTruthy) {
      this.setAttribute(attributes.BP_XS_UP, true);
    } else {
      this.removeAttribute(attributes.BP_XS_UP);
    }
  }

  get BpXsUp() {
    return this.getAttribute(attributes.BP_XS_UP);
  }

  set BpXsDown(val) {
    const isValTruthy = stringToBool(val);
    if (isValTruthy) {
      this.setAttribute(attributes.BP_XS_DOWN, true);
    } else {
      this.removeAttribute(attributes.BP_XS_DOWN);
    }
  }

  get BpXsDown() {
    return this.getAttribute(attributes.BP_XS_DOWN);
  }
}

export default IdsHidden;
