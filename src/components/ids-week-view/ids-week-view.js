import {
  IdsElement,
  customElement,
  scss,
  attributes,
  mix
} from '../../core';

// Import Utils
import { IdsStringUtils as stringUtils } from '../../utils';

// Supporting components
import IdsIcon from '../ids-icon';
import IdsText from '../ids-text';

// Import Mixins
import {
  IdsThemeMixin,
  IdsLocaleMixin,
  IdsEventsMixin
} from '../../mixins';

// Import Styles
import styles from './ids-week-view.scss';

/**
 * IDS Week View Component
 * @type {IdsWeekView}
 * @inherits IdsElement
 * @mixes IdsLocaleMixin
 * @mixes IdsThemeMixin
 */
@customElement('ids-week-view')
@scss(styles)
class IdsWeekView extends mix(IdsElement).with(IdsLocaleMixin, IdsEventsMixin, IdsThemeMixin) {
  constructor() {
    super();
  }

  connectedCallback() {
    this.attachEventHandlers();
    super.connectedCallback();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.END_DATE,
      attributes.FIRST_DAY_OF_WEEK,
      attributes.SHOW_TODAY,
      attributes.START_DATE
    ];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    return '<div class="ids-week-view"></div>';
  }

  /**
   * Establish internal event handlers
   * @returns {object} The object for chaining
   */
  attachEventHandlers() {
    // Respond to parent changing language
    this.offEvent('languagechange.week-view-container');
    this.onEvent('languagechange.week-view-container', this.closest('ids-container'), async (e) => {
      await this.setLanguage(e.detail.language.name);
    });

    // Respond to the element changing language
    this.offEvent('languagechange.week-view');
    this.onEvent('languagechange.week-view', this, async (e) => {
      await this.locale.setLanguage(e.detail.language.name);

      this.#render();
    });

    return this;
  }

  #render() {
    const layout = `<div class="week-view-container">
      <table class="week-view-table">
        <thead class="week-view-table-header">
          <tr>
            <th>
              <div class="week-view-header-wrapper">
                <span class="audible">${this.locale.translate('Hour')}</span>
              </div>
              <div class="week-view-all-day-wrapper">
                <ids-text font-size="12">${this.locale.translate('AllDay')}</ids-text>
              </div>
            </th>
            ${Array.from({ length: 7 }).map((_, index) => `
              <th>
                <div class="week-view-header-wrapper${index === 1 ? ' is-today' : ''}">
                  <ids-text font-size="20"${index === 1 ? ' font-weight="bold"' : ''}>7</ids-text>
                  <ids-text font-size="16"${index === 1 ? ' font-weight="bold"' : ''}>Sun</ids-text>
                </div>
                <div class="week-view-all-day-wrapper"></div>
              </th>
            `).join('')}
          </tr>
        </thead>
        <tbody>
          ${Array.from({ length: 12 }).map(() => `
            <tr class="week-view-hour-row">
              <td>
                <div class="week-view-cell-wrapper"><ids-text font-size="12">7:00 AM</ids-text></div>
              </td>
              ${Array.from({ length: 7 }).map(() => `
                <td>
                  <div class="week-view-cell-wrapper"></div>
                </td>
              `).join('')}
            </tr>
            <tr class="week-view-half-hour-row">
              <td>
                <div class="week-view-cell-wrapper"></div>
              </td>
              ${Array.from({ length: 7 }).map(() => `
                <td>
                  <div class="week-view-cell-wrapper"></div>
                </td>
              `).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>`;

    this.container.querySelector('.week-view-container')?.remove();
    this.container.insertAdjacentHTML('beforeend', layout);
  }
}

export default IdsWeekView;
