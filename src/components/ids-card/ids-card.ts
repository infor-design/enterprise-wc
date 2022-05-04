import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import Base from './ids-card-base';

import '../ids-checkbox/ids-checkbox';
import styles from './ids-card.scss';

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
    this.#handleEvents();
    super.connectedCallback();
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
      attributes.HEIGHT,
      attributes.HREF,
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
      const idsCheckboxElem = this.container.querySelector('ids-checkbox');
      idsCheckboxElem.onEvent('click', idsCheckboxElem, (e: Event) => {
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
   * @param  {object} e Actual event
   */
  #handleSingleSelectionChange(e: Event) {
    const cardElements = document.querySelectorAll('ids-card[selection="single"]');
    [...cardElements].forEach((elem) => elem.setAttribute(attributes.SELECTED, 'false'));
    this.setAttribute(attributes.SELECTED, true);

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
   * @param  {object} e Actual event
   */
  #handleMultipleSelectionChange(e: Event) {
    this.container.querySelector('ids-checkbox').setAttribute(attributes.CHECKED, this.selected !== 'true');
    this.setAttribute(attributes.SELECTED, this.selected !== 'true');

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
   * Set the card to auto fit to its parent size
   * @param {boolean|null} value The auto fit
   */
  set autoFit(value) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.AUTO_FIT, value);
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
      this.setAttribute('auto-height', val);
      return;
    }
    this.removeAttribute('auto-height');
  }

  get autoHeight() { return this.getAttribute(attributes.AUTO_HEIGHT); }

  /**
   * Set the card to be actionable button.
   * @param {boolean | null} value The card can act as a button.
   */
  set actionable(value) {
    const val = stringToBool(value);
    if (stringToBool(value)) {
      this.setAttribute(attributes.ACTIONABLE, val);
      return;
    }
    this.removeAttribute(attributes.ACTIONABLE);
  }

  get actionable() { return stringToBool(this.getAttribute(attributes.ACTIONABLE)); }

  /**
   * Set how the container overflows, can be hidden or auto (default)
   * @param {string | null} [value=null] css property for overflow
   */
  set overflow(value) {
    if (value === 'hidden') {
      this.container.querySelector('.ids-card-content').classList.add('overflow-hidden');
      this.setAttribute(attributes.OVERFLOW, value);
    } else {
      this.container.querySelector('.ids-card-content').classList.remove('overflow-hidden');
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
      this.container.querySelector('ids-hyperlink')?.setAttribute('href', url);
    } else {
      this.removeAttribute('href');
      this.container.querySelector('ids-hyperlink')?.removeAttribute('href');
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
    const link = this.container.querySelector('ids-hyperlink')?.container;
    if (height) {
      this.setAttribute(attributes.HEIGHT, height);
      this.container.style.height = `${height}px`;
      if (link) link.style.height = `${height}px`;
      this.querySelector('[slot]').classList.add('fixed-height');
    } else {
      this.removeAttribute(attributes.HEIGHT);
      this.container.style.height = '';
      if (link) link.container.style.height = '';
      this.querySelector('[slot]').classList.remove('fixed-height');
    }
  }

  /**
   * Get target for actionable link card
   * @returns {string} target for ids-hyperlink
   */
  get target() { return this.getAttribute('target'); }

  /**
   * Set target for actionable link card
   * @param {string} value target value for ids-hyperlink
   */
  set target(value) {
    if (value) {
      this.setAttribute('target', value);
      this.container.querySelector('ids-hyperlink')?.setAttribute('target', value);
    } else {
      this.removeAttribute('target');
      this.container.querySelector('ids-hyperlink')?.removeAttribute('target');
    }
  }
}
