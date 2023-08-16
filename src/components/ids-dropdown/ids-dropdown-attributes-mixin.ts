import { attributes } from '../../core/ids-attributes';
import { IdsConstructor } from '../../core/ids-element';
import { setBooleanAttr } from '../../utils/ids-attribute-utils/ids-attribute-utils';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import { IdsDropdownCommonAttributes } from './ids-dropdown-common';

export interface DropdownAttributeMixinInterface {
  // as instance functions
  onAllowBlankChange?(newValue: boolean): void;
  onClearableTextChange?(newValue: string | null): void;
  onDropdownIconChange?(newValue: string | null): void;
  onSizeChange?(newValue: string): void;
  onShowListItemIcon?(newValue: boolean): void;
}

type Constraints = IdsConstructor<DropdownAttributeMixinInterface>;

/**
 * A mixin that adds shared attribute setters/getters/callbacks related to IdsMonthView behaviors.
 * @mixin IdsMonthViewAttributeMixin
 * @param {any} superclass Accepts a superclass and creates a new subclass from it.
 * @returns {any} The extended object
 */
const IdsDropdownAttributeMixin = <T extends Constraints>(superclass: T) => class extends superclass {
  constructor(...args: any[]) {
    super(...args);
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...(superclass as any).attributes,
      ...IdsDropdownCommonAttributes
    ];
  }

  connectedCallback() {
    super.connectedCallback?.();

    // Detect icon setting
    const dropdownIcon = this.dropdownIcon;
    if (dropdownIcon && typeof this.onDropdownIconChange === 'function') {
      this.onDropdownIconChange(dropdownIcon);
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback?.();
  }

  /**
   * Sets allow-blank setting
   * @param {string|boolean} value adds blank option if true
   */
  set allowBlank(value: boolean) {
    const truthyValue = stringToBool(value);
    if (truthyValue) {
      this.setAttribute(attributes.ALLOW_BLANK, '');
    } else {
      this.removeAttribute(attributes.ALLOW_BLANK);
    }

    if (typeof this.onAllowBlankChange === 'function') this.onAllowBlankChange(truthyValue);
  }

  /**
   * Gets allow-blank value
   * @returns {boolean} allow-blank value
   */
  get allowBlank(): boolean {
    return stringToBool(this.getAttribute(attributes.ALLOW_BLANK));
  }

  /**
   * When set the value can be cleared with Backspace/Delete
   * @param {boolean|string|null} value clearable value
   */
  set clearable(value: boolean | string | null) {
    const boolVal = stringToBool(value);

    if (boolVal) {
      this.setAttribute(attributes.CLEARABLE, String(boolVal));
    } else {
      this.removeAttribute(attributes.CLEARABLE);
    }
  }

  get clearable() { return stringToBool(this.getAttribute(attributes.CLEARABLE)); }

  /**
   * When set the blank option will have a text
   * @param {string|null} value blank option text
   */
  set clearableText(value: string | null) {
    if (value) {
      this.setAttribute(attributes.CLEARABLE_TEXT, value);
    } else {
      this.removeAttribute(attributes.CLEARABLE_TEXT);
    }

    if (typeof this.onClearableTextChange === 'function') this.onClearableTextChange(value);
  }

  get clearableText() { return this.getAttribute(attributes.CLEARABLE_TEXT); }

  /**
   * @param {string | null} val dropdown icon string
   */
  set dropdownIcon(val: string | null) {
    const isValid = typeof val === 'string' && val.length;
    if (isValid) {
      this.setAttribute(attributes.DROPDOWN_ICON, `${val}`);
    } else {
      this.removeAttribute(attributes.DROPDOWN_ICON);
    }
    if (typeof this.onDropdownIconChange === 'function') this.onDropdownIconChange(val);
  }

  /**
   * @returns {string | null} dropdown icon string
   */
  get dropdownIcon() {
    return this.getAttribute(attributes.DROPDOWN_ICON);
  }

  /**
   * Set the dropdown size
   * @param {string} value The value
   */
  set size(value: string) {
    if (value) {
      this.setAttribute(attributes.SIZE, value);
      if (value === 'full') this.container?.classList.add('full');
    } else {
      this.removeAttribute(attributes.SIZE);
      this.container?.classList.remove('full');
    }

    if (typeof this.onSizeChange === 'function') this.onSizeChange(value);
  }

  get size(): string { return this.getAttribute(attributes.SIZE) ?? 'md'; }

  /**
   * Set the element's ability to display an optional icon in front of the text
   * @param {boolean} value The value
   */
  set showListItemIcon(value: boolean) {
    setBooleanAttr(attributes.SHOW_LIST_ITEM_ICON, this, value);
    if (typeof this.onShowListItemIcon === 'function') this.onShowListItemIcon(value);
  }

  get showListItemIcon(): boolean {
    return this.hasAttribute(attributes.SHOW_LIST_ITEM_ICON);
  }
};

export default IdsDropdownAttributeMixin;
