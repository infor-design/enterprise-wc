import colorPalette from 'ids-identity/dist/theme-new/tokens/web/ui.config.color-palette';
import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import IdsColor, { SwatchSizesType } from '../ids-color/ids-color';
import IdsTriggerField from '../ids-trigger-field/ids-trigger-field';
import IdsTriggerButton from '../ids-trigger-field/ids-trigger-button';
import '../ids-input/ids-input';

import Base from './ids-color-picker-base';

import styles from './ids-color-picker.scss';

/**
 * IDS Color Picker
 * @type {IdsColorPicker}
 * @inherits IdsTriggerField
 * @mixes IdsPopupOpenEventsMixin
 */
@customElement('ids-color-picker')
@scss(styles)
export default class IdsColorPicker extends Base {
  constructor() {
    super();
  }

  colorInput?: HTMLInputElement | null;

  colorPreview?: IdsColor | null;

  colorPickerInput?: IdsTriggerField | null;

  color?: IdsColor | null;

  textInput?: HTMLInputElement | null;

  triggerBtn?: IdsTriggerButton | null;

  isFormComponent = true;

  /** Invoked each time the custom element is added to the DOM */
  connectedCallback() {
    if (!this.swatches.length) {
      this.append(...this.defaultSwatches);
    }
    super.connectedCallback();
    this.colorInput = this.container?.querySelector('.color-input');
    this.colorPreview = this.container?.querySelector('.color-preview');
    this.colorPickerInput = this.container?.querySelector('ids-trigger-field');
    this.color = this.container?.querySelector('ids-color');
    this.textInput = this.container?.querySelector('#ids-color-picker-input');
    this.triggerBtn = this.container?.querySelector('ids-trigger-button');

    this.#updateColor(this.value);
    this.#configureSwatches();
    this.#attachEventHandlers();
  }

  /** Invoked each time the custom element is removed from the DOM */
  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#detachEventHandlers();
  }

  /** @returns {string[]} this component's observable attributes */
  static get attributes(): string[] {
    return [
      ...super.attributes,
      attributes.ADVANCED,
      attributes.CHECKED,
      attributes.CLEARABLE,
      attributes.DISABLED,
      attributes.SUPPRESS_LABELS,
      attributes.READONLY,
      attributes.TABBABLE,
      attributes.TABINDEX,
      attributes.SUPPRESS_TOOLTIPS,
    ];
  }

  /**
   * HTML for IdsColorPicker.shadowRoot
   * Contains default slot for color elements
   * @returns {string} - html for the template
   */
  template(): string {
    this.templateHostAttributes();
    const {
      ariaLabel,
      containerClass,
      inputClass,
      inputState,
      labelHtml,
      placeholder,
      type,
      value
    } = this.templateVariables();

    return `
      <div
        part="container"
        id="ids-color-picker"
        class="ids-color-picker ids-trigger-field ${containerClass}"
      >
        ${labelHtml}
        <div class="field-container" part="field-container">
          ${this.colorPreviewHtml}
          <slot name="trigger-start"></slot>
          ${this.colorPickerAdvancedHtml}
          <input
            part="input"
            id="ids-color-picker-input"
            ${type}${inputClass}${placeholder}${inputState}
            ${ariaLabel}
            ${value}
            >
          </input>
          ${this.colorPopupHtml}
          <slot name="trigger-end"></slot>
        </div>
      </div>
    `;
  }

  /**
   * HTML for Color Picker Menu Button and Menu Container
   * Contains default slot for color elements
   * @returns {string} - html
   */
  get colorPopupHtml(): string {
    return `
      <ids-trigger-button
        id="ids-color-picker-menu-button"
        class="color-picker-trigger-btn"
        ${this.disabled ? 'disabled="true"' : ''}
        ${this.readonly ? 'readonly="true"' : ''}
        tabbable="false"
      >
        <ids-text audible="true" translate-text="true">ColorPickerTriggerButton</ids-text>
        <ids-icon class="ids-dropdown" icon="dropdown" size="medium"></ids-icon>
      </ids-trigger-button>
      <ids-popup type="menu"><slot slot="content" class="color-popup"></slot></ids-popup>
    `;
  }

  /**
   * HTML for Color Picker Previw Swatch
   * @returns {string} - html
   */
  get colorPreviewHtml(): string {
    return `<ids-color${this.disabled ? ' disabled' : ''} tabindex="-1" class="color-preview" size="${this.#fieldSwatchSize()}"></ids-color>`;
  }

  /**
   * Get the field height swatch size
   * @private
   * @returns {string} swatch size
   */
  #fieldSwatchSize() {
    const fieldHeight: string = this.compact ? 'mm' : this.fieldHeight;

    const fieldSwatchSize = {
      compact: 'xs',
      xs: 'mm',
      sm: 'mm',
      mm: 'mm',
      md: 'md',
      lg: 'lg',
    }[fieldHeight] || 'md';
    return fieldSwatchSize;
  }

  /**
   * Push field-height/compact to the container element and swatch
   */
  onFieldHeightChange() {
    if (this.color) {
      this.color.size = this.#fieldSwatchSize() as SwatchSizesType;
    }
  }

  /**
   * HTML for Advanced Color Picker Popup
   * @returns {string} - html
   */
  get colorPickerAdvancedHtml(): string {
    if (!this.advanced) return '';

    return `
      <label class="advanced-color-picker">
        <input
          class="color-input"
          tabindex="-1"
          type="color"
        />
        <ids-text audible="true" translate-text="true">ColorPickerSelection</ids-text>
      </label>
    `;
  }

  /**
   * Available color swatches within this color-picker
   * @returns {IdsColor[]} available colors within this picker
   */
  get swatches(): Array<IdsColor> {
    return [...this.querySelectorAll<IdsColor>('ids-color')];
  }

  /**
   * Default color swatches for this color-picker if no children provided
   * @returns {IdsColor[]} available colors within this picker
   */
  get defaultSwatches(): IdsColor[] {
    const COLOR_PALETTE_CSS_VAR_REGEX = /^--ids-color-palette-(([^0-9]+)-([0-9]+))$/;

    return [
      ...Object.values(colorPalette.ruby),
      ...Object.values(colorPalette.amber),
      ...Object.values(colorPalette.emerald),
      ...Object.values(colorPalette.azure),
      ...Object.values(colorPalette.turquoise),
      ...Object.values(colorPalette.amethyst),
      ...Object.values(colorPalette.slate)
    ].map((cssVar) => {
      const color = new IdsColor();
      const [cssVarName, label, colorCategory, colorCode] = cssVar.match(COLOR_PALETTE_CSS_VAR_REGEX) || [];
      color.label = label;
      color.tooltip = `${colorCategory} ${colorCode}`;
      color.hex = getComputedStyle(this.parentElement as HTMLElement).getPropertyValue(String(cssVarName)) || `var(${cssVarName})`;
      color.classList.add((Number(colorCode) < 40) ? 'light' : 'dark');
      return color;
    });
  }

  /**
   * Sets the value attribute
   * @param {string} value - string value from the value attribute
   */
  set value(value: string) {
    super.value = value?.trim() || '';

    const updatedValue = super.value;
    this.#updateColorPickerValues(updatedValue);
    this.#updateColorCheck(this.#findColorSwatch(updatedValue));

    // Send the change event
    this.triggerEvent('change', this, {
      bubbles: true,
      detail: {
        elem: this,
        value: this.value
      }
    });
  }

  /**
   * Gets the value attribute
   * @returns {string} - string value from the value attribute
   */
  get value(): string {
    return super.value ?? '';
  }

  /**
   * Sets the advanced attribute
   * @param {boolean | string} value - true if the "advanced" color picker type should be used
   */
  set advanced(value: boolean | string) {
    const pattern = ['#', /[0-9a-fA-F]/, /[0-9a-fA-F]/, /[0-9a-fA-F]/, /[0-9a-fA-F]/, /[0-9a-fA-F]/, /[0-9a-fA-F]/];

    if (stringToBool(value)) {
      this.setAttribute(attributes.ADVANCED, 'true');
      if (!this.colorInput) {
        this.textInput?.insertAdjacentHTML('beforebegin', this.colorPickerAdvancedHtml);
      }
      this.colorInput = this.container?.querySelector('.color-input');
      this.#attachColorInputEventHandlers();
      this.#updateColorPickerValues(super.value);
      this.mask = pattern;
    } else {
      this.removeAttribute(attributes.ADVANCED);
      this.#detachColorInputEventHandlers();
      this.container?.querySelector('.advanced-color-picker')?.remove();
      this.colorInput = null;
      this.mask = undefined;
    }
  }

  /**
   * Gets the advanced attribute
   * @returns {boolean | string} - true if the "advanced" color picker type should be used
   */
  get advanced(): boolean | string {
    return stringToBool(this.getAttribute(attributes.ADVANCED)) || false;
  }

  /** @see IdsClearableMixin.appendClearableButton() */
  appendClearableButton() {
    const noColorSwatch = this.swatches.find((e: IdsColor) => !e.getAttribute(attributes.HEX));
    if (!noColorSwatch) {
      this.append(new IdsColor());
      this.#configureSwatches();
    }
  }

  /** @see IdsClearableMixin.removeClearableButton() */
  removeClearableButton() {
    const noColorSwatch = this.swatches.find((e: IdsColor) => !e.getAttribute(attributes.HEX));
    noColorSwatch?.remove();
  }

  /**
   * Sets the disabled attribute
   * @param {boolean | string} value - string value from the disabled attribute
   */
  set disabled(value: boolean | string) {
    value = stringToBool(value);
    super.disabled = value;

    if (value) {
      this.colorPickerInput?.setAttribute(attributes.DISABLED, '');
      this.triggerBtn?.setAttribute(attributes.DISABLED, '');
      this.triggerBtn?.setAttribute(attributes.TABBABLE, 'false');
      return;
    }
    this.colorPickerInput?.removeAttribute(attributes.DISABLED);
    this.triggerBtn?.removeAttribute(attributes.DISABLED);
    this.triggerBtn?.setAttribute(attributes.TABBABLE, String(this.tabbable));
  }

  /**
   * Gets the disabled attribute
   * @returns {boolean} - string value from the disabled attribute
   */
  get disabled(): boolean {
    return super.disabled;
  }

  /**
   * Sets the readonly attribute
   * @param {boolean | string} value - string value from the readonly attribute
   */
  set readonly(value: boolean | string) {
    value = stringToBool(value);
    super.readonly = value;

    if (value) {
      this.colorPickerInput?.setAttribute(attributes.READONLY, '');
      this.triggerBtn?.setAttribute(attributes.DISABLED, '');
      this.colorPickerInput?.removeAttribute(attributes.DISABLED);
      return;
    }
    this.colorPickerInput?.removeAttribute(attributes.READONLY);
    this.triggerBtn?.removeAttribute(attributes.DISABLED);
    this.colorPickerInput?.removeAttribute(attributes.DISABLED);
  }

  /**
   * Gets the readonly attribute
   * @returns {boolean} - value string from the readonly attribute
   */
  get readonly(): boolean {
    return stringToBool(this.getAttribute(attributes.READONLY));
  }

  /**
   * Show color-hex values instead of labels
   * @param {boolean | string} value - true if color-swatch labels should show instead of hexes
   */
  set suppressLabels(value: boolean | string) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.SUPPRESS_LABELS, 'true');
    } else {
      this.removeAttribute(attributes.SUPPRESS_LABELS);
    }

    this.#configureSwatches();
  }

  /**
   * Gets the labels attribute
   * @returns {boolean} - true if color-swatch labels should show instead of hexes
   */
  get suppressLabels(): boolean {
    if (this.advanced) return true;

    return stringToBool(this.getAttribute(attributes.SUPPRESS_LABELS)) || false;
  }

  /**
   * Sets the tooltips attribute
   * @param {boolean | string} value - true if color-swatch tooltips should show
   */
  set suppressTooltips(value: boolean | string) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.SUPPRESS_TOOLTIPS, 'true');
    } else {
      this.removeAttribute(attributes.SUPPRESS_TOOLTIPS);
    }

    this.#configureSwatches();
  }

  /**
   * Gets the tooltips attribute
   * @returns {boolean} - true if color-swatch tooltips should show
   */
  get suppressTooltips(): boolean {
    if (this.advanced) return true;

    return stringToBool(this.getAttribute(attributes.SUPPRESS_TOOLTIPS)) || false;
  }

  /**
   * Closes the Color Picker's Popup
   * @returns {void}
   */
  close(): void {
    this.popup.visible = false;
    this.removeOpenEvents();
    this.#configureSwatches();
  }

  /**
   * Opens the Color Picker's Popup
   * @returns {void}
   */
  open(): void {
    if (this.advanced || this.disabled || this.readonly) {
      this.popup.visible = false;
      return;
    }

    this.popup.alignTarget = this.triggerBtn;
    this.popup.align = 'bottom, right';
    this.popup.arrowTarget = this.triggerBtn;
    this.popup.arrow = 'bottom';
    this.popup.y = 12;
    this.popup.visible = true;
    this.addOpenEvents();
    this.#configureSwatches();
  }

  /**
   * Inherited from the Popup Open Events Mixin.
   * Runs when a click event is propagated to the window.
   * @returns {void}
   */
  onOutsideClick(): void {
    this.close();
  }

  /** Handle events */
  #attachEventHandlers(): void {
    this.#detachEventHandlers();

    // Respond to clicks on Color Picker swatches
    this.onEvent('click.color-picker-container', this.container, (event: MouseEvent) => {
      const isEditable = !stringToBool(this.readonly)
      && !stringToBool(this.disabled);

      if (!isEditable) {
        return;
      }

      const target: any = event.target;
      if (target.closest('.color-picker-trigger-btn, .color-preview')) {
        this.#openCloseColorpicker();
      } else if (target.name?.toLowerCase() === 'ids-color' && !target.classList.contains('color-preview')) {
        this.#updateColor(target?.hex);
        this.close();
      }
    });

    // Respond to change events from the text-field input
    this.onEvent('input.color-picker-text', this.textInput, (e: any) => {
      this.#updateColor(e.target.value);
    });

    if (this.advanced) {
      this.#attachColorInputEventHandlers();
    }

    this.onEvent('keydown.color-picker', this, (e: any) => {
      if (e.target.name === 'id-color-picker') {
        e.preventDefault();
      }
      if (e.key === 'Escape') {
        this.close();
      } else if (['Enter', 'Space', ' '].includes(e.key)) {
        if (this.popup.visible) {
          const isColorSwatch = String(e.target.name).toLowerCase() === 'ids-color';
          const swatch = isColorSwatch ? e.target : document.activeElement;
          this.#updateColor(swatch?.hex);
          this.close();
        } else if (e.key === 'Enter') {
          this.open();
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (!this.popup.visible) {
          this.open();
        }
      }
    });

    // Respond to Keyup events on swatches and buttons
    this.onEvent('keydown.color-picker-popup', this.popup, (e: any) => {
      const popupKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', ' '];

      if (popupKeys.includes(e.key)) {
        e.preventDefault();

        // TODO: add NUM_COLUMNS as configurable attribute to colorpicker
        const NUM_COLUMNS = 10;
        const swatches = this.swatches;
        const firstSwatch = swatches[0];
        const lastSwatch = swatches[swatches.length - 1];
        const activeSwatch = document.activeElement?.closest('ids-color') || firstSwatch;
        const currentSwatch = (e.target.name.toLowerCase() === 'ids-color') ? e.target : activeSwatch;
        const currentSwatchIndex = swatches.indexOf(currentSwatch);
        const previousSwatch = swatches[currentSwatchIndex - 1] || lastSwatch;
        const nextSwatch = swatches[currentSwatchIndex + 1] || firstSwatch;

        if (e.key === 'ArrowRight') {
          nextSwatch.swatch?.focus();
        } else if (e.key === 'ArrowLeft') {
          previousSwatch.swatch?.focus();
        } else if (e.key === 'ArrowUp') {
          const upwardIndex = currentSwatchIndex - NUM_COLUMNS;
          if (upwardIndex >= 0) {
            const [upwardSwatch] = swatches.splice(upwardIndex, 1);
            upwardSwatch?.swatch?.focus();
          }
        } else if (e.key === 'ArrowDown') {
          const downwardIndex = currentSwatchIndex + NUM_COLUMNS;
          if (downwardIndex < swatches.length) {
            const [downwardSwatch] = swatches.splice(downwardIndex, 1);
            downwardSwatch?.swatch?.focus();
          }
        }
      }
    });
  }

  /** Handle events */
  #detachEventHandlers(): void {
    // Respond to clicks on Color Picker swatches
    this.offEvent('click.color-picker-container', this.container);

    // Respond to change events from the text-field input
    this.offEvent('input.color-picker-text', this.textInput);

    this.offEvent('keydown.color-picker', this);

    // Respond to Keyup events on swatches and buttons
    this.onEvent('keydown.color-picker-popup', this.popup);

    this.#detachColorInputEventHandlers();
  }

  #attachColorInputEventHandlers(): void {
    // Respond to change events from the swatch input
    this.offEvent('input.color-picker-input', this.colorInput);
    this.onEvent('input.color-picker-input', this.colorInput, (e: any) => {
      this.#updateColor(e.target.value);
    });
  }

  #detachColorInputEventHandlers(): void {
    this.offEvent('input.color-picker-input', this.colorInput);
  }

  /** Configure disabled/labels/tooltips attributes on IdsColor swatches */
  #configureSwatches(): void {
    this.swatches.forEach((swatch: IdsColor) => {
      swatch.classList.add('outlined');
      swatch.tooltip = this.suppressLabels ? (this.tooltip || swatch.hex) : (this.tooltip || swatch.label);
      if (this.suppressTooltips) swatch.tooltip = '';

      if (this.popup.visible) {
        swatch.removeAttribute(attributes.TABINDEX);
      } else {
        swatch.setAttribute(attributes.TABINDEX, '-1');
      }
    });

    (this.#findColorSwatch(this.value) || this.swatches[0])?.swatch?.focus();
  }

  /**
   * Find a color-swatch by hex or label
   * @param {string} value the color's hex or label
   * @returns {IdsColor | undefined} - the matching color-swatch
   */
  #findColorSwatch(value?: string): IdsColor | undefined {
    const colorSwatch = this.swatches.find((swatch) => {
      if (!value) {
        return !!swatch.hex === false;
      }

      const hex = String(swatch.hex).trim().toLowerCase();
      const label = String(swatch.label).trim().toLowerCase();
      return [hex, label].includes(String(value).trim().toLowerCase());
    });

    return colorSwatch;
  }

  /**
   * Returns the value of the currently-selected color picker swatch
   * @returns {string} containing a color value
   */
  #getSelectedSwatchValue(): string | undefined {
    if (this.advanced) {
      return this.colorInput?.value;
    }

    const checked = this.querySelectorAll<IdsColor>('ids-color[checked]')?.[0];
    return checked?.hex;
  }

  /** Open/Close popup to show and hide color panel */
  #openCloseColorpicker(): void {
    if (this.advanced) {
      this.colorInput?.click();
      return;
    }

    if (!this.popup.visible) {
      if (this.swatches.length) {
        this.open();
      }
    } else {
      this.close();
    }
  }

  /**
   * Update color to match setected color
   * @param {string} value - the color's hex-value or label
   */
  #updateColor(value: string): void {
    if (value) {
      const colorSwatch = this.#findColorSwatch(value);
      this.value = colorSwatch?.hex || value;
    } else {
      this.value = '';
    }
  }

  /**
   * Update color check to match setected color
   * @param {IdsColor} colorSwatch selected color swatch
   */
  #updateColorCheck(colorSwatch?: IdsColor): void {
    const checkedColor = this.querySelector('[checked]');
    if (checkedColor) {
      checkedColor.removeAttribute(attributes.CHECKED);
    }

    if (colorSwatch) {
      colorSwatch.setAttribute(attributes.CHECKED, '');
    }
  }

  /**
   * Update color picker value to match setected color hex value
   * @param {string} colorValue the value to update
   */
  #updateColorPickerValues(colorValue?: string): void {
    if (!this.colorPreview) return;
    const value = colorValue ?? this.#getSelectedSwatchValue();
    const colorSwatch = this.#findColorSwatch(value);
    const targetColorValue = colorSwatch?.hex || value;

    this.colorPreview.hex = targetColorValue ?? '';

    // Updating input type="color" value only when advanced setting
    // and when it meets the format "#rrggbb" after masked input
    if (this.advanced && this.colorInput) {
      this.colorInput.value = targetColorValue?.length !== 7 ? '#ffffff' : targetColorValue;
    }

    if (targetColorValue && this.textInput) {
      this.textInput.value = (!this.suppressLabels && colorSwatch?.label) || colorSwatch?.hex || this.textInput?.value;
    } else if (this.textInput) {
      this.textInput.value = '';
    }

    if (this.dirtyTracker) {
      this.setDirtyTracker(this.textInput?.value);
    }
  }
}
