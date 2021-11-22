import { attributes } from '../../core/ids-attributes';

const IdsHeaderMixin = (superclass) => class extends superclass {
  constructor() {
    super();
  }

  static get attributes() {
    return [...super.attributes, attributes.COLOR_VARIANT];
  }

  /**
   * @returns {void}
   */
  connectedCallback() {
    super.connectedCallback?.();

    // Check if it has ids-header web component in parent list
    // If exists, add color-variant `alternate` for the color variant in the header
    let parent = this;
    while (parent) {
      if (parent?.name === 'ids-header' || parent?.localName === 'ids-header') {
        this.colorVariant = 'alternate';
        break;
      }

      if (parent?.nodeType !== 11) {
        if (parent.localName === 'body') {
          break;
        }
        parent = parent.parentNode;
      } else {
        parent = parent.host;
      }
    }
  }
};

export default IdsHeaderMixin;
