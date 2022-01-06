import { attributes } from '../../core/ids-attributes';

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
      attributes.SELECTED,
      attributes.SELECTION,
    ];
  }

  connectedCallback() {
    super.connectedCallback?.();
  }

  /**
   * Set the selection to a particular string
   * @param {string} value The selection value
   */
  set selection(value) {
    this.setAttribute(attributes.SELECTION, value);

    if (value === 'multiple' || value === 'single') {
      this.container?.classList.add('is-selectable');
    } else {
      this.container?.classList.remove('is-selectable');
    }
  }

  get selection() { return this.getAttribute(attributes.SELECTION); }

  /**
   * Set the selected to a boolean value
   * @param {boolean} value The selected value
   */
  set selected(value) {
    this.setAttribute(attributes.SELECTED, value);

    if (this.selection === 'multiple' || this.selection === 'single') {
      this.container?.classList[value === 'true' ? 'add' : 'remove']('is-selected');
    }
  }

  get selected() { return this.getAttribute(attributes.SELECTED); }
};

export default IdsSelectionMixin;
