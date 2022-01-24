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
      attributes.PRE_SELECTED,
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

    if (value === 'multiple' || value === 'single' || value === 'mixed') {
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

    if (this.selection === 'multiple' || this.selection === 'single' || this.selection === 'mixed') {
      this.container?.classList[value === 'true' ? 'add' : 'remove']('is-selected');
    }
  }

  get selected() { return this.getAttribute(attributes.SELECTED); }

  /**
   * Set the preselected to a boolean value
   * @param {boolean} value The preselected value
   */
  set preselected(value) {
    this.setAttribute(attributes.PRE_SELECTED, value);

    if (this.selection === 'mixed') {
      this.container?.classList[value === 'true' ? 'add' : 'remove']('pre-selected');
    }
  }

  get preselected() { return this.getAttribute(attributes.PRE_SELECTED); }
};

export default IdsSelectionMixin;
