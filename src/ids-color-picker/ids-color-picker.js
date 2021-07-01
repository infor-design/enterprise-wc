import {
  IdsElement,
  customElement,
  scss,
  mix,
  attributes
} from '../ids-base/ids-element';
import {
  IdsEventsMixin,
  IdsKeyboardMixin,
  IdsThemeMixin
} from '../ids-mixins';

import '../ids-color/ids-color';
import '../ids-trigger-field/ids-trigger-field';
import '../ids-trigger-field/ids-trigger-button';
import '../ids-popup/ids-popup';
import styles from './ids-color-picker.scss';

/**
 * IDS ColorPicker
 * @type {IdsColorPicker}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 */
@customElement('ids-color-picker')
@scss(styles)
class IdsColorPicker extends mix(IdsElement).with(IdsEventsMixin, IdsKeyboardMixin, IdsThemeMixin) {
  constructor() {
    super();
  }

  // Reference to the root
  root = this.shadowRoot

  // Reference to swatch input
  swatchInput = this.root.querySelector('.color-input')

  // Reference to the color picker input
  colorPickerInput = this.root.querySelector(/* istanbul ignore next */ this.label === '' ? '.color-input-value-no-label' : '.color-input-value')

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
    this.swatch = this.swatch;
    // eslint-disable-next-line no-self-assign
    this.label = this.label;
    this.#handleEvents();

    // TODO: Do this a cleaner way to lay the label out
    this.inputLabel = this.colorPickerInput?.shadowRoot?.querySelector('label');
    if (this.inputLabel) {
      /* istanbul ignore next */
      this.inputLabel.style.marginLeft = '-38px';
    }
  }

  static get attributes() {
    return [attributes.DISABLED, attributes.LABEL, attributes.MODE, 'swatch', attributes.READONLY, attributes.VALUE, attributes.VERSION];
  }

  template() {
    const id = this.id || 'ids-color';
    const template = `
      <div class="ids-color-picker">
        <ids-trigger-field tabbable="false">
          <label class="color-preview">
            <ids-input tabindex="-1" class="color-input" type="color" disabled="${this.disabled}"></ids-input>
            <ids-text audible="true">Pick Custom Color</ids-text>
          </label>
          <ids-input size="sm" dirty-tracker="true" disabled="${this.disabled}" class="${this.label === '' ? 'color-input-value-no-label' : 'color-input-value'}" label="${this.label}"></ids-input>
          <ids-trigger-button id="${id}-button" title="${id}">
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
    this.#updateColorPickerValues(v);
    this.setAttribute('value', v.toString().toLowerCase());
  }

  get value() {
    return this.getAttribute('value') || '#B94E4E';
  }

  /**
   * Sets the readonly attribute
   * @param {string} value string value from the readonly attribute
   */
  /* istanbul ignore next */
  set readonly(value) {
    this.setAttribute('readonly', value.toString());
  }

  /* istanbul ignore next */
  get readonly() {
    return this.getAttribute('readonly') || 'false';
  }

  /**
   * Sets the disabled attribute
   * @param {string} d string value from the disabled attribute
   */
  set disabled(d) {
    this.setAttribute('disabled', d.toString());
  }

  get disabled() {
    return this.getAttribute('disabled') || 'false';
  }

  /**
   * Sets the swatch attribute
   * @param {string} s string value from the swatch attribute
   */
  set swatch(s) {
    this.setAttribute('swatch', s.toString());
  }

  get swatch() {
    return this.getAttribute('swatch') || 'true';
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
   #handleEvents() {
    /* istanbul ignore next */
    this.idsColorsArr.forEach((element) => {
      element.style.backgroundColor = element.getAttribute('hex');
    });

    /* istanbul ignore next */
    if (this.disabled === 'false') {
      this.onEvent('click', this.container, (event) => {
        const target = event.target;
        const openColorCondition = (target.classList.contains('colorpicker-icon') || target.classList.contains('ids-dropdown'));

        if (openColorCondition) {
          this.#openCloseColorpicker();
        }

        if (target.hasAttribute('hex')) {
          this.#updateColorCheck(target);
          this.setAttribute('value', target.getAttribute('hex'));
          this.#openCloseColorpicker();
        }
      });

      this.onEvent('keyup', this.container, (keyup) => {
        if (keyup.key === 'Enter') {
          if (keyup.target.id === `${this.id}-button`) {
            this.#openCloseColorpicker();
          }
          if (keyup.target.hasAttribute('hex')) {
            this.setAttribute('value', keyup.target.getAttribute('hex'));
            this.#openCloseColorpicker();
            this.#updateColorCheck(keyup.target);
          }
        }
      });
    }

    this.onEvent('change', this.swatchInput, /* istanbul ignore next */ () => this.setAttribute('value', this.swatchInput.value.toLowerCase()));
    this.onEvent('change', this.colorPickerInput, /* istanbul ignore next */ () => this.setAttribute('value', this.colorPickerInput.value.toLowerCase()));
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
     const popup = this.container.querySelector('ids-popup');
     /* istanbul ignore next */
     popup.alignTarget = this.container.querySelector('ids-icon');
     /* istanbul ignore next */
     popup.align = 'bottom, center';
     /* istanbul ignore next */
     popup.arrow = 'bottom';
     /* istanbul ignore next */
     popup.y = 12;
     /* istanbul ignore next */
     popup.visible = !popup.visible;
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
