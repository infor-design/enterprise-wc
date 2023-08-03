/* eslint-disable no-self-assign */
import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsScrollEffectMixin from '../../mixins/ids-scroll-effect-mixin/ids-scroll-effect-mixin';
import IdsBox from '../ids-box/ids-box';

import '../ids-toolbar/ids-toolbar';
import styles from './ids-widget.scss';
import type IdsHyperlink from '../ids-hyperlink/ids-hyperlink';

const Base = IdsScrollEffectMixin(
  IdsEventsMixin(
    IdsBox
  )
);

/**
 * IDS widget Component
 * @type {IdsWidget}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsScrollEffectMixin
 * @part widget - the widget element
 * @part header - the header element
 * @part search - the search header area element
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
    this.#attachEventHandlers();

    // Setup Scroll Effect
    this.scrollArea = this.container?.querySelector<HTMLElement>('.ids-widget-content');
    this.attachScrollEvents();

    // Add classes for height adjustments
    if (this.querySelector('ids-search-field')?.parentElement?.getAttribute('slot') === 'widget-search') {
      this.scrollArea?.classList.add('has-search');
    }

    if (this.querySelector('ids-text[subtitle]')) {
      this.scrollArea?.classList.add('has-subtitle');
      this.container?.querySelector<HTMLElement>('.ids-widget-header')?.classList.add('has-subtitle');
    }

    const footer = this.querySelector('[slot="widget-footer"]');
    this.container?.classList[footer ? 'add' : 'remove']('has-footer');
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
      attributes.OVERFLOW,
      attributes.PADDING_X,
      attributes.PADDING_Y
    ];
  }

  /**
   * Handle events
   * @private
   * @returns {void}
   */
  #attachEventHandlers() {
    this.offEvent('mouseover.widget');
    this.onEvent('mouseover.widget', this, () => {
      this.querySelectorAll<HTMLButtonElement>('[system-button][hidden]').forEach((elem) => {
        elem.hidden = false;
        elem.setAttribute('ref-hidden', 'true');
      });
    });

    this.offEvent('mouseleave.widget');
    this.onEvent('mouseleave.widget', this, () => {
      this.querySelectorAll<HTMLButtonElement>('[system-button][ref-hidden]').forEach((elem) => {
        elem.hidden = true;
        elem.removeAttribute('ref-hidden');
      });
    });
  }

  /**
   * Method for widget template
   * @returns {string} html
   */
  widgetTemplate() {
    const html = `
      <div class="ids-widget" part="widget">
        <div class="ids-widget-body">
          <div class="ids-widget-header" part="header">
            <slot name="widget-header"></slot>
          </div>
          <div class="ids-widget-search" part="search">
            <slot name="widget-search"></slot>
          </div>
          <div class="ids-widget-content ${this.overflow === 'hidden' ? 'overflow-hidden' : ''}" part="content">
            <slot name="widget-content"></slot>
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
   * Set the widget to have no borders and no background color
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
  get height() { return this.getAttribute(attributes.HEIGHT) || ''; }

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
   * Set to true to hide the header and reclaim the space
   * @returns {boolean} target for ids-hyperlink
   */
  get noHeader() { return this.getAttribute(attributes.NO_HEADER); }

  set noHeader(value) {
    if (value) {
      this.setAttribute(attributes.NO_HEADER, value);
    } else {
      this.removeAttribute(attributes.NO_HEADER);
    }
  }

  /**
   * Set the x axis padding on the widget contents (in pixels)
   * @param {string | null} value The value of the paddingX attribute
   */
  set paddingX(value: string | null) {
    if (!value) {
      this.removeAttribute(attributes.PADDING_X);
      this.container?.querySelector<HTMLElement>('.ids-widget-content')?.style.removeProperty('padding-block');
    } else {
      this.setAttribute(attributes.PADDING_X, value);
      this.container?.querySelector<HTMLElement>('.ids-widget-content')?.style.setProperty('padding-block', `${value}px`);
    }
  }

  /**
   * Get the x axis padding
   * @returns {string | null} The number value that represents the paddingX of the widget contents
   */
  get paddingX(): string | null { return this.getAttribute(attributes.PADDING_X); }

  /**
   * Set the y axis padding on the widget contents (in pixels)
   * @param {string | null} value The value of the paddingY attribute
   */
  set paddingY(value: string | null) {
    if (!value) {
      this.removeAttribute(attributes.PADDING_Y);
      this.container?.querySelector<HTMLElement>('.ids-widget-content')?.style.removeProperty('padding-inline');
    } else {
      this.setAttribute(attributes.PADDING_Y, value);
      this.container?.querySelector<HTMLElement>('.ids-widget-content')?.style.setProperty('padding-inline', `${value}px`);
    }
  }

  /**
   * Get the x axis padding
   * @returns {string | null} The number value that represents the paddingY of the widget contents
   */
  get paddingY(): string | null { return this.getAttribute(attributes.PADDING_Y); }
}
