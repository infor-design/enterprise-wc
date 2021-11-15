import { IdsElement, customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import IdsHyperlink from '../ids-hyperlink/ids-hyperlink';
import Base from './ids-skip-link-base';
import styles from './ids-skip-link.scss';

/**
 * IDS IdsSkipLink Component
 * @type {IdsSkiplink}
 * @inherits IdsElement
 * @mixes IdsThemeMixin
 * @mixes IdsEventsMixin
 * @part link - the link element
 */
@customElement('ids-skip-link')
@scss(styles)
export default class IdsSkiplink extends Base {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      attributes.HREF,
      attributes.MODE,
      attributes.VERSION
    ];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    return `<a href="${this.href}" class="ids-skip-link ids-hyperlink" part="link"><slot></slot></a>`;
  }

  /**
   * Set the link href
   * @param {string} value Set the link's href to some link
   */
  set href(value) {
    if (value) {
      this.setAttribute(attributes.HREF, value);
      this.container.setAttribute(attributes.HREF, value);
      return;
    }
    this.removeAttribute(attributes.HREF);
    this.container.removeAttribute(attributes.HREF);
  }

  get href() { return this.getAttribute(attributes.HREF); }
}
