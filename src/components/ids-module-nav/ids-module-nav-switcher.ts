import { customElement, scss } from '../../core/ids-decorators';
import IdsElement from '../../core/ids-element';
import { requestAnimationTimeout } from '../../utils/ids-timer-utils/ids-timer-utils';

import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsModuleNavDisplayModeMixin from './ids-module-nav-display-mode-mixin';
import IdsModuleNavTextDisplayMixin from './ids-module-nav-text-display-mixin';

import styles from './ids-module-nav-switcher.scss';

import type IdsModuleNavButton from './ids-module-nav-button';
import type IdsDropdown from '../ids-dropdown/ids-dropdown';
import type IdsListBox from '../ids-list-box/ids-list-box';
import type IdsListBoxOption from '../ids-list-box/ids-list-box-option';
import type IdsIcon from '../ids-icon/ids-icon';

const Base = IdsModuleNavTextDisplayMixin(
  IdsModuleNavDisplayModeMixin(
    IdsEventsMixin(
      IdsElement
    )
  )
);

/**
 * IDS Module Nav Switcher Component
 * @type {IdsModuleNavSwitcher}
 * @inherits IdsElement
 */
@customElement('ids-module-nav-switcher')
@scss(styles)
export default class IdsModuleNavSwitcher extends Base {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    this.#attachEventHandlers();

    // Delay setup of Popup-related configuration in order to affect style
    // @TODO make this async/await when possible
    requestAnimationTimeout(() => {
      this.configureComponents();
    }, 2);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes(): Array<any> {
    return [...super.attributes];
  }

  /**
   * @returns {string} Module Switcher component template
   */
  template() {
    return `<div class="ids-module-nav-switcher">
      <slot></slot>
    </div>`;
  }

  /**
   * @readonly
   * @returns {IdsModuleNavButton} slotted Module Button element
   */
  get moduleButtonEl() {
    return this.querySelector<IdsModuleNavButton>('ids-module-nav-button');
  }

  /**
   * @readonly
   * @returns {IdsIcon} slotted Module Button Icon element
   */
  get moduleButtonIconEl() {
    return this.moduleButtonEl?.querySelector<IdsIcon>('ids-icon');
  }

  /**
   * @readonly
   * @returns {IdsDropdown} slotted Module Button element
   */
  get roleDropdownEl() {
    return this.querySelector<IdsDropdown>('ids-dropdown');
  }

  get roleDropdownListEl() {
    return this.roleDropdownEl?.dropdownList;
  }

  configureComponents() {
    const COLOR_VARIANT_NAME = 'module-nav';
    const POPUP_X_OFFSET = 44;
    const POPUP_Y_OFFSET = 8;

    if (this.moduleButtonEl) {
      this.moduleButtonEl.colorVariant = COLOR_VARIANT_NAME;
      this.moduleButtonEl.displayMode = this.displayMode;
    }

    if (this.roleDropdownEl) {
      this.roleDropdownEl.colorVariant = COLOR_VARIANT_NAME;
      this.roleDropdownEl.dropdownIcon = 'expand-all';
      this.roleDropdownEl.label = 'Role Selector';
      this.roleDropdownEl.labelState = 'collapsed';
      this.roleDropdownEl.showListItemIcon = false;
      this.roleDropdownEl.size = 'full';

      this.roleDropdownEl.onColorVariantRefresh = () => {
        const dropdownEl = this.roleDropdownEl;
        if (!dropdownEl) return;

        // Always hide the icon for Module Switcher Dropdown trigger elements
        if (dropdownEl) {
          dropdownEl.showListItemIcon = false;
        }

        if (dropdownEl.input) dropdownEl.input.colorVariant = COLOR_VARIANT_NAME;
        if (dropdownEl.dropdownList) {
          dropdownEl.dropdownList.colorVariant = COLOR_VARIANT_NAME;
          if (dropdownEl.dropdownList.popup) {
            dropdownEl.dropdownList.popup.type = COLOR_VARIANT_NAME;
          }
        }
      };

      const listBox = this.roleDropdownEl.querySelector<IdsListBox>('ids-list-box');
      listBox?.classList.add('module-nav');

      const opts = [...this.roleDropdownEl.querySelectorAll<IdsListBoxOption>('ids-list-box-option')];
      opts.forEach((opt) => opt.classList.add('module-nav'));
    }

    if (this.roleDropdownListEl) {
      this.roleDropdownListEl.showListItemIcon = true;

      // Always reposition this popup correctly
      const popup = this.roleDropdownListEl?.popup;
      if (popup) {
        popup.type = 'module-nav';
        popup.align = 'bottom, left';
        popup.arrow = 'none';
        popup.style.left = `-${POPUP_X_OFFSET}px`;

        popup.onPlace = (popupRect: DOMRect) => {
          popupRect.x -= POPUP_X_OFFSET;
          popupRect.y += POPUP_Y_OFFSET;
          return popupRect;
        };
      }
    }
  }

  #attachEventHandlers() {
    // Whenever IdsDropdown opens, reconfigure some styles
    this.onEvent('open', this.roleDropdownEl, () => {
      this.configureComponents();
    });

    this.onEvent('selected', this.roleDropdownEl, (e: CustomEvent) => {
      const selectedOption = (e.detail.selectedElem as IdsListBoxOption | null);
      const icon = selectedOption?.querySelector<IdsIcon>('ids-icon');
      const moduleButtonIconEl = this.moduleButtonIconEl;
      if (moduleButtonIconEl && icon) moduleButtonIconEl.icon = icon.icon;
    });
  }

  onDisplayModeChange(): void {
    this.configureComponents();
  }
}
