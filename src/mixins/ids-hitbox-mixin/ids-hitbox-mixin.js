import { attributes } from '../../core';
import { IdsStringUtils as stringUtils } from '../../utils';

/**
 * A mixin that will add hitbox stylings to the component element.
 * @mixin IdsHitboxMixin
 * @param {any} superclass Accepts a superclass and creates a new subclass from it.
 * @returns {any} The extended object
 */
const IdsHitboxMixin = (superclass) => class extends superclass {
  constructor() {
    super();
  }

  static get attributes() {
    return [
      ...super.attributes,
      attributes.HITBOX
    ];
  }

  /**
   * Sets the checkbox to add hitbox style.
   * @param {boolean|string} value If true, it will apply the hitbox stylings.
   */
  set hitbox(value) {
    const val = stringUtils.stringToBool(value);
    if (val) {
      this.setAttribute(attributes.HITBOX, val.toString());
      this.container?.classList.add(attributes.HITBOX);
    } else {
      this.removeAttribute(attributes.HITBOX);
      this.container?.classList.remove(attributes.HITBOX);
    }
  }

  get hitbox() { return this.getAttribute(attributes.HITBOX); }
};

export default IdsHitboxMixin;
