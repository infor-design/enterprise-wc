import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsElement from '../../core/ids-element';

import styles from './ids-badge.scss';

const Base = IdsEventsMixin(
  IdsElement
);

/**
 * IDS Badge Component
 * @type {IdsBadge}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @part badge - the badge element
 */
@customElement('ids-badge')
@scss(styles)
export default class IdsBadge extends Base {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.color) this.color = this.getAttribute('color');
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attribute in an array
   */
  static get attributes(): string[] {
    return [
      attributes.COLOR,
      attributes.DISABLED,
      attributes.SHAPE
    ];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The Template
   */
  template() {
    return `<span class="ids-badge ${this.shape}" part="badge"><slot></slot></span>`;
  }

  /**
   * Return the badge shape between normal (default) and round
   * @returns {string} The path data
   */
  get shape(): string {
    return this.getAttribute('shape') || 'normal';
  }

  /**
   * Set the badge shape between normal (default) and round
   * @param {string} value The Badge Shape
   */
  set shape(value: string | null) {
    if (value) {
      this.setAttribute('shape', value.toString());
    } else {
      this.removeAttribute('shape');
    }
    this.container?.classList.remove('normal', 'round');
    this.container?.classList.add(this.shape);
  }

  /**
   * Return the badge color
   * @returns {string | null} the path data
   */
  get color(): string | null {
    return this.getAttribute('color');
  }

  /**
   * Set the color
   * @param {string | null} value The Badge Color [base, error, info, success and warning]
   */
  set color(value: string | null) {
    if (value) {
      this.setAttribute('color', value);
      this.container?.setAttribute('color', value);
      if (value === 'error' || value === 'info' || value === 'warning') {
        this.container?.classList.add('ids-white');
      }
    } else {
      this.removeAttribute('color');
      if (this.container) {
        this.container?.removeAttribute('color');
        this.container.style.backgroundColor = '';
        this.container.style.borderColor = '';
        this.container.style.color = '';
        this.container.style.position = '';
      }
    }
  }

  /**
   * Sets the disabled state
   * @param {boolean | string} value The value
   */
  set disabled(value: boolean | string) {
    if (stringToBool(value)) this.setAttribute(attributes.DISABLED, '');
    else this.removeAttribute(attributes.DISABLED);
  }

  get disabled(): boolean {
    return this.hasAttribute(attributes.DISABLED);
  }
}
