import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import styles from './ids-color-picker.scss';
import IdsColor from '../ids-color/ids-color';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsElement from '../../core/ids-element';
import IdsFieldHeightMixin from '../../mixins/ids-field-height-mixin/ids-field-height-mixin';
import IdsLabelStateParentMixin from '../../mixins/ids-label-state-mixin/ids-label-state-parent-mixin';
import { IdsPopupElementRef } from '../ids-popup/ids-popup-attributes';
import IdsClearableMixin from '../../mixins/ids-clearable-mixin/ids-clearable-mixin';
import IdsDirtyTrackerMixin from '../../mixins/ids-dirty-tracker-mixin/ids-dirty-tracker-mixin';
import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsPopup from '../ids-popup/ids-popup';
import IdsTriggerButton from '../ids-trigger-field/ids-trigger-button';
import '../ids-trigger-field/ids-trigger-field';
import type IdsTriggerField from '../ids-trigger-field/ids-trigger-field';
import { IdsLabelStateMode } from '../../mixins/ids-label-state-mixin/ids-label-state-common';

const Base = IdsClearableMixin(
  IdsFieldHeightMixin(
    IdsDirtyTrackerMixin(
      IdsLocaleMixin(
        IdsLabelStateParentMixin(
          IdsEventsMixin(
            IdsElement
          )
        )
      )
    )
  )
);

/**
 * IDS Color Picker
 * @type {IdsColorPicker}
 * @inherits IdsElement
 */
@customElement('ids-color-picker')
@scss(styles)
export default class IdsColorPicker extends Base {
  isFormComponent = true;

  useDefaultSwatches = true;

  initialized = false;

  constructor() {
    super();
  }

  /** Invoked each time the custom element is added to the DOM */
  connectedCallback() {
    super.connectedCallback();
    if (!this.swatches.length) {
      this.useDefaultSwatches = true;
      this.append(...this.defaultSwatches);
    }
    if (this.clearable) this.appendClearableButton();

    this.#updateColor(this.value);
    this.#configureSwatches();
    this.#attachEventHandlers();
    this.initialized = true;
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
      attributes.COMPACT,
      attributes.DISABLED,
      attributes.ID,
      attributes.LABEL,
      attributes.PLACEHOLDER,
      attributes.SUPPRESS_LABELS,
      attributes.READONLY,
      attributes.TABBABLE,
      attributes.TABINDEX,
      attributes.SIZE,
      attributes.SUPPRESS_TOOLTIPS,
      attributes.TOOLTIP,
      attributes.VALIDATE,
      attributes.VALUE,
    ];
  }

  /**
   * HTML for IdsColorPicker.shadowRoot
   * Contains default slot for color elements
   * @returns {string} - html for the template
   */
  template(): string {
    const swatchSize = this.swatchSize();
    const readonly = this.readonly ? 'readonly' : '';
    const disabled = this.disabled ? 'disabled' : '';
    const dirtyTracker = this.dirtyTracker ? 'dirty-tracker' : '';
    const advancedPopup = this.advanced ? this.colorPickerAdvancedHtml : '';
    const value = this.value ? `value="${this.value}"` : '';
    const label = this.label ? `label="${this.label}"` : '';

    return `<div class="ids-color-picker">
      ${advancedPopup}
      <ids-trigger-field ${label} ${readonly} ${disabled} ${dirtyTracker} ${value}>
        <ids-color ${disabled} size="${swatchSize}" tabindex="-1" class="color-preview" slot="trigger-start"></ids-color>
        <ids-trigger-button slot="trigger-end" class="color-picker-trigger-btn" tabindex="-1">
          <ids-text audible="true" translate-text="true"></ids-text>
          <ids-icon icon="dropdown"></ids-icon>
        </ids-trigger-button>
      </ids-trigger-field>
      <ids-popup id="color-picker-popup" type="menu">
        <slot slot="content" class="color-popup"></slot>
      </ids-popup>
    </ids-color-picker>`;
  }

  get textInput(): IdsTriggerField | null {
    return this.container?.querySelector<IdsTriggerField>('ids-trigger-field') || null;
  }

  get colorInput(): HTMLInputElement | null {
    return this.container?.querySelector<HTMLInputElement>('.advanced-color-picker') || null;
  }

  get colorPreview(): HTMLElement | null {
    return this.container?.querySelector<HTMLElement>('.color-preview') || null;
  }

  get triggerBtn(): IdsTriggerButton | null {
    return this.container?.querySelector<IdsTriggerButton>('ids-trigger-button') || null;
  }

  /**
   * HTML for Color Picker Previw Swatch
   * @returns {string} - html
   */
  get colorPreviewHtml(): string {
    return `<ids-color${this.disabled ? ' disabled' : ''} tabindex="-1" class="color-preview" size="${this.swatchSize()}"></ids-color>`;
  }

  get popup() {
    return this.container?.querySelector<IdsPopup>('#color-picker-popup');
  }

  /**
   * HTML for Advanced Color Picker Popup
   * @returns {string} - html
   */
  get colorPickerAdvancedHtml(): string {
    if (!this.advanced) return '';
    return `<input class="advanced-color-picker" tabindex="-1" type="color"/>`;
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
   * @returns {Array<IdsColor>} available colors within this picker
   */
  get defaultSwatches(): Array<IdsColor> {
    const COLOR_PALETTE_CSS_VAR_REGEX = /^--ids-color-(([^0-9]+)-([0-9]+))$/;

    const createColor = ((cssVar: string) => {
      const color = new IdsColor();
      const [cssVarName, label, colorCategory, colorCode] = cssVar.match(COLOR_PALETTE_CSS_VAR_REGEX) || [];
      color.label = label;
      color.tooltip = `${colorCategory} ${colorCode}`;
      color.hex = getComputedStyle(this.parentElement as HTMLElement).getPropertyValue(String(cssVarName)) || `var(${cssVarName})`;
      color.classList.add((Number(colorCode) < 40) ? 'light' : 'dark');
      return color;
    });

    const paletteGroups = [
      ...Object.values(['--ids-color-red-10', '--ids-color-red-20', '--ids-color-red-30', '--ids-color-red-40', '--ids-color-red-50', '--ids-color-red-60', '--ids-color-red-70', '--ids-color-red-80', '--ids-color-red-90', '--ids-color-red-100']),
      ...Object.values(['--ids-color-orange-10', '--ids-color-orange-20', '--ids-color-orange-30', '--ids-color-orange-40', '--ids-color-orange-50', '--ids-color-orange-60', '--ids-color-orange-70', '--ids-color-orange-80', '--ids-color-orange-90', '--ids-color-orange-100']),
      ...Object.values(['--ids-color-green-10', '--ids-color-green-20', '--ids-color-green-30', '--ids-color-green-40', '--ids-color-green-50', '--ids-color-green-60', '--ids-color-green-70', '--ids-color-green-80', '--ids-color-green-90', '--ids-color-green-100']),
      ...Object.values(['--ids-color-blue-10', '--ids-color-blue-20', '--ids-color-blue-30', '--ids-color-blue-40', '--ids-color-blue-50', '--ids-color-blue-60', '--ids-color-blue-70', '--ids-color-blue-80', '--ids-color-blue-90', '--ids-color-blue-100']),
      ...Object.values(['--ids-color-teal-10', '--ids-color-teal-20', '--ids-color-teal-30', '--ids-color-teal-40', '--ids-color-teal-50', '--ids-color-teal-60', '--ids-color-teal-70', '--ids-color-teal-80', '--ids-color-teal-90', '--ids-color-teal-100']),
      ...Object.values(['--ids-color-purple-10', '--ids-color-purple-20', '--ids-color-purple-30', '--ids-color-purple-40', '--ids-color-purple-50', '--ids-color-purple-60', '--ids-color-purple-70', '--ids-color-purple-80', '--ids-color-purple-90', '--ids-color-purple-100']),
      ...Object.values(['--ids-color-gray-10', '--ids-color-gray-20', '--ids-color-gray-30', '--ids-color-gray-40', '--ids-color-gray-50', '--ids-color-gray-60', '--ids-color-gray-70', '--ids-color-gray-80', '--ids-color-gray-90', '--ids-color-gray-100']),
    ].map(createColor);

    return paletteGroups;
  }

  /**
   * Sets the value attribute
   * @param {string} value - string value from the value attribute
   */
  set value(value: string | null) {
    value = value?.trim() ?? '';

    if (value) {
      this.setAttribute(attributes.VALUE, value);
    } else {
      this.removeAttribute(attributes.VALUE);
    }

    this.#updateColorPickerValues(value);
    this.#updateSelectedSwatch(this.#findColorSwatch(value));
  }

  /**
   * Gets the value attribute
   * @returns {string} - string value from the value attribute
   */
  get value(): string {
    return this.getAttribute(attributes.VALUE) ?? '';
  }

  set placeholder(value: string | null) {
    if (value) {
      this.setAttribute(attributes.PLACEHOLDER, value);
      this.textInput?.setAttribute(attributes.PLACEHOLDER, value);
    } else {
      this.removeAttribute(attributes.PLACEHOLDER);
      this.textInput?.removeAttribute(attributes.PLACEHOLDER);
    }
  }

  get placeholder(): string {
    return this.getAttribute(attributes.PLACEHOLDER) ?? '';
  }

  set size(val: string | null) {
    if (val) {
      this.setAttribute(attributes.SIZE, val);
      this.textInput?.setAttribute(attributes.SIZE, val);
    } else {
      this.removeAttribute(attributes.SIZE);
      this.textInput?.removeAttribute(attributes.SIZE);
    }
  }

  get size(): string | null {
    return this.getAttribute(attributes.SIZE);
  }

  set validate(val: string | null) {
    if (val) {
      this.setAttribute(attributes.VALIDATE, val);
      this.textInput?.setAttribute(attributes.VALIDATE, val);
    } else {
      this.removeAttribute(attributes.VALIDATE);
      this.textInput?.removeAttribute(attributes.VALIDATE);
    }
  }

  get validate(): string | null {
    return this.getAttribute(attributes.VALIDATE);
  }

  set tabbable(value: boolean | string | null) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.TABBABLE, '');
      this.textInput?.setAttribute(attributes.TABBABLE, '');
    } else {
      this.removeAttribute(attributes.TABBABLE);
      this.textInput?.removeAttribute(attributes.TABBABLE);
    }
  }

  get tabbable(): boolean {
    return stringToBool(this.getAttribute(attributes.TABBABLE));
  }

  set tooltip(value: string | null) {
    if (value) {
      this.setAttribute(attributes.TOOLTIP, value);
      this.textInput?.setAttribute(attributes.TOOLTIP, value);
    } else {
      this.removeAttribute(attributes.TOOLTIP);
      this.textInput?.removeAttribute(attributes.TOOLTIP);
    }
  }

  get tooltip(): string | null {
    return this.getAttribute(attributes.TOOLTIP);
  }

  /**
   * Sets the advanced attribute
   * @param {boolean | string} value - true if the "advanced" color picker type should be used
   */
  set advanced(value: boolean | string) {
    const pattern = ['#', /[0-9a-fA-F]/, /[0-9a-fA-F]/, /[0-9a-fA-F]/, /[0-9a-fA-F]/, /[0-9a-fA-F]/, /[0-9a-fA-F]/];

    if (stringToBool(value)) {
      this.setAttribute(attributes.ADVANCED, 'true');
      if (!this.colorInput) this.container?.insertAdjacentHTML('afterbegin', this.colorPickerAdvancedHtml);
      this.#attachColorInputEventHandlers();
      this.#updateColorPickerValues(this.value);
      if (this.textInput) this.textInput.mask = pattern;
    } else {
      this.removeAttribute(attributes.ADVANCED);
      this.#detachColorInputEventHandlers();
      this.colorInput?.remove();
      if (this.textInput) this.textInput.mask = undefined;
    }
  }

  /**
   * Gets the advanced attribute
   * @returns {boolean | string} - true if the "advanced" color picker type should be used
   */
  get advanced(): boolean | string {
    return stringToBool(this.getAttribute(attributes.ADVANCED)) || false;
  }

  /**
   * Sets the disabled attribute
   * @param {boolean | string} value - string value from the disabled attribute
   */
  set disabled(value: boolean | string) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.DISABLED, '');
      this.textInput?.setAttribute(attributes.DISABLED, '');
      this.triggerBtn?.setAttribute(attributes.DISABLED, '');
      this.triggerBtn?.setAttribute(attributes.TABBABLE, 'false');
    } else {
      this.removeAttribute(attributes.DISABLED);
      this.textInput?.removeAttribute(attributes.DISABLED);
      this.triggerBtn?.removeAttribute(attributes.DISABLED);
      this.triggerBtn?.setAttribute(attributes.TABBABLE, String(this.tabbable));
    }
  }

  /**
   * Gets the disabled attribute
   * @returns {boolean} - string value from the disabled attribute
   */
  get disabled(): boolean {
    return stringToBool(this.getAttribute(attributes.DISABLED));
  }

  /**
   * Sets the readonly attribute
   * @param {boolean | string} value - string value from the readonly attribute
   */
  set readonly(value: boolean | string) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.READONLY, '');
      this.textInput?.setAttribute(attributes.READONLY, '');
      this.triggerBtn?.setAttribute(attributes.DISABLED, '');
    } else {
      this.removeAttribute(attributes.READONLY);
      this.textInput?.removeAttribute(attributes.READONLY);
      this.triggerBtn?.removeAttribute(attributes.DISABLED);
    }
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

  set compact(value: boolean | string | null) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.COMPACT, '');
      this.textInput?.setAttribute(attributes.COMPACT, '');
      this.textInput?.querySelector('ids-color')?.setAttribute('size', 'mm');
    } else {
      this.removeAttribute(attributes.COMPACT);
      this.textInput?.removeAttribute(attributes.COMPACT);
      this.textInput?.querySelector('ids-color')?.setAttribute('size', 'md');
    }
  }

  get compact(): boolean {
    return stringToBool(this.getAttribute(attributes.COMPACT));
  }

  /**
   * Sets the id internally and externally
   * @param {string} value id value
   */
  set id(value: string) {
    this.shadowRoot?.querySelector('ids-trigger-field')?.setAttribute(attributes.ID, `${value}-trigger-field`);
    this.setAttribute(attributes.ID, value);
  }

  get id(): string {
    return this.getAttribute(attributes.ID) || 'none';
  }

  /**
   * Closes the Color Picker's Popup
   * @returns {void}
   */
  close(): void {
    this.popup?.setAttribute(attributes.VISIBLE, 'false');
    this.popup?.removeOpenEvents();
    this.#configureSwatches();
  }

  /**
   * Opens the Color Picker's Popup
   * @returns {void}
   */
  open(): void {
    if (this.advanced || this.disabled || this.readonly || !this.popup) {
      return;
    }

    // Refresh Swatches
    if (this.useDefaultSwatches) {
      const swatches = this.swatches;
      for (let i = 0; i < swatches.length; i++) {
        swatches[i].remove();
      }
      this.append(...this.defaultSwatches);
    }

    const rtl = this.localeAPI.isRTL();

    this.popup.align = `bottom, ${rtl ? 'right' : 'left'}`;
    this.popup.arrow = 'bottom';
    this.popup.arrowTarget = this.triggerBtn as IdsPopupElementRef;
    this.popup.alignTarget = this.textInput as IdsPopupElementRef;
    this.popup.visible = true;
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.popup.show();
    this.popup?.addOpenEvents();
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

    // handle IdsTriggerField change events
    this.onEvent('change', this.textInput, (evt: CustomEvent) => {
      evt.stopPropagation();

      this.#updateColor(evt.detail.value);

      // Propagate ids trigger field change event
      this.triggerEvent('change', this, {
        bubbles: true,
        detail: {
          ...evt.detail,
          elem: this
        }
      });
    });

    // Handle idsTriggerField input events
    this.onEvent('input', this.textInput, (evt: CustomEvent) => {
      evt.stopPropagation();

      const target = evt.target as HTMLInputElement;
      this.#updateColorPreview(target.value);

      // Popagate ids trigger field input event
      this.triggerEvent('input', this, {
        bubbles: true,
        detail: {
          elem: this,
          value: target?.value
        }
      });
    });

    // Respond to clicks on Color Picker swatches
    this.onEvent('click.color-picker-container', this.container, (evt: MouseEvent) => {
      const target: any = evt.target;
      const isEditable = !this.readonly && !this.disabled;
      if (!isEditable) return;

      // if color preview or trigger button is clicked
      if (target.closest('.color-picker-trigger-btn, .color-preview')) {
        this.#openCloseColorpicker();
        return;
      }

      // ids-color from popup is clicked
      if (target.name?.toLowerCase() === 'ids-color' && !target.classList.contains('color-preview')) {
        this.#updateColor(target?.hex);
        this.close();
      }
    });

    // If enabled, attach advanced color picker handlers
    if (this.advanced) {
      this.#attachColorInputEventHandlers();
    }

    // Open color picker on ArrowDown events
    this.onEvent('keydown.color-picker', this, (e: any) => {
      if (e.target.name === 'id-color-picker') {
        e.preventDefault();
      }
      if (e.key === 'Escape') {
        this.close();
      } else if (['Enter', 'Space', ' '].includes(e.key)) {
        if (this.popup?.visible) {
          const isColorSwatch = String(e.target.name).toLowerCase() === 'ids-color';
          const swatch = isColorSwatch ? e.target : document.activeElement;
          this.#updateColor(swatch?.hex);
          this.close();
        } else if (e.key === 'Enter') {
          this.open();
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (!this.popup?.visible) {
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

  /**
   * Update color preview swatch
   * @param {string} hex hex
   */
  #updateColorPreview(hex: string) {
    this.colorPreview?.setAttribute(attributes.HEX, this.#findColorSwatch(hex)?.hex || hex || '');
  }

  /** Handle events */
  #detachEventHandlers(): void {
    this.offEvent('click.color-picker-container', this.container);
    this.offEvent('change.color-picer-text', this.textInput);
    this.offEvent('input.color-picker-text', this.textInput);
    this.offEvent('keydown.color-picker', this);
    this.offEvent('keydown.color-picker-popup', this.popup);
    this.#detachColorInputEventHandlers();
  }

  #attachColorInputEventHandlers(): void {
    // Respond to change events from the swatch input
    this.offEvent('change.color-picker-input', this.colorInput);
    this.onEvent('change.color-picker-input', this.colorInput, (e: any) => {
      this.#updateColor(e.target.value);
    });

    this.offEvent('input.color-picker-input', this.colorInput);
    this.onEvent('input.color-picker-input', this.colorInput, (e: any) => {
      e.stopPropagation();
      this.#updateColorPreview(e.target.value);
    });
  }

  /** Detach events */
  #detachColorInputEventHandlers(): void {
    this.offEvent('change.color-picker-input', this.colorInput);
    this.offEvent('input.color-picker-input', this.colorInput);
  }

  /** Configure disabled/labels/tooltips attributes on IdsColor swatches */
  #configureSwatches(): void {
    this.swatches.forEach((swatch: IdsColor) => {
      swatch.classList.add('outlined');
      swatch.tooltip = this.suppressLabels ? (this.tooltip || swatch.hex) : (this.tooltip || swatch.label);
      if (this.suppressTooltips) swatch.tooltip = '';

      if (this.popup?.visible) {
        swatch.removeAttribute(attributes.TABINDEX);
      } else {
        swatch.setAttribute(attributes.TABINDEX, '-1');
      }
    });

    (this.#findColorSwatch(this.value) || this.swatches[0])?.swatch?.focus();
  }

  /**
   * Find a color-swatch by hex or label
   * @param {string | null} value the color's hex or label
   * @returns {IdsColor | undefined} - the matching color-swatch
   */
  #findColorSwatch(value: string | null): IdsColor | undefined {
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

  /** @see IdsClearableMixin.appendClearableButton() */
  appendClearableButton() {
    const noColorSwatch = this.swatches.find((e: IdsColor) => !e.getAttribute(attributes.HEX));
    if (!noColorSwatch && this.initialized) {
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
   * Returns the value of the currently-selected color picker swatch
   * @returns {string | null} containing a color value
   */
  #getSelectedSwatchValue(): string | null {
    if (this.advanced) {
      return this.colorInput ? this.colorInput.value : null;
    }

    const checked = this.querySelectorAll<IdsColor>('ids-color[checked]')?.[0];
    return checked ? checked.hex : null;
  }

  /** Open/Close popup to show and hide color panel */
  #openCloseColorpicker(): void {
    if (this.advanced) {
      this.colorInput?.click();
      return;
    }

    if (!this.popup?.visible) {
      this.open();
    } else {
      this.close();
    }
  }

  /**
   * Update color to match setected color
   * @param {string | null} value - the color's hex-value or label
   */
  #updateColor(value: string | null): void {
    if (value) {
      const colorSwatch = this.#findColorSwatch(value);
      this.value = colorSwatch?.hex || value;
    } else {
      this.value = '';
    }
  }

  /**
   * Update selected swatch color
   * @param {IdsColor} colorSwatch selected color swatch
   */
  #updateSelectedSwatch(colorSwatch?: IdsColor): void {
    const checkedColor = this.querySelector('[checked]');

    if (checkedColor) {
      checkedColor.removeAttribute(attributes.CHECKED);
    }

    if (colorSwatch) {
      colorSwatch.setAttribute(attributes.CHECKED, '');
    }
  }

  /**
   * Get the field height swatch size
   * @private
   * @returns {string} swatch size
   */
  swatchSize() {
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
   * @param {string} fieldHeight Field Height
   */
  onFieldHeightChange(fieldHeight: string) {
    this.textInput?.setAttribute(attributes.FIELD_HEIGHT, fieldHeight);
    this.colorPreview?.setAttribute(attributes.SIZE, this.swatchSize());
  }

  /**
   * Handles dirty tracker settings changes
   * @param {boolean} enabled enabled
   */
  onDirtyTrackerChange(enabled: boolean): void {
    this.textInput?.setAttribute(attributes.DIRTY_TRACKER, String(enabled));
  }

  /**
   * Handles label setting changes
   * @param {boolean} label label
   */
  onLabelChange(label: string) {
    this.textInput?.setAttribute('label', label ?? '');
  }

  /**
   * Handles label state setting changes
   * @param {IdsLabelStateMode} variantName name
   */
  onLabelStateChange(variantName: IdsLabelStateMode): void {
    if (variantName) {
      this.textInput?.setAttribute(attributes.LABEL_STATE, variantName);
    } else {
      this.textInput?.removeAttribute(attributes.LABEL_STATE);
    }
  }

  /**
   * Update color picker value to match setected color hex value
   * @param {string | null} colorValue the value to update
   */
  #updateColorPickerValues(colorValue: string | null): void {
    if (!this.colorPreview) return;
    const value = colorValue ?? this.#getSelectedSwatchValue();
    const colorSwatch = this.#findColorSwatch(value);
    const targetColorValue = colorSwatch?.hex || value;

    this.#updateColorPreview(targetColorValue ?? '');

    // Updating input type="color" value only when advanced setting
    // and when it meets the format "#rrggbb" after masked input
    if (this.advanced && this.colorInput) {
      this.colorInput.value = targetColorValue?.length !== 7 ? '#ffffff' : targetColorValue;
    }

    if (targetColorValue && this.textInput) {
      const v = (!this.suppressLabels && colorSwatch?.label) || colorSwatch?.hex || targetColorValue;
      this.textInput.setAttribute('value', v);
    } else if (this.textInput) {
      this.textInput.setAttribute('value', '');
    }
  }
}
