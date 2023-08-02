import { attributes } from '../../core/ids-attributes';
import { IdsBaseConstructor } from '../../core/ids-element';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

/**
 * A mixin that adds selection functionality to components
 * @param {any} superclass Accepts a superclass and creates a new subclass from it
 * @returns {any} The extended object
 */
const IdsSelectionMixin = <T extends IdsBaseConstructor>(superclass: T) => class extends superclass {
  constructor(...args: any[]) {
    super(...args);
  }

  static get attributes() {
    return [
      ...(superclass as any).attributes,
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
  set selection(value: string) {
    this.setAttribute(attributes.SELECTION, String(value));

    if (value === 'multiple' || value === 'single' || value === 'mixed') {
      this.container?.classList.add('is-selectable');
    } else {
      this.container?.classList.remove('is-selectable');
    }
  }

  get selection(): string { return this.getAttribute(attributes.SELECTION) || ''; }

  /**
   * Set the selected to a boolean value
   * @param {string | boolean} value The selected value
   */
  set selected(value: string | boolean) {
    this.setAttribute(attributes.SELECTED, String(value));

    if (this.selection === 'multiple' || this.selection === 'single' || this.selection === 'mixed') {
      this.container?.classList[value === 'true' ? 'add' : 'remove']('is-selected');
    }
  }

  get selected() { return stringToBool(this.getAttribute(attributes.SELECTED)); }

  /**
   * Set the preselected to a boolean value
   * @param {boolean} value The preselected value
   */
  set preselected(value) {
    this.setAttribute(attributes.PRE_SELECTED, String(value));

    if (this.selection === 'mixed') {
      this.container?.classList[value === 'true' ? 'add' : 'remove']('pre-selected');
    }
  }

  get preselected() { return this.getAttribute(attributes.PRE_SELECTED); }
};

export default IdsSelectionMixin;
