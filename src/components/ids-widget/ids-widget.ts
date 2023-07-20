import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsSelectionMixin from '../../mixins/ids-selection-mixin/ids-selection-mixin';
import IdsBox from '../ids-box/ids-box';
import IdsRippleMixin from '../../mixins/ids-ripple-mixin/ids-ripple-mixin';

import '../ids-hyperlink/ids-hyperlink';
import '../ids-checkbox/ids-checkbox';
import styles from './ids-widget.scss';
import type IdsHyperlink from '../ids-hyperlink/ids-hyperlink';

const Base = IdsRippleMixin(
  IdsEventsMixin(
    IdsSelectionMixin(
      IdsBox
    )
  )
);

/**
 * IDS widget Component
 * @type {IdsWidget}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsSelectionMixin
 * @mixes IdsRippleMixin
 * @part widget - the widget element
 * @part header - the header element
 * @part content - the widget content element
 */
@customElement('ids-widget')
@scss(styles)
export default class IdsWidget extends Base {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    this.#setHeight();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.BORDERLESS,
      attributes.HEIGHT,
      attributes.NO_HEADER,
      attributes.OVERFLOW
    ];
  }

  /**
   * Method for widget template
   * @returns {string} html
   */
  widgetTemplate() {
    const html = `
      <div class="ids-widget ids-box" part="widget">
        <div class="ids-widget-body">
          <div class="ids-widget-header" part="header">
            <slot name="widget-header"></slot>
          </div>
          <div class="ids-widget-content ${this.selection === 'multiple' ? 'has-checkbox' : ''} ${this.overflow === 'hidden' ? 'overflow-hidden' : ''}" part="content">
            <slot name="widget-content"></slot>
          </div>
          <div class="ids-widget-checkbox ${this.selection === 'multiple' ? '' : 'hidden'}">
            <ids-checkbox></ids-checkbox>
          </div>
          <div class="ids-widget-footer" part="footer">
            <slot name="widget-footer"></slot>
          </div>
        </div>
      </div>
    `;

    return html;
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    return this.widgetTemplate();
  }

  /**
   * Redraw the template when some properties change.
   */
  redraw() {
    if (!this.shadowRoot || !this.container) return;

    const template = document.createElement('template');
    const html = this.template();

    // Render and append styles
    this.shadowRoot.innerHTML = '';
    this.hasStyles = false;
    this.appendStyles();
    template.innerHTML = html;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.container = this.shadowRoot.querySelector<HTMLElement>('.ids-widget');

    if (this.height) {
      const link = this.container?.querySelector<IdsHyperlink>('ids-hyperlink')?.container;
      this.setAttribute(attributes.HEIGHT, this.height);
      this.container?.style.setProperty('height', `${this.height}px`);
      link?.style.setProperty('height', `${this.height}px`);
      this.querySelector('[slot]')?.classList.add('fixed-height');
    }
  }

  /**
   * Set the widget to borderless
   * @param {boolean|null} value If widget should be borderless or not
   */
  set borderless(value) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.BORDERLESS, '');
    } else {
      this.removeAttribute(attributes.BORDERLESS);
    }
  }

  get borderless() { return this.hasAttribute(attributes.BORDERLESS); }

  /**
   * Set how the container overflows, can be hidden or auto (default)
   * @param {string | null} [value=null] css property for overflow
   */
  set overflow(value) {
    if (value === 'hidden') {
      this.container?.querySelector('.ids-widget-content')?.classList.add('overflow-hidden');
      this.setAttribute(attributes.OVERFLOW, value);
    } else {
      this.container?.querySelector('.ids-widget-content')?.classList.remove('overflow-hidden');
      this.removeAttribute(attributes.OVERFLOW);
    }
  }

  get overflow() { return this.getAttribute(attributes.OVERFLOW); }

  /**
   * Set a specific height and center the widget
   * @returns {string} href for ids-hyperlink
   */
  get height() { return this.getAttribute(attributes.HEIGHT); }

  /**
   * Set a height and center the widget
   * @param {number} height height in pixels
   */
  set height(height) {
    if (height) {
      this.setAttribute(attributes.HEIGHT, height);
    } else {
      this.removeAttribute(attributes.HEIGHT);
    }

    this.#setHeight();
  }

  #setHeight() {
    const linkEl = this.container?.querySelector<IdsHyperlink>('ids-hyperlink')?.container;

    this.container?.style?.setProperty('height', this.height ? `${this.height}px` : '');
    linkEl?.style?.setProperty('height', this.height ? `${this.height}px` : '');
    this.querySelector('[slot]')?.classList.toggle('fixed-height', !!this.height);
  }

  /**
   * Set to true to hide the header space
   * @returns {string} target for ids-hyperlink
   */
  get noHeader() { return this.getAttribute(attributes.NO_HEADER); }

  set noHeader(value) {
    if (value) {
      this.setAttribute(attributes.NO_HEADER, value);
    } else {
      this.removeAttribute(attributes.NO_HEADER);
    }
  }
}
