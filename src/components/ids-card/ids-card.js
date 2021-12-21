import {
  IdsElement,
  customElement,
  scss,
  mix,
  attributes
} from '../../core';

import { IdsEventsMixin, IdsThemeMixin } from '../../mixins';
import { IdsSelectionMixin } from '../../mixins/ids-selection-mixin';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

import IdsCheckbox from '../ids-checkbox';
import styles from './ids-card.scss';

/**
 * IDS Card Component
 * @type {IdsCard}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @part card - the card element
 * @part header - the header element
 * @part content - the card content element
 */
@customElement('ids-card')
@scss(styles)
export default class IdsCard extends mix(IdsElement).with(IdsEventsMixin, IdsThemeMixin, IdsSelectionMixin) {
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
      attributes.AUTO_FIT,
      attributes.AUTO_HEIGHT,
      attributes.OVERFLOW
    ];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    return `
      <div class="ids-card" part="card">
        <ids-checkbox
          class="${this.cardSelection === 'multiple' ? '' : 'hidden'}"
        ></ids-checkbox>
        <div class="ids-card-body">
          <div class="ids-card-header" part="header">
            <slot name="card-header"></slot>
          </div>
          <div class="ids-card-content ${this.overflow === 'hidden' ? 'overflow-hidden' : ''}" part="content">
            <slot name="card-content"></slot>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Establish Internal Event Handlers
   * @private
   * @returns {object} The object for chaining.
   */
  #handleEvents() {
    this.onEvent('click', this, (e) => {
      if (this.cardSelection === 'single') {
        const cardElements = document.querySelectorAll('ids-card[card-selection="single"]');
        for (const elem of cardElements) {
          elem.setAttribute(attributes.CARD_SELECTED, false);
        }

        this.setAttribute(attributes.CARD_SELECTED, true);
      } else if (this.cardSelection === 'multiple') {
        this.#changeSelection(e);
      }
    });

    if (this.cardSelection === 'multiple') {
      const idsCheckboxElem = this.container.querySelector('ids-checkbox');
      idsCheckboxElem.onEvent('click', idsCheckboxElem, (e) => {
        e.stopPropagation();
        e.preventDefault();
        this.#changeSelection(e);
      });
    }

    return this;
  }

  #changeSelection(e) {
    this.container.querySelector('ids-checkbox').setAttribute(attributes.CHECKED, this.cardSelected !== 'true');
    this.setAttribute(attributes.CARD_SELECTED, this.cardSelected !== 'true');

    this.triggerEvent('selectionchanged', this, {
      detail: {
        elem: this,
        nativeEvent: e,
        selected: this.cardSelected,
        selection: this.cardSelection,
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
}
