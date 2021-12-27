import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import Base from './ids-card-base';

import IdsCheckbox from '../ids-checkbox/ids-checkbox';
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
        <div class="ids-card-body">
          <div class="ids-card-header" part="header">
            <slot name="card-header"></slot>
          </div>
          <div class="ids-card-content ${this.overflow === 'hidden' ? 'overflow-hidden' : ''}" part="content">
            <ids-checkbox
              class="${this.selection === 'multiple' ? '' : 'hidden'}"
            ></ids-checkbox>
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
      if (this.selection === 'single') {
        const cardElements = document.querySelectorAll('ids-card[selection="single"]');
        for (const elem of cardElements) {
          elem.setAttribute(attributes.SELECTED, false);
        }

        this.setAttribute(attributes.SELECTED, true);
      } else if (this.selection === 'multiple') {
        this.#changeSelection(e);
      }
    });

    if (this.selection === 'multiple') {
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
