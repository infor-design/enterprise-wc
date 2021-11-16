import {
  IdsElement,
  mix,
  scss,
  customElement
} from '../../core';

// Import Utils
import { IdsStringUtils, IdsDOMUtils } from '../../utils';

// Import Dependencies
import IdsToolbarSection, { TOOLBAR_ITEM_TAGNAMES } from './ids-toolbar-section';
import IdsToolbarMoreActions from './ids-toolbar-more-actions';
import { attributes } from '../../core/ids-attributes';

// Import Mixins
import { IdsEventsMixin, IdsKeyboardMixin } from '../../mixins';

// Import Styles
import styles from './ids-toolbar.scss';

/**
 * IDS Toolbar Component
 */
@customElement('ids-toolbar')
@scss(styles)
class IdsToolbar extends mix(IdsElement).with(IdsEventsMixin, IdsKeyboardMixin) {
  constructor() {
    super();
  }

  static get attributes() {
    return [
      attributes.DISABLED,
      attributes.TABBABLE
    ];
  }

  connectedCallback() {
    this.setAttribute('role', 'toolbar');
    this.#attachKeyboardListeners();

    // After repaint
    requestAnimationFrame(() => {
      this.makeTabbable(this.detectTabbable());
    });
  }

  /**
   * Sets up the connection to the global keyboard handler
   * @private
   * @returns {void}
   */
  #attachKeyboardListeners() {
    // Arrow Up navigates focus backward
    this.listen(['ArrowLeft'], this, (e) => {
      e.preventDefault();
      e.stopPropagation();

      // If the target is a menu item, either a menu or actions button is currently open
      // with its children focused, and navigation shouldn't continue
      if (e.target.name === 'ids-menu-item') {
        return;
      }
      this.navigate(-1, true);
    });

    // Arrow Right navigates focus forward
    this.listen(['ArrowRight'], this, (e) => {
      e.preventDefault();
      e.stopPropagation();

      // If the target is a menu item, either a menu or actions button is currently open
      // with its children focused, and navigation shouldn't continue
      if (e.target.name === 'ids-menu-item') {
        return;
      }
      this.navigate(1, true);
    });
  }

  /**
   * Uses a currently-highlighted toolbar item to "navigate" a specified number
   * of steps to another toolbar item, highlighting it.
   * @param {number} [amt] the amount of items to navigate
   * @param {boolean} [doFocus] if true, causes the new item to become focused.
   * @returns {any} the item that will be focused
   */
  navigate(amt = 0, doFocus = false) {
    const items = this.items;
    let currentItem = this.focused || items[0];

    if (typeof amt !== 'number') {
      return currentItem;
    }

    // Calculate steps/meta
    const negative = amt < 0;
    let steps = Math.abs(amt);
    let currentIndex = items.indexOf(currentItem);

    // Step through items to the target
    while (steps > 0) {
      currentItem = items[currentIndex + (negative ? -1 : 1)];
      currentIndex = items.indexOf(currentItem);

      // "-1" means we've crossed the boundary and need to loop back around
      if (currentIndex < 0) {
        currentIndex = (negative ? items.length - 1 : 0);
        currentItem = items[currentIndex];
      }

      // Don't count disabled items as "taking a step"
      if (!currentItem.disabled) {
        steps -= 1;
      }
    }

    if (!currentItem.disabled && doFocus) {
      this.makeTabbable(currentItem);
      currentItem.focus();
    }

    return currentItem;
  }

  template() {
    return `<div class="ids-toolbar" role="toolbar">
      <slot></slot>
    </div>`;
  }

  /**
   * @param {boolean} val sets the disabled state of the entire toolbar
   */
  set disabled(val) {
    const trueVal = IdsStringUtils.stringToBool(val);

    if (trueVal) {
      this.setAttribute('disabled', val);
    } else {
      this.removeAttribute('disabled');
    }

    this.container.classList[trueVal ? 'add' : 'remove']('disabled');

    // Set disabled state on all relevant subcomponents
    const setDisabledState = (elem) => {
      elem.disabled = trueVal;
    };
    this.items.forEach(setDisabledState);
    this.textElems.forEach(setDisabledState);
  }

  /**
   * @returns {boolean} true if the toolbar is currently disabled
   */
  get disabled() {
    return this.container.classList.contains('disabled');
  }

  /**
   * @readonly
   * @returns {any} the currently focused menu item, if one exists
   */
  get focused() {
    // @TODO clean this up / document why/how it works
    return this.items.find((item) => {
      const container = IdsDOMUtils.getClosestContainerNode(item);
      const focused = container.activeElement;
      const isEqualNode = focused?.isEqualNode(item);
      return isEqualNode;
    });
  }

  /**
   * @readonly
   * @returns {Array<any>} list of all available toolbar items present in all toolbar sections
   */
  get items() {
    const i = [];
    this.sections.forEach((section) => {
      // Pass along the More Actions button, if applicable
      if (section?.name === 'ids-toolbar-more-actions') {
        i.push(section.button);
      } else if (section.items) {
        i.push(...section.items);
      }
    });
    return i;
  }

  /**
   * @readonly
   * @returns {Array<any>} list of all available text nodes present in all toolbar sections
   */
  get textElems() {
    const i = [];
    this.sections.forEach((section) => {
      if (section?.name !== 'ids-toolbar-more-actions') {
        i.push(...section.textElems);
      }
    });
    return i;
  }

  /**
   * @readonly
   * @returns {Array<any>} list of available sections within the toolbar
   */
  get sections() {
    return [...this.children].filter((e) => e.matches('ids-toolbar-section, ids-toolbar-more-actions'));
  }

  /**
   * If true, sets the Toolbar mode to allow ALL items to have a usable tabIndex.
   * Default is false, which means one Toolbar element is focusable at a time.
   * @param {boolean} val sets the tabbable state of the toolbar
   */
  set tabbable(val) {
    const trueVal = IdsStringUtils.stringToBool(val);

    if (trueVal) {
      this.setAttribute('tabbable', val);
    } else {
      this.removeAttribute('tabbable');
    }

    this.container.classList[trueVal ? 'add' : 'remove']('tabbable');

    // Try to use a currently-focused element
    this.makeTabbable(this.focused);
  }

  /**
   * @returns {boolean} true if the toolbar is fully tabbable
   */
  get tabbable() {
    return this.container.classList.contains('tabbable');
  }

  /**
   * Gets the current item that should be used as the "tabbable" item
   * (item that receives focus when the toolbar overall is "focused").
   * @returns {HTMLElement | undefined} an element that currently has a usable tabIndex attribute
   */
  detectTabbable() {
    let tabbableItem;
    for (let i = 0; !tabbableItem && i < this.items.length; i++) {
      if (this.items[i].tabIndex > -1) {
        tabbableItem = this.items[i];
      }
    }
    return tabbableItem;
  }

  /**
   * @private
   * @param {HTMLElement} elem an element residing within the toolbar that can accept
   */
  makeTabbable(elem = this.items[0]) {
    const isTabbable = this.tabbable;
    this.items.forEach((item) => {
      const nonTabbableTargetIndex = elem.isEqualNode(item) ? 0 : -1;
      item.tabIndex = isTabbable ? 0 : nonTabbableTargetIndex;
    });
  }
}

export default IdsToolbar;
export { IdsToolbarSection, IdsToolbarMoreActions, TOOLBAR_ITEM_TAGNAMES };
