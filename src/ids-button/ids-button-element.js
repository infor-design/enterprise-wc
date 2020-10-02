import {
  IdsElement,
  customElement,
  mixin,
  scss
} from '../ids-base/ids-element';
import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import { IdsStringUtilsMixin } from '../ids-base/ids-string-utils-mixin';
import { props } from '../ids-base/ids-constants';
import styles from './ids-button.scss';

// Button Styles
const BUTTON_TYPES = [
  'default',
  'primary',
  'secondary',
  'tertiary',
  'destructive'
];

// Default Button state values
const BUTTON_DEFAULTS = {
  cssClasses: [],
  disabled: false,
  focusable: true,
  type: BUTTON_TYPES[0]
};

/**
 * IDS Button Component
 */
@customElement('ids-button')
@scss(styles)
@mixin(IdsEventsMixin)
class IdsButtonElement extends IdsElement {
  constructor() {
    super();
    this.state = {};
    Object.keys(BUTTON_DEFAULTS).forEach((prop) => {
      this.state[prop] = BUTTON_DEFAULTS[prop];
    });
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    let cssClass = '';
    let disabled = '';
    let tabindex = 'tabindex="0"';
    let type = '';
    if (this.state?.cssClass) {
      cssClass = ` ${['ids-button']
        .concat(this.cssClass)
        .concat(this.state.type !== 'default' ? this.state.type : '')
        .join(' ')}`;
    }
    if (this.state?.disabled) {
      disabled = ` disabled`;
    }
    if (this.state?.focusable) {
      tabindex = `${this.state.focusable ? 0 : -1}`;
    }
    if (this.state && this.state?.type !== 'default') {
      type = ` btn-${this.state.type}`;
    }

    return `<button class="ids-button${type}${cssClass}" ${tabindex}${disabled}>
      <slot></slot>
    </button>`;
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return [
      props.CSS_CLASS,
      props.DISABLED,
      props.FOCUSABLE,
      'id',
      'type'
    ];
  }

  /**
   * @readonly
   * @returns {HTMLButtonElement} reference to the true button element used in the Shadow Root
   */
  get button() {
    return this.shadowRoot.querySelector('button');
  }

  /**
   * @param {Array|string} val containing CSS classes that will be applied to the button
   * Strings will be split into an array and separated by whitespace.
   */
  set cssClass(val) {
    if (Array.isArray(val)) {
      this.state.cssClasses = val;
      this.setAttribute('css-class', val.join(' '));
      return;
    }
    if (typeof val === 'string') {
      this.state.cssClasses = val.split(' ');
      this.setAttribute('css-class', val);
    }
  }

  /**
   * @returns {Array} containing extra CSS classes that are applied to the button
   */
  get cssClass() {
    return this.state.cssClasses;
  }

  /**
   * Pass a disabled attribute along to the inner Button element
   * @param {boolean} val true if the button will be disabled
   */
  set disabled(val) {
    const trueVal = val === true;
    this.state.disabled = trueVal;
    if (this.button) {
      this.button.disabled = trueVal;
    }
    if (trueVal) {
      this.setAttribute('disabled', true);
      return;
    }
    this.removeAttribute('disabled');
  }

  /**
   * Retrieve the disabled state of the inner button element
   * @returns {boolean} the inner button's disabled state
   */
  get disabled() {
    return this.state.disabled;
  }

  /**
   * Controls the ability of the inner button to become focused
   * @param {boolean} val true if the button will be focusable
   */
  set focusable(val) {
    const trueVal = val === true;
    this.state.focusable = trueVal;
    if (this.button) {
      this.button.tabIndex = trueVal ? 0 : -1;
    }
    this.setAttribute('focusable', this.state.focusable);
  }

  /**
   * @returns {boolean} true if the inner button's tabIndex is zero (focusable)
   */
  get focusable() {
    return this.state.focusable;
  }

  /**
   * @param {string} val a valid
   */
  set type(val) {
    if (!val || BUTTON_TYPES.indexOf(val) === -1) {
      this.removeAttribute('type');
      this.state.type = BUTTON_TYPES[0];
    } else {
      this.setAttribute('type', val);
      if (this.state.type !== val) {
        this.state.type = val;
      }
    }
    this.setTypeClass(val);
  }

  /**
   * @returns {string} the currently set type
   */
  get type() {
    return this.state.type;
  }

  /**
   * Sets the correct type class on the Shadow button.
   * @param {string} val desired type class
   */
  setTypeClass(val) {
    BUTTON_TYPES.forEach((type) => {
      const typeClassName = `btn-${type}`;
      if (val === type) {
        if (type !== 'default' && !this.button.classList.contains(typeClassName)) {
          this.button.classList.add(typeClassName);
        }
        return;
      }
      if (this.button.classList.contains(typeClassName)) {
        this.button.classList.remove(typeClassName);
      }
    });
  }
}

export default IdsButtonElement;
