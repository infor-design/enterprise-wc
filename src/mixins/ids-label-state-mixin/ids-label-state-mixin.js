import { attributes } from '../../core/ids-attributes';
import { stripTags } from '../../utils/ids-xss-utils/ids-xss-utils';

/**
 * A mixin that will provide the container element of an IdsInputComponent with a class
 * reserved for changing the appearance of its associated label. The Label can be hidden entirely, or made blank.
 * @param {any} superclass Accepts a superclass and creates a new subclass from it
 * @returns {any} The extended object
 */
const IdsLabelStateMixin = (superclass) => class extends superclass {
  constructor() {
    super();

    if (!this.state) {
      this.state = {};
    }
    this.state.labelState = null;

    // Overrides the IdsElement `render` method to also include an update
    // to label style after it runs, keeping the visual state in-sync.
    this.render = () => {
      super.render();
      if (this.hasAttribute(attributes.LABEL_STATE)) {
        this.labelState = this.getAttribute(attributes.LABEL_STATE);
      }
    };
  }

  connectedCallback() {
    super.connectedCallback?.();
    this.labelState = this.getAttribute(attributes.LABEL_STATE);
  }

  static get attributes() {
    return [
      ...super.attributes,
      attributes.LABEL_STATE
    ];
  }

  /**
   * @returns {Array<string>} List of available hidden label states
   */
  labelStates = ['hidden', 'collapsed'];

  /**
   * @returns {string|null} the current state of the field label's visibility
   */
  get labelState() {
    return this.state?.labelState;
  }

  /**
   * @param {string|null} val the type of label visibility to apply to the field
   */
  set labelState(val) {
    let safeValue = null;
    if (typeof val === 'string') {
      safeValue = stripTags(val, '');
    }

    const currentValue = this.state.labelState;
    if (currentValue !== safeValue) {
      if (this.labelStates.includes(safeValue)) {
        this.setAttribute(attributes.LABEL_STATE, `${safeValue}`);
      } else {
        this.removeAttribute(attributes.LABEL_STATE);
        safeValue = null;
      }

      this.state.labelState = safeValue;
      this.#refreshLabelState(currentValue, safeValue);
    }
  }

  /**
   * Refreshes the component's label state, driven by
   * a CSS class on the WebComponent's `container` element
   *
   * @param {string} oldVariantName the variant name to "remove" from the style
   * @param {string} newVariantName the variant name to "add" to the style
   * @returns {void}
   */
  #refreshLabelState(oldVariantName, newVariantName) {
    const cl = this.container.classList;

    if (oldVariantName) cl.remove(`label-state-${oldVariantName}`);
    if (newVariantName) cl.add(`label-state-${newVariantName}`);

    this.#setlabelState(newVariantName);

    // Fire optional callback
    if (typeof this.onlabelStateChange === 'function') {
      this.onlabelStateChange(newVariantName);
    }
  }

  #setlabelState(doHide = false) {
    if (doHide) {
      this.#hideLabel();
      this.input.setAttribute('aria-label', this.label);
    } else {
      this.#showLabel();
      this.input.removeAttribute('aria-label');
    }
  }

  #hideLabel() {
    this.setLabelText('');
  }

  #showLabel() {
    const existingLabel = this.shadowRoot.querySelector('label');
    if (!existingLabel) {
      this.fieldContainer.insertAdjacentHTML('beforebegin', `<label for="${this.id}-input" class="ids-label-text">
        <ids-text part="label" label="true" color-unset>${this.label}</ids-text>
      </label>`);
    } else {
      this.setLabelText(this.label);
    }
  }
};

export default IdsLabelStateMixin;
