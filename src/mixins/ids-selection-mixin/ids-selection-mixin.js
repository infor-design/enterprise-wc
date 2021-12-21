import { attributes } from '../../core';

/**
/**
 * A mixin that adds selection functionality to components
 * @param {any} superclass Accepts a superclass and creates a new subclass from it
 * @returns {any} The extended object
 */
const IdsSelectionMixin = (superclass) => class extends superclass {
  constructor() {
    super();
  }

  static get attributes() {
    return [
      ...super.attributes,
      attributes.CARD_SELECTED,
      attributes.CARD_SELECTION,
    ];
  }

  connectedCallback() {
    super.connectedCallback?.();
  }

  /**
   * Set the card-selection to a particular string
   * @param {string} value The selection value
   */
  set cardSelection(value) {
    this.setAttribute(attributes.CARD_SELECTION, value);

    if (value === 'multiple' || value === 'single') {
      this.container?.classList.add('is-selectable');
    } else {
      this.container?.classList.remove('is-selectable');
    }
  }

  get cardSelection() { return this.getAttribute(attributes.CARD_SELECTION); }

  /**
   * Set the card-selected to a boolean value
   * @param {boolean} value The selected value
   */
  set cardSelected(value) {
    this.setAttribute(attributes.CARD_SELECTED, value);

    if (this.cardSelection === 'multiple' || this.cardSelection === 'single') {
      this.container?.classList[value === 'true' ? 'add' : 'remove']('is-selected');
    }
  }

  get cardSelected() { return this.getAttribute(attributes.CARD_SELECTED); }
};

export default IdsSelectionMixin;
