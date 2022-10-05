import { customElement, scss } from '../../core/ids-decorators';
import Base from './ids-date-picker-popup-base';

import '../ids-button/ids-button';
import '../ids-month-view/ids-month-view';
import '../ids-text/ids-text';

import styles from './ids-date-picker-popup.scss';

/**
 * IDS Date Picker Popup Component
 * @type {IdsDatePickerPopup}
 * @inherits IdsPopup
 */
@customElement('ids-date-picker-popup')
@scss(styles)
class IdsDatePickerPopup extends Base {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    this.#setPickerPopupDefaults();
  }

  #setPickerPopupDefaults() {
    this.align = 'bottom, left';
    this.arrow = 'bottom';
    this.type = 'menu';
    this.tabIndex = '-1';
    this.y = 12;
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template(): string {
    const animatedClass = this.animated ? ' animated' : '';

    return `<div class="ids-popup${animatedClass}" part="popup">
      <div class="arrow" part="arrow"></div>
      <div class="content-wrapper">
        <slot name="content">
          <ids-month-view
            compact="true"
            is-date-picker="true"
            show-today=${this.showToday}
            first-day-of-week="${this.firstDayOfWeek}"
            year="${this.year}"
            month="${this.month}"
            day="${this.day}"
            use-range="${this.useRange}"
          ></ids-month-view>
          <div class="popup-footer" part="footer">
            <ids-button class="popup-btn popup-btn-cancel" hidden>
              <ids-text translate-text="true" font-weight="bold" part="btn-cancel">Cancel</ids-text>
            </ids-button>
            <ids-button class="popup-btn popup-btn-clear" hidden part="btn-clear">
              <ids-text translate-text="true" font-weight="bold">Clear</ids-text>
            </ids-button>
            <ids-button class="popup-btn popup-btn-apply" ${this.useRange ? 'disabled' : 'hidden'} part="btn-apply">
              <ids-text translate-text="true" font-weight="bold">Apply</ids-text>
            </ids-button>
          </div>
        </slot>
      </div>
    </div>`;
  }
}

export default IdsDatePickerPopup;
