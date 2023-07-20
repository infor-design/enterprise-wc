import { customElement, scss } from '../../core/ids-decorators';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import { attributes } from '../../core/ids-attributes';
import IdsElement from '../../core/ids-element';
import styles from './ids-box.scss';

/**
 * IDS Box Component
 * @type {IdsBox}
 * @inherits IdsElement
 * @part box - the box container element
 */
@customElement('ids-box')
@scss(styles)
export default class IdsBox extends IdsElement {
  constructor() {
    super();
  }

  /**
   * Invoked each time the custom element is appended into a document-connected element.
   */
  connectedCallback() {
    super.connectedCallback();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes(): Array<string> {
    return [
      ...super.attributes,
      attributes.BORDERLESS
    ];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template(): string {
    return '<div class="ids-box" part="box"><slot></slot></div>';
  }

  /**
   * Turn off the borders
   * @param {boolean|null} value Set to false to turn off borders
   */
  set borderless(value: boolean | null) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.BORDERLESS, 'true');
      this.container?.classList.add('borderless');
    } else {
      this.removeAttribute(attributes.BORDERLESS);
      this.container?.classList.remove('borderless');
    }
  }

  get borderless(): boolean | null {
    return stringToBool(this.getAttribute(attributes.BORDERLESS));
  }
}
