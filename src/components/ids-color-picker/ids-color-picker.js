import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

import IdsColor from '../ids-color/ids-color';
import Base from './ids-color-picker-base';

import styles from './ids-color-picker.scss';

/**
 * IDS Color Picker
 * @type {IdsColorPicker}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 */
@customElement('ids-color-picker')
@scss(styles)
export default class IdsColorPicker extends Base {
  constructor() {
    super();
  }

  // Reference to internal Popup
  popup = this.container.querySelector('ids-popup');

  // Reference to swatch input
  // (Used in the advanced color picker to retain `input[type="color"]` state)
  swatchInput = this.container.querySelector('.color-input');

  // Reference to the color picker input
  colorPickerInput = this.container.querySelector(this.label === '' ? '.color-input-value-no-label' : '.color-input-value');

  // Reference to the trigger color picker input
  triggerColorPickerInput = this.container.querySelector('ids-trigger-button').querySelector('input');

  // Reference to the color picker's trigger button
  triggerBtn = this.container.querySelector('ids-trigger-button');

  // Reference to the color preview
  colorPreview = this.container.querySelector('.color-preview');

  // Reference to the colors
  idsColorsArr = document.querySelectorAll('ids-color');

  connectedCallback() {
    super.connectedCallback?.();
    this.#updateColorPickerValues();
    this.#attachEventHandlers();
  }

  static get attributes() {
    return [
      ...super.attributes,
      attributes.ADVANCED,
    ];
  }

  template() {
    this.templateHostAttributes();
    const {
      containerClass,
      inputClass,
      inputState,
      labelHtml,
      placeholder,
      type
    } = this.templateVariables();

    // Color Picker Icon
    const colorPreviewHtml = `<label class="color-preview">
      <input tabindex="-1" class="color-input" type="color" ${!this.advanced || this.disabled || this.readonly ? ' disabled="true"' : ''}></input>
      <ids-text audible="true">Pick Custom Color</ids-text>
    </label>`;

    // Color Picker Menu Button and Menu Container
    // Contains default slot for color elements
    const colorPopupHtml = `<ids-trigger-button
      class="color-picker-trigger-btn"
      id="ids-color-picker-menu-button"
      tabbable="false" ${this.disabled ? ' disabled="true"' : ''} ${this.readonly ? ' readonly="true"' : ''}
    >
      ${this.advanced ? colorPreviewHtml : ''}
      <ids-text audible="true">color picker trigger</ids-text>
      <ids-icon class="ids-dropdown" icon="dropdown" size="medium"></ids-icon>
    </ids-trigger-button>
    <ids-popup type="menu">
      <slot slot="content" class="color-popup"></slot>
    </ids-popup>`;

    return (
      `<div id="ids-color-picker" class="ids-color-picker ids-trigger-field ${containerClass}" part="container">
        ${labelHtml}
        <div class="field-container" part="field-container">
          <slot name="trigger-start"></slot>
          ${colorPreviewHtml}
          <input
            part="input"
            id="ids-color-picker-input"
            ${type}${inputClass}${placeholder}${inputState}
            ${this.getAttribute(attributes.LABEL_HIDDEN) && this.label ? `aria-label="${this.label}"` : ''}
            ${this.hasAttribute(attributes.VALUE) ? ` value="${this.getAttribute(attributes.VALUE)}" ` : ''}
            ></input>
          ${colorPopupHtml}
          <slot name="trigger-end"></slot>
        </div>
      </div>`
    );
  }

  /**
   * @returns {Array<IdsColor>} available colors within this picker
   */
  get swatches() {
    return [...this.querySelectorAll('ids-color')];
  }

  /**
   * Sets the value attribute
   * @param {string} v string value from the value attribute
   */
  set value(v) {
    super.value = v;

    const value = super.value;
    if (value) {
      this.#updateColorPickerValues(value);
    }
  }

  get value() {
    return super.value || '#b94e4e';
  }

  /**
   * Sets the readonly attribute
   * @param {string} value string value from the readonly attribute
   */
  set readonly(value) {
    value = stringToBool(value);
    super.readonly = value;

    if (value) {
      this.colorPickerInput?.setAttribute(attributes.READONLY, '');
      this.triggerBtn.setAttribute(attributes.DISABLED, '');
      this.colorPickerInput?.removeAttribute(attributes.DISABLED);
      return;
    }
    this.colorPickerInput?.removeAttribute(attributes.READONLY);
    this.triggerBtn.removeAttribute(attributes.DISABLED);
    this.colorPickerInput?.removeAttribute(attributes.DISABLED);
  }

  get readonly() {
    return stringToBool(this.getAttribute(attributes.READONLY));
  }

  /**
   * Sets the disabled attribute
   * @param {string} value string value from the disabled attribute
   */
  set disabled(value) {
    value = stringToBool(value);
    super.disabled = value;

    if (value) {
      this.colorPickerInput?.setAttribute(attributes.DISABLED, '');
      this.triggerBtn.setAttribute(attributes.DISABLED, '');
      this.triggerBtn.setAttribute(attributes.TABBABLE, 'false');
      return;
    }
    this.colorPickerInput?.removeAttribute(attributes.DISABLED);
    this.triggerBtn.removeAttribute(attributes.DISABLED);
    this.triggerBtn.setAttribute(attributes.TABBABLE, this.tabbable);
  }

  get disabled() {
    return super.disabled;
  }

  /**
   * Sets the advanced attribute
   * @param {boolean} value true if the "advanced" color picker type should be used
   */
  set advanced(value) {
    if (stringToBool(value)) {
      this.setAttribute('advanced', 'true');
      return;
    }
    this.removeAttribute('advanced');
  }

  get advanced() {
    return stringToBool(this.getAttribute('advanced')) || false;
  }

  /**
   * Handle events
   * @private
   * @returns {void}
   */
  #attachEventHandlers() {
    this.idsColorsArr.forEach((element) => {
      element.style.backgroundColor = element.getAttribute('hex');
    });

    this.onEvent('click', this.container, (event) => {
      const isEditable = !stringToBool(this.readonly)
      && !stringToBool(this.disabled);

      if (!isEditable) {
        return;
      }

      const target = event.target;
      let openColorCondition = (target.classList.contains('colorpicker-icon') || target.classList.contains('ids-dropdown')
      || target.classList.contains('color-preview') || target.classList.contains('color-picker-trigger-btn'));
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

    this.onEvent('keydown', this.container, (keyup) => {
      if (keyup.key === 'Enter') {
        if (keyup.target.id === `ids-color-picker-menu-button`) {
          this.#openCloseColorpicker();
        }
        if (keyup.target.hasAttribute('hex')) {
          this.setAttribute('value', keyup.target.getAttribute('hex').toLowerCase());
          this.#openCloseColorpicker();
          this.#updateColorCheck(keyup.target);
        }
      }
    });

    this.onEvent('change', this.swatchInput, () => this.setAttribute('value', this.swatchInput.value.toLowerCase()));
    this.onEvent('change', this.colorPickerInput, () => this.setAttribute('value', this.colorPickerInput.value.toLowerCase()));
    this.onEvent('change', this.triggerColorPickerInput, () => this.setAttribute('value', this.triggerColorPickerInput.value.toLowerCase()));
  }

  /**
   * Update color picker value to match setected color hex value
   * @param {string} colorValue the value to update
   */
  #updateColorPickerValues(colorValue) {
    const targetColorValue = colorValue || this.#getSelectedSwatchValue();
    if (this.value !== targetColorValue) {
      this.value = targetColorValue;
      return;
    }

    this.swatchInput.value = targetColorValue;
    this.colorPreview.style.backgroundColor = targetColorValue;
  }

  /**
   * Returns the value of the currently-selected color picker swatch
   * @returns {string} containing a color value
   */
  #getSelectedSwatchValue() {
    if (this.advanced) {
      return this.swatchInput.value;
    }
    const checked = this.querySelectorAll('ids-color[checked]')?.[0];
    return checked?.hex;
  }

  /**
   * Open/Close popup to show and hide color panel
   * @private
   */
  #openCloseColorpicker() {
    if (!this.popup.visible) {
      if (this.swatches.length) {
        this.show();
      }
    } else {
      this.hide();
    }
  }

  /**
   * Hides the Color Picker's Popup
   * @returns {void}
   */
  hide() {
    this.popup.visible = false;
    this.removeOpenEvents();
  }

  /**
   * Shows the Color Picker's Popup
   * @returns {void}
   */
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
  onOutsideClick() {
    this.hide();
  }

  /**
   * Update color check to match setected color
   * @param {any} target event target
   */
  #updateColorCheck(target) {
    const checkedColor = target.parentElement.querySelector('[checked="true"]');
    if (checkedColor) {
      checkedColor.removeAttribute('checked');
    }
    target.setAttribute('checked', 'true');
  }
}
