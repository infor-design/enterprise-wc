import {
  IdsElement,
  customElement,
  scss,
  mix,
  attributes
} from '../ids-base/ids-element';

import {
  IdsEventsMixin,
  IdsKeyboardMixin,
  IdsThemeMixin
} from '../ids-mixins';

import styles from './ids-header.scss';
import '../ids-input/ids-input';
import '../ids-toolbar/ids-toolbar';
import '../ids-button/ids-button';
import '../ids-text/ids-text';
import '../ids-breadcrumb/ids-breadcrumb';

/**
 * IDS Rating Component
 * @type {IdsHeader}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 * @mixes IdsThemeMixin
 */
@customElement('ids-header')
@scss(styles)

class IdsHeader extends mix(IdsElement).with(IdsEventsMixin, IdsKeyboardMixin, IdsThemeMixin) {
  constructor() {
    super();
  }

  connectedCallback() {
    // TODO: Need to do this and not sure why or the setters/getters do not work
    // eslint-disable-next-line no-self-assign
    this.color = this.color;
  }

  static get attributes() {
    return [attributes.MODE, attributes.VERSION, attributes.COLOR];
  }

  /**
   * Create the template for the rating contents
   * @returns {string} The template
   */
  template() {
    return `
    <header class="ids-header">
      <slot></slot>
    </header>`;
  }

  /**
   * Sets the color attribute
   * @param {string} c string value for color
   */
  set color(c) {
    this.container.style.backgroundColor = c.toString();
    this.setAttribute('color', c.toString());
  }

  get color() {
    return this.getAttribute('color') || '#0072ed';
  }
}

export default IdsHeader;
