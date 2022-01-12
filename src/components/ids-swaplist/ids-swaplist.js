import {
  customElement,
  scss,
} from '../../core/ids-decorators';

import { attributes } from '../../core/ids-attributes';
import Base from './ids-swaplist-base';
import IdsCard from '../ids-card/ids-card';
import IdsButton from '../ids-button/ids-button';
import IdsListView from '../ids-list-view/ids-list-view';

import styles from './ids-swaplist.scss';

const DEFAULT_COUNT = 2;

/**
 * IDS SwapList Component
 * @type {IdsSwapList}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 */

@customElement('ids-swaplist')
@scss(styles)
export default class IdsSwapList extends Base {
  constructor() {
    super();
    this.swapButtons = this.container.querySelectorAll('.swap-buttons');
  }

  connectedCallback() {
    super.connectedCallback();
    this.setupTemplate();
    this.attachEventHandlers();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.COUNT
    ];
  }

  swapToNextList(button) {
    const currentCard = button.parentElement.parentElement.parentElement;
    const currentList = currentCard.querySelector('ids-list-view');
    const nextCard = currentCard.nextSibling;
    const nextList = nextCard.querySelector('ids-list-view').shadowRoot.querySelector('.ids-list-view-body');

    currentList.selectedLi.forEach((x) => {
      nextList.appendChild(x);
      x.removeAttribute(attributes.SELECTED);
    });
  }

  swapToPreviousList(button) {
    const currentCard = button.parentElement.parentElement.parentElement;
    const currentList = currentCard.querySelector('ids-list-view');
    const prevCard = currentCard.previousSibling;
    const prevList = prevCard.querySelector('ids-list-view').shadowRoot.querySelector('.ids-list-view-body');

    currentList.selectedLi.forEach((x) => {
      prevList.appendChild(x);
      x.removeAttribute(attributes.SELECTED);
    });
  }

  getAllLists() {
    return this.container.querySelectorAll('ids-list-view');
  }

  set count(value) {
    const val = parseInt(value);
    if (!Number.isNaN(val)) this.setAttribute(attributes.COUNT, val);
    else this.setAttribute(attributes.COUNT, DEFAULT_COUNT);
  }

  get count() {
    const val = this.getAttribute(attributes.COUNT);
    return parseInt(val) || DEFAULT_COUNT;
  }

  buttonTemplate(i) {
    const leftArrow = `
      <ids-button id="left-arrow-${i}" class="left-arrow">
        <span slot="text" class="audible">Swap Item Left</span>
        <ids-icon slot="icon" icon="arrow-left" size="xsmall"></ids-icon>
      </ids-button>
    `;

    const rightArrow = `
      <ids-button id="right-arrow-${i}" class="right-arrow">
        <span slot="text" class="audible">Swap Item Left</span>
        <ids-icon slot="icon" icon="arrow-right" size="xsmall"></ids-icon>
      </ids-button>
    `;
    let html = ``;
    if (i > 0 && i < this.count - 1) {
      // render left and right arrow button
      html = leftArrow + rightArrow;
    } else if (i === 0) {
      // render the right arrow button
      html = rightArrow;
    } else if (i === this.count - 1) {
      // render the left arrow button
      html = leftArrow;
    }

    return html;
  }

  listTemplate() {
    const arr = Array(this.count).fill(0);
    const arrLen = arr.length;

    const html = arr.map((v, i) => `
      <ids-card auto-fit class="${arrLen === i + 1 ? `card card-${i} card-last` : `card card-${i}`}">
        <div slot="card-header">
          <ids-text font-size="20">List #${i}</ids-text>
          <div class="swap-buttons">
            ${this.buttonTemplate(i)}
          </div>
        </div>
        <div slot="card-content">
          <ids-list-view selectable="multiple" swappable>
          </ids-list-view>
        </div>
      </ids-card>
    `.trim()).join('');

    return html;
  }

  setupTemplate() {
    this.defaultTemplate = `${this.querySelector('template')?.innerHTML || ''}`;
    this.getAllLists().forEach((l) => {
      l.defaultTemplate = this.defaultTemplate;
    });
  }

  attachEventHandlers() {
    this.swapButtons.forEach((b) => {
      this.onEvent('click', b, (e) => {
        if (e.target.classList.contains('left-arrow')) {
          this.swapToPreviousList(e.target);
        } else if (e.target.classList.contains('right-arrow')) {
          this.swapToNextList(e.target);
        }
      });
    });
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    return `
      <div class="ids-swaplist">
        ${this.listTemplate()}
      </div>
    `;
  }
}
