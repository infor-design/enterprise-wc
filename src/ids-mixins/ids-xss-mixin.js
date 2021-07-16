import {
  sanitizeHTML,
  stripHTML,
  stripTags
} from '../ids-base/ids-xss-utils';
import { attributes } from '../ids-base/ids-attributes';

const IdsXssMixin = (superclass) => class extends superclass {
  constructor() {
    super();
    if (!this.state) {
      this.state = {};
    }
    this.state.xssIgnoredTags = '<a><b><br><br/><del><em><i><ins><mark><small><strong><sub><sup>';
  }

  static get attributes() {
    return [...super.attributes, attributes.XSS_IGNORED_TAGS];
  }

  /**
   * @returns {void}
   */
  connectedCallback() {
    super.connectedCallback?.();

    if (this.hasAttribute(attributes.XSS_IGNORED_TAGS)) {
      this.xssIgnoredTags = this.getAttribute(attributes.XSS_IGNORED_TAGS);
    }
  }

  /**
   * @param {string} val string containing a list of allowed HTML Tags
   */
  set xssIgnoredTags(val) {
    if (typeof val === 'string' && val !== this.state.xssIgnoredTags) {
      this.state.xssIgnoredTags = sanitizeHTML(val);
    }
  }

  /**
   * @returns {string} containing a list of HTML tags that will be ignored
   *   by this component when processing for XSS attacks
   */
  get xssIgnoredTags() {
    return this.state.xssIgnoredTags;
  }

  /**
   * Uses the stored list of ignored HTML tags while processing a text string for XSS attacks.
   * @param {string} str the string to check
   * @returns {string} the "fixed" string with XSS attack vectors removed
   */
  xssSanitize(str) {
    const ignored = this.xssIgnoredTags;
    if (ignored.length) {
      return stripTags(str, ignored);
    }
    return stripHTML(str);
  }
};

export default IdsXssMixin;
