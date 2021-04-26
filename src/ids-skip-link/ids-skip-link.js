import {
  IdsElement,
  customElement,
  scss,
  props,
  mix
} from '../ids-base/ids-element';

// Import Mixins
import { IdsThemeMixin } from '../ids-base/ids-theme-mixin';
import { IdsEventsMixin } from '../ids-base/ids-events-mixin';

import styles from './ids-skip-link.scss';
import IdsHyperlink from '../ids-hyperlink/ids-hyperlink';

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
class IdsSkiplink extends mix(IdsElement).with(IdsEventsMixin, IdsThemeMixin) {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return [
      props.HREF,
      props.MODE,
      props.VERSION
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
      this.setAttribute(props.HREF, value);
      this.container.setAttribute(props.HREF, value);
      return;
    }
    this.removeAttribute(props.HREF);
    this.container.removeAttribute(props.HREF);
  }

  get href() { return this.getAttribute(props.HREF); }
}

export default IdsSkiplink;
