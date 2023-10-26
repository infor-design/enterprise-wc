import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import '../ids-text/ids-text';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsValidationMixin from '../../mixins/ids-validation-mixin/ids-validation-mixin';
import IdsElement from '../../core/ids-element';
import type IdsRadio from './ids-radio';

import styles from './ids-radio-group.scss';

const Base = IdsValidationMixin(
  IdsLocaleMixin(
    IdsEventsMixin(
      IdsElement
    )
  )
);

/**
 * IDS Radio Group Component
 * @type {IdsRadioGroup}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsLocaleMixin
 * @mixes IdsValidationMixin
 */
@customElement('ids-radio-group')
@scss(styles)
export default class IdsRadioGroup extends Base {
  /**
   * Call the constructor and then initialize
   */
  constructor() {
    super();
  }

  isFormComponent = true;

  input?: HTMLElement | null;

  labelEl?: HTMLElement | null;

  checked: any = null;

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.DISABLED,
      attributes.HORIZONTAL,
      attributes.LABEL,
      attributes.LABEL_REQUIRED,
      attributes.LANGUAGE,
      attributes.VALIDATE,
      attributes.VALIDATION_EVENTS,
      attributes.VALUE
    ];
  }

  /**
   * Custom Element `connectedCallback` implementation
   * @returns {void}
   */
  connectedCallback() {
    super.connectedCallback();
    const slot = this.shadowRoot?.querySelector('slot');
    this.onEvent('slotchange', slot, () => {
      this.afterChildrenReady();
    });
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template(): string {
    // Radio
    const disabled = stringToBool(this.disabled) ? ' disabled' : '';
    const disabledAria = stringToBool(this.disabled) ? ' aria-disabled="true"' : '';
    const horizontal = stringToBool(this.horizontal) ? ' horizontal' : '';
    const rootClass = ` class="ids-radio-group${disabled}${horizontal}"`;
    const rInd = !(stringToBool((this as any).labelRequired) || (this as any).labelRequired === null);
    const labelClass = ` class="group-label-text${rInd ? ' no-required-indicator' : ''}"`;

    // Label
    const label = this.label ? `<ids-text type="legend"${labelClass}${disabledAria}>${this.label}</ids-text>` : '';

    return `<div role="radiogroup"${rootClass}>${label}<slot></slot></div>`;
  }

  /**
   * Get child ids-radio buttons in this group
   * @returns {IdsRadio[]} list of radios
   */
  get radios(): IdsRadio[] {
    return [...this.querySelectorAll<IdsRadio>('ids-radio')];
  }

  /**
   * Get the selected child ids-radio button in this group
   * @returns {IdsRadio[]} the currently selected ids-radio
   */
  get radiosSelected(): IdsRadio[] {
    return [...this.querySelectorAll<IdsRadio>('ids-radio[checked]')];
  }

  /**
   * Set after children ready
   * @private
   * @returns {void}
   */
  afterChildrenReady(): void {
    this.input = this.shadowRoot?.querySelector('.ids-radio-group');
    this.labelEl = this.shadowRoot?.querySelector('.group-label-text');

    this.setValue();
    this.handleHorizontal();
    this.handleDisabled();
    this.attachInternalEventHandlers();
    this.handleValidation();
  }

  /**
   * Set value for group
   * @private
   * @returns {void}
   */
  setValue(): void {
    const radios = this.radios;
    const radiosSelected = this.radiosSelected;

    if (!radiosSelected.length) {
      const firstRadio = radios[0];
      firstRadio?.shadowRoot?.querySelector('.ids-radio')?.setAttribute('tabindex', '0');
      return;
    }

    const lastSelected = radiosSelected?.at(-1);

    radiosSelected.forEach((radio) => {
      if (lastSelected === radio) {
        this.setAttribute(attributes.VALUE, lastSelected?.value ?? '');
        lastSelected.checked = true;
      } else {
        radio.checked = false;
      }
    });
  }

  /**
   * Clear the group as checked, validation etc.
   * @returns {void}
   */
  clear(): void {
    this.value = null;
    this.checked = null;
    this.removeAllValidationMessages();
    const radio = this.querySelector<IdsRadio>('ids-radio');
    const rootEl = radio?.shadowRoot?.querySelector('.ids-radio');
    rootEl?.setAttribute('tabindex', '0');
  }

  /**
   * Set disabled for each radio in group.
   * @returns {void}
   */
  handleDisabled(): void {
    const radioArr = this.radios;
    const rootEl = this.shadowRoot?.querySelector('.ids-radio-group');

    if (stringToBool(this.disabled)) {
      this.labelEl?.setAttribute('aria-disabled', 'true');
      rootEl?.classList.add(attributes.DISABLED);
      radioArr.forEach((r: any) => r.setAttribute(attributes.GROUP_DISABLED, true));
    } else {
      this.labelEl?.removeAttribute('aria-disabled');
      rootEl?.classList.remove(attributes.DISABLED);
      radioArr.forEach((r: any) => r.removeAttribute(attributes.GROUP_DISABLED));
    }
  }

  /**
   * Set horizontal for each radio in group.
   * @returns {void}
   */
  handleHorizontal(): void {
    const radioArr = this.radios;
    const rootEl = this.shadowRoot?.querySelector('.ids-radio-group');
    if (stringToBool(this.horizontal)) {
      rootEl?.classList.add(attributes.HORIZONTAL);
      radioArr.forEach((r: any) => r.setAttribute(attributes.HORIZONTAL, true));
    } else {
      rootEl?.classList.remove(attributes.HORIZONTAL);
      radioArr.forEach((r: any) => r.removeAttribute(attributes.HORIZONTAL));
    }
  }

  /**
   * Make given radio as checked.
   * @private
   * @param {object} radio to make checked
   * @returns {void}
   */
  makeChecked(radio: IdsRadio): void {
    const value = radio?.value ?? '';
    this.value = value;

    this.checked = radio ?? false;
    if (radio) radio.checked = true;

    const args = { detail: { value, checked: radio ?? false } };
    this.triggerEvent('change', this.input, args);
    this.triggerEvent('change', this, args);
  }

  /**
   * Handle radio group change event
   * @private
   * @returns {void}
   */
  attachRadioGroupChangeEvent(): void {
    const radioArr = this.radios;

    radioArr.forEach((radio) => {
      this.onEvent('change', radio, () => {
        this.makeChecked(radio);
      });
    });
  }

  /**
   * Handle keydown event
   * @private
   * @returns {void}
   */
  attachRadioGroupKeydown(): void {
    const radioArr = [...this.querySelectorAll<IdsRadio>('ids-radio:not([disabled="true"])')];
    const len = radioArr.length;
    radioArr.forEach((r, i) => {
      this.onEvent('keydown', r, (e: KeyboardEvent) => {
        const allow = ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Space'];
        const key = e.code;
        if (allow.indexOf(key) > -1) {
          let idx = i;
          if (key === 'ArrowDown' || key === 'ArrowRight') {
            idx = (i >= (len - 1)) ? 0 : (idx + 1);
          } else if (key === 'ArrowUp' || key === 'ArrowLeft') {
            idx = (i <= 0) ? (len - 1) : (idx - 1);
          }
          this.makeChecked(radioArr[idx]);
          radioArr[idx].focus();
          e.preventDefault();
        }
      });
    });
  }

  /**
   * Handle events
   * @private
   * @returns {void}
   */
  attachInternalEventHandlers(): void {
    this.attachRadioGroupChangeEvent();
    this.attachRadioGroupKeydown();
  }

  /**
   * Sets checkbox to disabled
   * @param {boolean|string} value If true will set `disabled` attribute
   */
  set disabled(value: boolean | string) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.DISABLED, value.toString());
    } else {
      this.removeAttribute(attributes.DISABLED);
    }
    this.handleDisabled();
  }

  get disabled(): boolean { return stringToBool(this.getAttribute(attributes.DISABLED)); }

  /**
   * Flips the checkbox orientation to horizontal
   * @param {boolean|string} value If true will set `horizontal` attribute
   */
  set horizontal(value: boolean | string) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.HORIZONTAL, value.toString());
    } else {
      this.removeAttribute(attributes.HORIZONTAL);
    }
    this.handleHorizontal();
  }

  get horizontal() { return stringToBool(this.getAttribute(attributes.HORIZONTAL)); }

  /**
   * Set the `label` text
   * @param {string} value of the `label` text property
   */
  set label(value: string | null) {
    const rootEl = this.shadowRoot?.querySelector('.ids-radio-group');
    let labelText = this.shadowRoot?.querySelector('.group-label-text');

    if (value) {
      this.setAttribute(attributes.LABEL, value);

      if (!labelText) {
        labelText = document.createElement('ids-text');
        labelText.className = 'group-label-text';
        const refEl = this.shadowRoot?.querySelector('slot') || null;
        rootEl?.insertBefore(labelText, refEl);
        labelText = this.shadowRoot?.querySelector('.group-label-text');
      }

      if (labelText) {
        labelText.innerHTML = value;
      }
      return;
    }
    this.removeAttribute(attributes.LABEL);
    labelText = this.shadowRoot?.querySelector('.group-label-text');
    labelText?.remove();
  }

  get label(): string | null { return this.getAttribute(attributes.LABEL); }

  /**
   * Sets the checkbox to required
   * @param {string | null} value The `label-required` attribute
   */
  set labelRequired(value: string | null) {
    const val = stringToBool(value);
    if (value) {
      this.setAttribute(attributes.LABEL_REQUIRED, value.toString());
    } else {
      this.removeAttribute(attributes.LABEL_REQUIRED);
    }
    this.labelEl?.classList[!val ? 'add' : 'remove']('no-required-indicator');
  }

  get labelRequired(): string | null { return this.getAttribute(attributes.LABEL_REQUIRED); }

  /**
   * Sets the checkbox `value` attribute
   * @param {string | null} value the value property
   */
  set value(value: string | null) {
    const radios = this.radios;

    if (!value) {
      this.removeAttribute(attributes.VALUE);
      radios.forEach((radio) => {
        radio.checked = false;
      });
      return;
    }

    radios.forEach((radio) => {
      if (radio.value === value) {
        radio.checked = true;
        this.setAttribute(attributes.VALUE, radio.value);
      } else {
        radio.checked = false;
      }
    });

    if (!this.radiosSelected?.length) {
      this.removeAttribute(attributes.VALUE);
    }
  }

  get value(): string | null { return this.getAttribute(attributes.VALUE); }
}
