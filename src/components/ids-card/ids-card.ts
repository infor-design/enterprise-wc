import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsThemeMixin from '../../mixins/ids-theme-mixin/ids-theme-mixin';
import IdsSelectionMixin from '../../mixins/ids-selection-mixin/ids-selection-mixin';
import IdsElement from '../../core/ids-element';
import IdsRippleMixin from '../../mixins/ids-ripple-mixin/ids-ripple-mixin';

import '../ids-checkbox/ids-checkbox';
import styles from './ids-card.scss';
import type IdsHyperlink from '../ids-hyperlink/ids-hyperlink';
import type IdsCheckbox from '../ids-checkbox/ids-checkbox';

const Base = IdsThemeMixin(
  IdsRippleMixin(
    IdsEventsMixin(
      IdsSelectionMixin(
        IdsElement
      )
    )
  )
);

/**
 * IDS Card Component
 * @type {IdsCard}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @mixes IdsRippleMixin
 * @part card - the card element
 * @part header - the header element
 * @part content - the card content element
 */
@customElement('ids-card')
@scss(styles)
export default class IdsCard extends Base {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    this.#setFooterClass();
    this.#handleEvents();
    this.#setHeight();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.ACTIONABLE,
      attributes.AUTO_FIT,
      attributes.AUTO_HEIGHT,
      attributes.BORDER_LESS,
      attributes.HEIGHT,
      attributes.HREF,
      attributes.NO_HEADER,
      attributes.OVERFLOW,
      attributes.TARGET
    ];
  }

  /**
   * Method for card template
   * @returns {string} html
   */
  cardTemplate() {
    const html = `
      <div class="ids-card" part="card">
        <div class="ids-card-body">
          <div class="ids-card-header" part="header">
            <slot name="card-header"></slot>
          </div>
          <div class="ids-card-content ${this.selection === 'multiple' ? 'has-checkbox' : ''} ${this.overflow === 'hidden' ? 'overflow-hidden' : ''}" part="content">
            <slot name="card-content"></slot>
          </div>
          <div class="ids-card-checkbox ${this.selection === 'multiple' ? '' : 'hidden'}">
            <ids-checkbox></ids-checkbox>
          </div>
          <div class="ids-card-footer" part="footer">
            <slot name="card-footer"></slot>
          </div>
        </div>
      </div>
    `;

    return html;
  }

  /**
   * Method for actionable button card template
   * @returns {string} html
   */
  actionableButtonTemplate() {
    const html = `
      <div class="ids-card" part="card">
        <ids-button>
          <slot name="card-content"></slot>
        </ids-button>
      </div>
    `;

    return html;
  }

  /**
   * Method for actionable link card template
   * @returns {string} html
   */
  actionableLinkTemplate() {
    const html = `
      <div class="ids-card" part="card">
        <ids-hyperlink href="${this.href}" target="${this.target}">
          <slot name="card-content"></slot>
        </ids-hyperlink>
      </div>
    `;

    return html;
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    if (this.actionable) {
      return this.href ? this.actionableLinkTemplate() : this.actionableButtonTemplate();
    }

    return this.cardTemplate();
  }

  /**
   * Establish Internal Event Handlers
   * @private
   * @returns {object} The object for chaining.
   */
  #handleEvents() {
    this.onEvent('click', this, this.#handleSelectionChange);

    if (this.selection === 'multiple') {
      const idsCheckboxElem = this.container?.querySelector<IdsCheckbox>('ids-checkbox');
      idsCheckboxElem?.onEvent('click', idsCheckboxElem, (e: Event) => {
        e.stopPropagation();
        e.preventDefault();
        this.#handleMultipleSelectionChange(e);
      });
    }

    // If actionable link, setup ripple
    if (this.actionable && this.href) {
      this.setupRipple();
    }

    return this;
  }

  /**
   * Set css class for footer
   * @private
   * @returns {void}
   */
  #setFooterClass(): void {
    const footerSlot = this.querySelector('[slot="card-footer"]');
    this.container?.classList[footerSlot ? 'add' : 'remove']('has-footer');
    if (footerSlot) {
      const noPadding = footerSlot.hasAttribute(attributes.NO_PADDING);
      const footer = this.container?.querySelector('.ids-card-footer');
      footer?.classList[noPadding ? 'add' : 'remove'](attributes.NO_PADDING);
    }
  }

  /**
   * Handle single/multiple selection change
   * @private
   * @param {object} e Actual event
   */
  #handleSelectionChange(e: Event) {
    if (this.selection === 'single') {
      this.#handleSingleSelectionChange(e);
    } else if (this.selection === 'multiple') {
      this.#handleMultipleSelectionChange(e);
    }
  }

  /**
   * Change single selection for cards
   * @private
   * @param {object} e Actual event
   */
  #handleSingleSelectionChange(e: Event) {
    const cardElements = document.querySelectorAll('ids-card[selection="single"]');
    [...cardElements].forEach((elem) => elem.setAttribute(attributes.SELECTED, 'false'));
    this.setAttribute(attributes.SELECTED, 'true');

    this.triggerEvent('selectionchanged', this, {
      detail: {
        elem: this,
        nativeEvent: e,
        selected: this.selected,
        selection: this.selection,
      }
    });
  }

  /**
   * Change multiple selection for cards
   * @private
   * @param {object} e Actual event
   */
  #handleMultipleSelectionChange(e: Event) {
    this.container?.querySelector('ids-checkbox')?.setAttribute(attributes.CHECKED, String(this.selected !== 'true'));
    this.setAttribute(attributes.SELECTED, String(this.selected !== 'true'));

    this.triggerEvent('selectionchanged', this, {
      detail: {
        elem: this,
        nativeEvent: e,
        selected: this.selected,
        selection: this.selection,
      }
    });
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
    this.container = this.shadowRoot.querySelector<HTMLElement>('.ids-card');

    if (this.height) {
      const link = this.container?.querySelector<IdsHyperlink>('ids-hyperlink')?.container;
      this.setAttribute(attributes.HEIGHT, this.height);
      this.container?.style.setProperty('height', `${this.height}px`);
      link?.style.setProperty('height', `${this.height}px`);
      this.querySelector('[slot]')?.classList.add('fixed-height');
    }

    if (this.actionable && this.href) {
      this.setupRipple();
    }
  }

  /**
   * Set the card to auto fit to its parent size
   * @param {boolean|null} value The auto fit
   */
  set autoFit(value) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.AUTO_FIT, String(value));
      return;
    }
    this.removeAttribute(attributes.AUTO_FIT);
  }

  get autoFit() { return stringToBool(this.getAttribute(attributes.AUTO_FIT)); }

  /**
   * Set the card to auto height
   * @param {boolean|null} value The height can be auto to contents
   */
  set autoHeight(value) {
    const val = stringToBool(value);
    if (stringToBool(value)) {
      this.setAttribute('auto-height', String(val));
      return;
    }
    this.removeAttribute('auto-height');
  }

  get autoHeight() { return this.getAttribute(attributes.AUTO_HEIGHT); }

  /**
   * Set the card to borderless
   * @param {boolean|null} value If card should be borderless or not
   */
  set borderLess(value) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.BORDER_LESS, '');
    } else {
      this.removeAttribute(attributes.BORDER_LESS);
    }
  }

  get borderLess() { return this.hasAttribute(attributes.BORDER_LESS); }

  /**
   * Set the card to be actionable button.
   * @param {boolean | null} value The card can act as a button.
   */
  set actionable(value) {
    const val = stringToBool(value);
    if (stringToBool(value)) {
      this.setAttribute(attributes.ACTIONABLE, String(val));
      if (this.container) this.redraw();
      return;
    }
    this.removeAttribute(attributes.ACTIONABLE);
    if (this.container) this.redraw();
  }

  get actionable() { return stringToBool(this.getAttribute(attributes.ACTIONABLE)); }

  /**
   * Set how the container overflows, can be hidden or auto (default)
   * @param {string | null} [value=null] css property for overflow
   */
  set overflow(value) {
    if (value === 'hidden') {
      this.container?.querySelector('.ids-card-content')?.classList.add('overflow-hidden');
      this.setAttribute(attributes.OVERFLOW, value);
    } else {
      this.container?.querySelector('.ids-card-content')?.classList.remove('overflow-hidden');
      this.removeAttribute(attributes.OVERFLOW);
    }
  }

  get overflow() { return this.getAttribute(attributes.OVERFLOW); }

  /**
   * Get href for actionable link card
   * @returns {string} href for ids-hyperlink
   */
  get href() { return this.getAttribute('href'); }

  /**
   * Set href for actionable link card
   * @param {string} url href for ids-hyperlink
   */
  set href(url) {
    if (url) {
      this.setAttribute('href', url);
      if (this.container) {
        this.redraw();
        this.container.querySelector('ids-hyperlink')?.setAttribute('href', url);
      }
    } else {
      this.removeAttribute('href');
      if (this.container) {
        this.redraw();
      }
    }
  }

  /**
   * Set a specific height and center the card
   * @returns {string} href for ids-hyperlink
   */
  get height() { return this.getAttribute(attributes.HEIGHT); }

  /**
   * Set a height and center the card
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
   * Get target for actionable link card
   * @returns {string} target for ids-hyperlink
   */
  get target() { return this.getAttribute('target'); }

  /**
   * Set target for an actionable link card
   * @param {string} value target value for ids-hyperlink
   */
  set target(value) {
    if (value) {
      this.setAttribute('target', value);
      if (this.container) {
        this.container.querySelector('ids-hyperlink')?.setAttribute('target', value);
        this.redraw();
      }
    } else {
      this.removeAttribute('target');
      if (this.container) {
        this.redraw();
      }
    }
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
