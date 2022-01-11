import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';

import Base from './ids-date-picker-base';

import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

// Supporting components
import IdsDropdown from '../ids-dropdown/ids-dropdown';
import IdsIcon from '../ids-icon/ids-icon';
import IdsPopup from '../ids-popup/ids-popup';
import IdsText from '../ids-text/ids-text';
import IdsTriggerField from '../ids-trigger-field/ids-trigger-field';
import IdsMonthView from '../ids-month-view/ids-month-view';

// Import Styles
import styles from './ids-date-picker.scss';

/**
 * IDS Date Picker Component
 * @type {IdsDatePicker}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 * @mixes IdsPopupOpenEventsMixin
 * @mixes IdsThemeMixin
 * @mixes IdsLocaleMixin
 */

@customElement('ids-date-picker')
@scss(styles)
class IdsDatePicker extends Base {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.DISABLED,
      attributes.FORMAT,
      attributes.LABEL,
      attributes.PLACEHOLDER,
      attributes.READONLY,
      attributes.VALUE,
    ];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    return `
      <div class="ids-date-picker">
        <ids-trigger-field
          label="${this.label}"
          size="${this.size}"
        >
          <ids-text audible="true" translate-text="true">UseArrow</ids-text>
          <ids-input
            type="text"
            placeholder="${this.placeholder}"
            value="${this.value}"
            disabled="${this.disabled}"
          >
          </ids-input>
          <ids-trigger-button>
            <ids-text audible="true" translate-text="true">TimepickerTriggerButton</ids-text>
            <ids-icon slot="icon" icon="clock"></ids-icon>
          </ids-trigger-button>
        </ids-trigger-field>
        <ids-popup
          type="menu"
          align-target="ids-trigger-field"
          align="bottom, left"
          arrow="bottom"
          animated="true"
        >
          <ids-month-view></ids-month-view>
        </ids-popup>
      <div>
    `;
  }
}

export default IdsMonthView;
