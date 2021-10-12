import {
  IdsElement,
  customElement,
  scss,
  mix,
  attributes
} from '../../core/ids-element';

import {
  IdsEventsMixin,
  IdsKeyboardMixin,
  IdsPopupOpenEventsMixin,
  IdsThemeMixin
} from '../../mixins';

import '../ids-color/ids-color';
import '../ids-trigger-field/ids-trigger-field';
import '../ids-trigger-field/ids-trigger-button';
import '../ids-popup/ids-popup';

import styles from './ids-color-picker.scss';

import { IdsStringUtils as stringUtils } from '../../utils';

/**
 * IDS ColorPicker
 * @type {IdsColorPicker}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 */
@customElement('ids-color-picker')
@scss(styles)
class IdsColorPicker extends mix(IdsElement).with(
    IdsEventsMixin,
    IdsKeyboardMixin,
    IdsPopupOpenEventsMixin,
    IdsThemeMixin
  ) {
  constructor() {
    super();
  }

  // Reference to the root
  root = this.shadowRoot

  // Reference to internal Popup
  popup = this.root.querySelector('ids-popup');

  // Reference to swatch input
  swatchInput = this.root.querySelector('.color-input')

  // Reference to the color picker input
  colorPickerInput = this.root.querySelector(this.label === '' ? '.color-input-value-no-label' : '.color-input-value')

  // Reference to the trigger color picker input
  triggerColorPickerInput = this.root.querySelector('ids-trigger-button').querySelector('input')

  // Reference to the color picker's trigger button
  triggerBtn = this.root.querySelector('ids-trigger-button');

  // Reference to the color preview
  colorPreview = this.root.querySelector('.color-preview')

  // Reference to the colors
  idsColorsArr = document.querySelectorAll('ids-color')

  connectedCallback() {
    // TODO: Need to do this and not sure why or the setters/getters do not work
    // eslint-disable-next-line no-self-assign
    this.value = this.value;
    // eslint-disable-next-line no-self-assign
    this.disabled = this.disabled;
    // eslint-disable-next-line no-self-assign
    this.advanced = this.advanced;
    // eslint-disable-next-line no-self-assign
    this.label = this.label;
    this.#attachEventHandlers();
  }

  static get attributes() {
    return [
      attributes.ADVANCED,
      attributes.DISABLED,
      attributes.LABEL,
      attributes.MODE,
      attributes.READONLY,
      attributes.ADVANCED,
      attributes.VALUE,
      attributes.VERSION
    ];
  }

  template() {
    const id = this.id || 'ids-color';
    const colorInputHtml = `<label class="color-preview">
      <input tabindex="-1" class="color-input" type="color" ${!this.advanced || this.disabled || this.readonly ? ' disabled="true"' : ''}></input>
      <ids-text audible="true">Pick Custom Color</ids-text>
    </label>`;

    const template = `
      <div class="ids-color-picker">
        <ids-trigger-field
          size="sm"
          id="${this.id}"
          tabbable="false"
          label="${this.label}"
          ${this.disabled ? ' disabled="true"' : ''}
          ${this.readonly ? ' readonly="true"' : ''}
        >
          ${colorInputHtml}
          <ids-input
            value="${this.value.toLowerCase()}"
            dirty-tracker="true"
            class="${this.label === '' ? 'color-input-value-no-label' : 'color-input-value'}"
            label="${this.label}"
            label-hidden="true"
            triggerfield="true"
            ${this.disabled ? ' disabled="true"' : ''}
            ${this.readonly ? ' readonly="true"' : ''}
          ></ids-input>
          <ids-trigger-button
            class="color-picker-trigger-btn"
            id="${id}-button" title="${id}"
            tabbable="false" ${this.disabled ? ' disabled="true"' : ''} ${this.readonly ? ' readonly="true"' : ''}
          >
            ${this.advanced ? colorInputHtml : ''}
            <ids-text audible="true">color picker trigger</ids-text>
            <ids-icon class="ids-dropdown" icon="dropdown" size="medium"></ids-icon>
          </ids-trigger-button>
        </ids-trigger-field>
        <ids-popup type="menu">
          <slot slot="content" class="color-popup"></slot>
        </ids-popup>
      </div>`;
    return template;
  }

  /**
   * Sets the value attribute
   * @param {string} v string value from the value attribute
   */
  set value(v) {
    if (v) {
      this.#updateColorPickerValues(v);
      this.setAttribute('value', v.toString().toLowerCase());
    }
  }

  get value() {
    return this.getAttribute('value') || '#b94e4e';
  }

  /**
   * Sets the readonly attribute
   * @param {string} value string value from the readonly attribute
   */
  /* istanbul ignore next */
  set readonly(value) {
    value = stringUtils.stringToBool(value);
    if (value) {
      this.setAttribute(attributes.READONLY, value.toString());
      this.triggerBtn.setAttribute(attributes.TABBABLE, false);
      return;
    }
    this.removeAttribute(attributes.READONLY);
  }

  /* istanbul ignore next */
  get readonly() {
    return stringUtils.stringToBool(this.getAttribute(attributes.READONLY)) || false;
  }

  /**
   * Sets the disabled attribute
   * @param {string} value string value from the disabled attribute
   */
  set disabled(value) {
    value = stringUtils.stringToBool(value);
    if (value) {
      this.setAttribute(attributes.DISABLED, value.toString());
      this.triggerBtn.setAttribute(attributes.TABBABLE, false);
      return;
    }
    this.removeAttribute(attributes.DISABLED);
  }

  get disabled() {
    return stringUtils.stringToBool(this.getAttribute('disabled')) || false;
  }

  /**
   * Sets the advanced attribute
   * @param {string} value string value from the advanced attribute
   */
  set advanced(value) {
    if (stringUtils.stringToBool(value)) {
      this.setAttribute('advanced', 'true');
      return;
    }
    this.removeAttribute('advanced');
  }

  get advanced() {
    return stringUtils.stringToBool(this.getAttribute('advanced')) || false;
  }

  /**
   * Sets the label attribute
   * @param {string} value string value from the label attribute
   */
  set label(value) {
    this.setAttribute('label', value.toString());
  }

  get label() {
    return this.getAttribute('label') || '';
  }

  /**
   * Handle events
   * @private
   * @returns {void}
   */
  /* istanbul ignore next */
  #attachEventHandlers() {
    /* istanbul ignore next */
    this.idsColorsArr.forEach((element) => {
      element.style.backgroundColor = element.getAttribute('hex');
    });

    /* istanbul ignore next */
    this.onEvent('click', this.container, (event) => {
      const isEditable = !stringUtils.stringToBool(this.readonly)
      && !stringUtils.stringToBool(this.disabled);

      if (!isEditable) {
        return;
      }

      const target = event.target;
      let openColorCondition = (target.classList.contains('colorpicker-icon') || target.classList.contains('ids-dropdown'));
      let openAdvanced = target.classList.contains('color-input');

      if (target.classList.contains('ids-dropdown') && this.advanced) {
        openAdvanced = true;
        openColorCondition = false;
      }

      if (!this.advanced && openAdvanced) {
        openColorCondition = true;
      }

      if (openColorCondition) {
        this.#openCloseColorpicker();
      }

      if (target.hasAttribute('hex')) {
        this.#updateColorCheck(target);
        this.setAttribute('value', target.getAttribute('hex').toLowerCase());
        this.#openCloseColorpicker();
      }
    });

    /* istanbul ignore next */
    this.onEvent('keydown', this.container, (keyup) => {
      if (keyup.key === 'Enter') {
        if (keyup.target.id === `${this.id}-button`) {
          this.#openCloseColorpicker();
        }
        if (keyup.target.hasAttribute('hex')) {
          this.setAttribute('value', keyup.target.getAttribute('hex').toLowerCase());
          this.#openCloseColorpicker();
          this.#updateColorCheck(keyup.target);
        }
      }
    });

    this.onEvent('change', this.swatchInput, /* istanbul ignore next */ () => this.setAttribute('value', this.swatchInput.value.toLowerCase()));
    this.onEvent('change', this.colorPickerInput, /* istanbul ignore next */ () => this.setAttribute('value', this.colorPickerInput.value.toLowerCase()));
    this.onEvent('change', this.triggerColorPickerInput, () => this.setAttribute('value', this.triggerColorPickerInput.value.toLowerCase()));
    this.onEvent('click', this.colorPreview, /* istanbul ignore next */ () => this.idsColorsArr.forEach((element) => element.removeAttribute('checked')));
  }

   /**
    * Update color picker value to match setected color hex value
    * @param {string} colorValue
    */
   /* istanbul ignore next */
   #updateColorPickerValues(colorValue) {
    this.swatchInput.value = colorValue;
    this.colorPreview.style.backgroundColor = colorValue;
    this.colorPickerInput.value = colorValue;
  }

   /**
    * Open/Close popup to show and hide color panel
    * @private
    */
   #openCloseColorpicker() {
     /* istanbul ignore next */
     if (!this.popup.visible) {
       this.show();
     } else {
       this.hide();
     }
   }

   /**
    * Hides the Color Picker's Popup
    * @returns {void}
    */
   /* istanbul ignore next */
   hide() {
     this.popup.visible = false;
     this.removeOpenEvents();
   }

   /**
    * Shows the Color Picker's Popup
    * @returns {void}
    */
   /* istanbul ignore next */
   show() {
     this.popup.alignTarget = this.container.querySelector('ids-icon');
     this.popup.align = 'bottom, center';
     this.popup.arrow = 'bottom';
     this.popup.y = 12;
     this.popup.visible = true;
     this.addOpenEvents();
   }

   /**
    * Inherited from the Popup Open Events Mixin.
    * Runs when a click event is propagated to the window.
    * @returns {void}
    */
   /* istanbul ignore next */
   onOutsideClick() {
     this.hide();
   }

   /**
    * Update color check to match setected color
    * @param {any} target event target
    */
   #updateColorCheck(target) {
     /* istanbul ignore next */
     const checkedColor = target.parentElement.querySelector('[checked="true"]');
     /* istanbul ignore next */
     if (checkedColor) {
       checkedColor.removeAttribute('checked');
     }
     /* istanbul ignore next */
     target.setAttribute('checked', 'true');
   }
}

export default IdsColorPicker;
