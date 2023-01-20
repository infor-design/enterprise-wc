import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';

import Base from './ids-dropdown-list-base';

import styles from './ids-dropdown-list.scss';
import type IdsListBox from '../ids-list-box/ids-list-box';

/**
 * IDS Dropdown List Component
 * @type {IdsDropdownList}
 * @inherits IdsPickerPopup
 * @mixes IdsLocaleMixin
 * @part dropdown-list - the dropdown list element
 */
@customElement('ids-dropdown-list')
@scss(styles)
export default class IdsDropdownList extends Base {
  listBox?: IdsListBox | null;

  constructor() {
    super();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.ALLOW_BLANK,
      attributes.CLEARABLE,
      attributes.CLEARABLE_TEXT,
      attributes.DISABLED,
      attributes.GROUP,
      attributes.GROUP_LABEL,
      attributes.NO_MARGINS,
      attributes.PLACEHOLDER,
      attributes.READONLY,
      attributes.SIZE,
      attributes.TYPEAHEAD,
      attributes.VALUE
    ];
  }

  template() {
    return `<ids-popup class="ids-dropdown-list" type="menu" part="dropdown-list">
      <slot slot="content"></slot>
    </ids-popup>`;
  }

  /**
   * Invoked each time the custom element is appended into a document-connected element.
   */
  connectedCallback() {
    super.connectedCallback();
    this.configurePopup();
    this.attachEventHandlers();
  }

  onHide() {
    this.setAriaOnMenuClose();
  }

  onShow() {
    this.setAriaOnMenuOpen();
  }

  onTargetChange() {
    const id = this.getAttribute(attributes.ID);
    if (id) this.target?.setAttribute(attributes.LIST, `#${id}`);
  }

  private attachEventHandlers() {
    this.offEvent('click.dropdown-list-box');
    this.onEvent('click.dropdown-list-box', this.listBox, (e: any) => {
      // Excluding group labels
      if (e.target?.hasAttribute(attributes.GROUP_LABEL) || e.target.closest('ids-list-box-option')?.hasAttribute(attributes.GROUP_LABEL)) {
        return;
      }

      if (e.target.nodeName === 'IDS-LIST-BOX-OPTION') {
        this.value = e.target.getAttribute('value');
      }

      if (e.target.closest('ids-list-box-option')) {
        this.value = e.target.closest('ids-list-box-option').getAttribute('value');
      }

      this.hide();
    });
  }

  private configurePopup() {
    if (this.popup) {
      this.popup.type = 'dropdown';
      // this.popup.alignTarget = this.input?.fieldContainer as IdsPopupElementRef;
      this.popup.align = 'bottom, left';
      this.popup.arrow = 'none';
      this.popup.y = -1;
      this.popup.x = 0;
      // Fix aria if the menu is closed
      if (!this.popup.visible) {
        this.setAriaOnMenuClose();
      }
    }
  }

  /**
   * Add internal aria attributes while open
   * @private
   * @returns {void}
   */
  private setAriaOnMenuOpen(): void {
    this.setAttribute('aria-expanded', 'true');

    // Add aria for the open state
    const selected = this.selectedOption || this.querySelector('ids-list-box-option:not([group-label])');
    this.listBox?.setAttribute('tabindex', '0');

    if (selected && this.value) {
      this.selectOption(selected);

      if (!this.typeahead) {
        selected.focus();
      }
    }
  }

  /**
   * Add internal aria attributes while closed
   * @private
   * @returns {void}
   */
  private setAriaOnMenuClose() {
    this.setAttribute('aria-expanded', 'false');
    this.listBox?.removeAttribute('tabindex');

    const selected = this.selected;

    if (selected) {
      this.deselectOption(selected);
    }
  }
}
