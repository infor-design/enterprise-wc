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
import IdsInput from '../ids-input/ids-input';
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

class IdsHeader extends mix(IdsElement).with(
    IdsEventsMixin,
    IdsKeyboardMixin,
    IdsThemeMixin
  ) {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback?.();

    if (this.hasAttribute('color')) {
      this.color = this.getAttribute('color');
    }
  }

  static get attributes() {
    return [
      ...super.attributes,
      attributes.COLOR,
      attributes.MODE,
      attributes.VERSION
    ];
  }

  /**
   * Create the template for the rating contents
   * @returns {string} The template
   */
  template() {
    return `
    <div class="ids-header">
      <slot></slot>
    </div>`;
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
