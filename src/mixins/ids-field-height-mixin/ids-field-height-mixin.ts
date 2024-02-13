// Import Core
import { attributes } from '../../core/ids-attributes';
import { IdsConstructor } from '../../core/ids-element';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

interface FieldHeightInterface {
  onFieldHeightChange?(fieldHeight: string): void;
}

type Constraints = IdsConstructor<FieldHeightInterface>;

// Setting defaults field-heights
export const FIELD_HEIGHTS: any = {
  default: 'md',
  xxs: 'xxs',
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg'
};

// Returns a Field Height css class
const getFieldHeightClass = (val: string) => `field-height-${val}`;

/**
 * Adds "field-height" and "compact" attrbutes to a component, which enables style capability in a component,
 * linked to detection of its desired Field Height
 * @param {any} superclass Accepts a superclass and creates a new subclass from it
 * @returns {any} The extended object
 */
const IdsFieldHeightMixin = <T extends Constraints>(superclass: T) => class extends superclass {
  constructor(...args: any[]) {
    super(...args);

    if (!this.state) {
      this.state = {};
    }
    this.state.fieldHeight = FIELD_HEIGHTS.default;
    this.state.compact = stringToBool(this.getAttribute(attributes.COMPACT)) || false;
  }

  static get attributes() {
    return [
      ...(superclass as any).attributes,
      attributes.COMPACT,
      attributes.FIELD_HEIGHT,
    ];
  }

  connectedCallback() {
    super.connectedCallback();

    if (this.hasAttribute(attributes.COMPACT)) {
      this.compact = true;
    } else {
      this.container?.classList.add(getFieldHeightClass(this.fieldHeight));
    }
  }

  /**
   * @returns {string} that can be applied to an HTML element
   * inside a template for determining the current Field Height class
   */
  templateFieldHeight() {
    if (this.compact) return '';
    return this.fieldHeight ? `${getFieldHeightClass(this.fieldHeight)}` : '';
  }

  /**
   *  Set the compact height
   * @param {boolean|string} value If true will set `compact` attribute
   */
  set compact(value: boolean | string) {
    const val = stringToBool(value);
    if (val !== this.state.compact) {
      this.state.compact = val;
      if (val) {
        this.fieldHeight = '';
        this.setAttribute(attributes.COMPACT, '');
        this.container?.classList.add(attributes.COMPACT);
        this.#doFieldHeightChange(attributes.COMPACT);
      } else {
        this.removeAttribute(attributes.COMPACT);
        this.container?.classList.remove(attributes.COMPACT);
        this.#doFieldHeightChange('');
      }
    }
  }

  get compact() { return stringToBool(this.getAttribute(attributes.COMPACT)); }

  /**
   * Set the fieldHeight (height) of input
   * @param {string} value [xs, sm, md, lg]
   */
  set fieldHeight(value: string) {
    if (!value) {
      this.state.fieldHeight = FIELD_HEIGHTS.default;
      this.clearHeightClasses();
      this.container?.classList.add(getFieldHeightClass(FIELD_HEIGHTS.default));
      this.removeAttribute(attributes.FIELD_HEIGHT);
    } else {
      const fieldHeight: any = FIELD_HEIGHTS[value];
      if (fieldHeight && this.state.fieldHeight !== fieldHeight) {
        this.state.fieldHeight = fieldHeight;
        this.clearHeightClasses();
        this.compact = false;
        this.setAttribute(attributes.FIELD_HEIGHT, fieldHeight);
        this.container?.classList.add(getFieldHeightClass(fieldHeight));
        this.#doFieldHeightChange(fieldHeight);
      }
    }
  }

  get fieldHeight(): string {
    return this.getAttribute(attributes.FIELD_HEIGHT) ?? FIELD_HEIGHTS.default;
  }

  /**
   * Clears all existing field height classes defined on this component
   * @returns {void}
   */
  clearHeightClasses() {
    const heightClasses = Object.values(FIELD_HEIGHTS).map((h: any) => getFieldHeightClass(h));
    this.container?.classList.remove(...heightClasses);
  }

  /**
   * Runs optional `onFieldHeightChange` callback, if possible
   * @param {string} fieldHeight the incoming `fieldHeight` or `compact` setting
   */
  #doFieldHeightChange(fieldHeight: string) {
    if (typeof this.onFieldHeightChange === 'function') {
      this.onFieldHeightChange(fieldHeight);
    }
  }
};

export default IdsFieldHeightMixin;
