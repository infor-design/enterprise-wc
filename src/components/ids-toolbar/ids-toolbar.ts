import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import { getClosestContainerNode, getClosest } from '../../utils/ids-dom-utils/ids-dom-utils';
import { stripTags } from '../../utils/ids-xss-utils/ids-xss-utils';

import './ids-toolbar-section';
import './ids-toolbar-more-actions';

import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsKeyboardMixin from '../../mixins/ids-keyboard-mixin/ids-keyboard-mixin';
import IdsElement from '../../core/ids-element';

import styles from './ids-toolbar.scss';
import type IdsToolbarMoreActions from './ids-toolbar-more-actions';

const FORMATTER_VARIANT = 'alternate-formatter';
const TOOLBAR_TYPES = ['formatter'];

const Base = IdsKeyboardMixin(
  IdsEventsMixin(
    IdsElement
  )
);

/**
 * IDS Toolbar Component
 * @type {IdsToolbar}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 */
@customElement('ids-toolbar')
@scss(styles)
export default class IdsToolbar extends Base {
  /**
   * Watches for Toolbar size changes
   */
  #resizeObserver?: ResizeObserver | null;

  constructor() {
    super();
  }

  static get attributes(): Array<string> {
    return [
      ...super.attributes,
      attributes.DISABLED,
      attributes.PADDING,
      attributes.TABBABLE,
      attributes.TYPE
    ];
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('role', 'toolbar');
    this.#attachEventHandlers();
    this.#attachKeyboardListeners();
    this.#configureResizeObserver();
    this.#setType(null, this.type);
    this.makeTabbable(this.detectTabbable());

    if (this.hasAttribute(attributes.PADDING)) {
      this.padding = this.getAttribute(attributes.PADDING) as string;
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback?.();
    if (this.#resizeObserver) {
      this.#resizeObserver.disconnect();
      this.#resizeObserver = null;
    }
  }

  /**
   * Configures the resize observer.
   * @private
   */
  #configureResizeObserver(): void {
    this.#resizeObserver = new ResizeObserver(() => {
      this.#resize();
    });
    this.#resizeObserver.observe(this);
  }

  /**
   * Sets up event handlers assigned to the Toolbar and its child elements
   * @private
   * @returns {void}
   */
  #attachEventHandlers(): void {
    // Translate click events on buttons into Toolbar `selected` events to correspond
    // to the behavior of menu buttons and the "More Actions" menu
    this.onEvent('click.toolbar-item', this, (e: any) => {
      const btn = e.target.closest('ids-button');
      if (btn) {
        this.triggerSelectedEvent(btn);
      }
    });
  }

  /**
   * Sets up the connection to the global keyboard handler
   * @private
   * @returns {void}
   */
  #attachKeyboardListeners(): void {
    // Arrow Up navigates focus backward
    this.listen(['ArrowLeft'], this, (e: any) => {
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
    this.listen(['ArrowRight'], this, (e: any) => {
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
   * @returns {HTMLElement} the item that will be focused
   */
  navigate(amt = 0, doFocus = false): HTMLElement {
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

      // Don't count disabled/overflowed items as "taking a step"
      if (!currentItem.disabled && !currentItem.hasAttribute(attributes.OVERFLOWED)) {
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
   * Set all buttons to disabled on the toolbar
   * @param {boolean | string} val sets the disabled state of the entire toolbar
   */
  set disabled(val: boolean | string) {
    const trueVal = stringToBool(val);

    if (trueVal) {
      this.setAttribute(attributes.DISABLED, val.toString());
    } else {
      this.removeAttribute(attributes.DISABLED);
    }

    this.container?.classList[trueVal ? 'add' : 'remove'](attributes.DISABLED);

    // Set disabled state on all relevant subcomponents
    const setDisabledState = (elem: any) => {
      if (elem.id === 'more-actions') {
        const trueElem = getClosest(elem, 'ids-toolbar-more-actions');
        trueElem.disabled = trueVal;
      } else {
        elem.disabled = trueVal;
      }
    };
    this.items.forEach(setDisabledState);
    this.textElems.forEach(setDisabledState);
    this.refreshOverflowedItems();
  }

  /**
   * @returns {boolean} true if the toolbar is currently disabled
   */
  get disabled(): boolean {
    return !!this.container?.classList?.contains(attributes.DISABLED);
  }

  /**
   * Refreshes the overflow state of toolbar items
   * @returns {void}
   */
  refreshOverflowedItems(): void {
    const moreActions = this.querySelector<IdsToolbarMoreActions>('ids-toolbar-more-actions');
    if (moreActions) {
      moreActions.refreshOverflowedItems();
    }
  }

  /**
   * @readonly
   * @returns {any | undefined} the currently focused menu item, if one exists
   */
  get focused(): any | undefined {
    // @TODO clean this up / document why/how it works
    return this.items.find((item: any) => {
      const container: any = getClosestContainerNode(item);
      const focused = container.activeElement;
      const isEqualNode = focused?.isEqualNode(item);
      return isEqualNode;
    });
  }

  /**
   * @readonly
   * @returns {Array<HTMLElement>} list of all available toolbar items present in all toolbar sections
   */
  get items(): Array<HTMLElement> {
    const i: any = [];
    this.sections.forEach((section: any) => {
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
   * @returns {Array<HTMLElement>} list of all available text nodes present in all toolbar sections
   */
  get textElems(): Array<HTMLElement> {
    const i: any = [];
    this.sections.forEach((section: any) => {
      if (section?.name !== 'ids-toolbar-more-actions') {
        i.push(...section.textElems);
      }
    });
    return i;
  }

  /**
   * @readonly
   * @returns {Array<HTMLElement>} list of all available ids-separator nodes present in all toolbar sections
   */
  get separators(): Array<HTMLElement> {
    const sep: any = [];
    this.sections.forEach((section: any) => {
      if (section?.name !== 'ids-toolbar-more-actions' && section?.separators) {
        sep.push(...section.separators);
      }
    });
    return sep;
  }

  /**
   * @readonly
   * @returns {Array<HTMLElement>} list of available sections within the toolbar
   */
  get sections(): Array<any> {
    return [...this.children].filter((e) => e.matches('ids-toolbar-section, ids-toolbar-more-actions'));
  }

  /**
   * If true, sets the Toolbar mode to allow ALL items to have a usable tabIndex.
   * Default is false, which means one Toolbar element is focusable at a time.
   * @param {boolean | string} val sets the tabbable state of the toolbar
   */
  set tabbable(val: boolean | string) {
    const trueVal = stringToBool(val);

    if (trueVal) {
      this.setAttribute(attributes.TABBABLE, trueVal.toString());
    } else {
      this.removeAttribute(attributes.TABBABLE);
    }

    this.container?.classList[trueVal ? 'add' : 'remove'](attributes.TABBABLE);

    // Try to use a currently-focused element
    this.makeTabbable(this.focused);
  }

  /**
   * @returns {boolean} true if the toolbar is fully tabbable
   */
  get tabbable(): boolean {
    return !!this.container?.classList.contains(attributes.TABBABLE);
  }

  /**
   * Set the type for toolbar
   * @param {string | null} value of toolbar type
   */
  set type(value: string | null) {
    let safeValue: any = null;
    if (typeof value === 'string') {
      safeValue = stripTags(value, '');
    }

    const currentValue = this.type;
    if (currentValue !== safeValue) {
      if (TOOLBAR_TYPES.includes(safeValue)) {
        this.setAttribute(attributes.TYPE, `${safeValue}`);
      } else {
        this.removeAttribute(attributes.TYPE);
        safeValue = null;
      }
      this.#setType(currentValue, safeValue);
    }
  }

  get type(): string | null {
    return this.getAttribute(attributes.TYPE) ?? null;
  }

  /**
   * If set to number the container will have padding added (in pixels)
   * @param {string | number} value sets the padding to the container
   */
  set padding(value: string | number | null) {
    if (value !== null) {
      this.setAttribute(attributes.PADDING, value.toString());
      this.container?.style.setProperty('padding-bottom', `${value}px`);
    } else {
      this.removeAttribute(attributes.PADDING);
      this.container?.style.removeProperty('padding-bottom');
    }
  }

  get padding(): string | null {
    return this.getAttribute(attributes.PADDING);
  }

  /**
   * Set the toolbar type to each section
   * @private
   * @param {string|null} oldType the type class to remove
   * @param {string|null} newType the type class to add
   * @returns {void}
   */
  #setType(oldType: string | null, newType: string | null) {
    const cl = this.container?.classList;

    // Update CSS Class for main Toolbar type
    if (oldType) cl?.remove(`type-${oldType}`);
    if (newType) cl?.add(`type-${newType}`);

    // If using a "formatter" type, change the buttons/separators/etc to use the alternate style
    this.sections.forEach((s) => {
      s.setAttribute(attributes.TOOLBAR_TYPE, `${newType}`);
      if (s.tagName === 'IDS-TOOLBAR-MORE-ACTIONS') {
        if (newType === 'formatter') {
          s.colorVariant = FORMATTER_VARIANT;
        } else {
          s.colorVariant = null;
        }
      }
    });
    [...this.items, ...this.separators].forEach((item) => {
      if (newType === 'formatter') {
        item.setAttribute(attributes.COLOR_VARIANT, FORMATTER_VARIANT);
      } else {
        const val = item.getAttribute(attributes.COLOR_VARIANT);
        if (val === FORMATTER_VARIANT) item.removeAttribute(attributes.COLOR_VARIANT);
      }
    });
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
    this.items.forEach((item: HTMLElement) => {
      const nonTabbableTargetIndex = elem.isEqualNode(item) ? 0 : -1;
      item.tabIndex = isTabbable ? 0 : nonTabbableTargetIndex;
    });
  }

  #resize() {
    this.refreshOverflowedItems();
  }

  /**
   * Triggers a `selected` event on a specified Toolbar item
   * @param {HTMLElement} elem the specified Toolbar item
   * @param {boolean} [triggeredFromOverflow] if true, notifies the event handler that this
   *  `selected` event originated from the Overflow menu
   * @returns {void}
   */
  triggerSelectedEvent(elem: any, triggeredFromOverflow = false) {
    // Don't trigger these events on non-Toolbar items
    if (!this.contains(elem)) {
      return;
    }

    const detail: any = {
      elem,
      value: elem.value
    };

    // Handle Overflowed items
    if (elem.overflowTarget) {
      detail.elem = elem.overflowTarget;
      detail.value = elem.overflowTarget.value;
      detail.overflowMenuItem = elem;
      detail.triggeredFromOverflow = triggeredFromOverflow;
    }

    elem.dispatchEvent(new CustomEvent('selected', {
      bubbles: true,
      detail
    }));
  }
}
