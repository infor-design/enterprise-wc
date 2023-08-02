import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import { applyContentAlignmentClass } from './ids-accordion-common';

import IdsColorVariantMixin from '../../mixins/ids-color-variant-mixin/ids-color-variant-mixin';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsElement from '../../core/ids-element';

import styles from './ids-accordion-header.scss';
import IdsText from '../ids-text/ids-text';

import type IdsIcon from '../ids-icon/ids-icon';

// Expander Types
const EXPANDER_TYPES = ['caret', 'plus-minus'];

// Default Icons
const DEFAULT_ICON_OFF = 'caret-down';

// Submenu Style Icons
const ICON_MINUS = 'plusminus-folder-closed';
const ICON_PLUS = 'plusminus-folder-open';

const Base = IdsColorVariantMixin(
  IdsEventsMixin(
    IdsElement
  )
);

/**
 * IDS Accordion Header Component
 * @type {IdsAccordionHeader}
 * @inherits IdsElement
 * @mixes IdsColorVariantMixin
 * @mixes IdsEventsMixin
 * @part expander - this accoridon header's expander button element
 * @part header - the accordion header's root element
 * @part icon - the accordion header's icon element
 */
@customElement('ids-accordion-header')
@scss(styles)
export default class IdsAccordionHeader extends Base {
  depth = 0;

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    this.#refreshIconDisplay(this.icon);
    this.refreshDepth();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes(): Array<any> {
    return [
      ...super.attributes,
      attributes.CHILD_FILTER_MATCH,
      attributes.DISABLED,
      attributes.EXPANDED,
      attributes.EXPANDER_TYPE,
      attributes.HIDDEN_BY_FILTER,
      attributes.ICON,
      attributes.SELECTED
    ];
  }

  /**
   * @returns {Array<string>} List of available color variants for this component
   */
  colorVariants = [
    'app-menu',
    'sub-app-menu',
    'module-nav',
    'sub-module-nav'
  ];

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template(): string {
    return `
      <div class="ids-accordion-header" tabindex="0" part="header">
        <ids-icon class="ids-accordion-display-icon" part="display-icon"></ids-icon>
        <slot></slot>
        ${this.templateExpanderIcon()}
      </div>
    `;
  }

  /**
   * Expander Icon template contents
   * @returns {string} the Expander Icon template
   */
  templateExpanderIcon(): string {
    return `
      <ids-icon class="ids-accordion-expander-icon" icon=${DEFAULT_ICON_OFF} part="expander-icon"></ids-icon>
    `;
  }

  /**
   * @returns {boolean} true if this header component's panel is nested
   */
  get parentHasIcon() {
    let panel = this.panel;
    let parent = panel.parentElement;

    while (parent && parent.tagName === 'IDS-ACCORDION-PANEL') {
      if (parent.header && (parent.header.icon || parent.container.classList.contains('parent-has-icon'))) {
        return true;
      }
      panel = parent;
      parent = panel.parentElement;
    }

    return false;
  }

  /**
   * @readonly
   * @returns {IdsText | null} this Accordion Header's text node
   */
  get textNode(): IdsText | null {
    return this.querySelector<IdsText>('ids-text, span');
  }

  /**
   * @readonly
   * @returns {HTMLElement} this header's panel
   */
  get panel(): any {
    return this.parentElement;
  }

  /**
   * @param {string} thisAlignment the type of alignment to apply
   */
  refreshContentAlignment(thisAlignment: any) {
    if (this.container) applyContentAlignmentClass(this.container.classList, thisAlignment);
  }

  /**
   * @returns {boolean} true if this header's pane wrapper is expanded
   */
  get expanded(): boolean {
    return this.panel.expanded;
  }

  /**
   * @param {boolean} val true if this header should appear expanded
   */
  set expanded(val: boolean | string | null) {
    const trueVal = stringToBool(val);
    this.container?.classList[trueVal ? 'add' : 'remove']('expanded');
    this.panel.expanded = trueVal;

    if (trueVal) {
      this.triggerEvent('expanded', this, { bubbles: true });
    } else {
      this.triggerEvent('collapsed', this, { bubbles: true });
    }

    this.#refreshExpanderIconType();
  }

  /**
   * @returns {string} the current expander type
   */
  get expanderType(): string | null {
    return this.getAttribute(attributes.EXPANDER_TYPE);
  }

  /**
   * @param {string} val the type of expander to use
   */
  set expanderType(val: string | null) {
    const currentVal = this.expanderType;
    let trueVal = EXPANDER_TYPES[0];
    if (val && EXPANDER_TYPES.includes(val)) {
      trueVal = val;
    }

    if (currentVal !== trueVal) {
      this.setAttribute(attributes.EXPANDER_TYPE, String(val));
      this.toggleExpanderIcon(trueVal);
      this.#refreshExpanderIconClass(currentVal, trueVal);
    }
  }

  #refreshExpanderIconClass(oldType: any, newType: any) {
    const cl = this.container?.classList;
    const oldTypeClass = `expander-type-${oldType}`;
    const newTypeClass = `expander-type-${newType}`;
    cl?.remove(oldTypeClass);
    cl?.add(newTypeClass);
  }

  /**
   * Focuses this accordion header
   */
  focus(): void {
    this.container?.focus();
  }

  /**
   * @returns {string} the currently-displayed icon, if applicable
   */
  get icon() {
    return this.getAttribute('icon');
  }

  /**
   * @param {string} val the type of display icon to show
   */
  set icon(val: string | null) {
    if (this.icon !== val) {
      if (typeof val !== 'string' || !val.length) {
        this.removeAttribute('icon');
      } else {
        this.setAttribute('icon', `${val}`);
      }

      this.#refreshIconDisplay(val);
    }
  }

  /**
   * @param {string} val the icon definition to apply
   */
  #refreshIconDisplay(val: string | any[] | null) {
    const iconDef = typeof val === 'string' && val.length ? val : '';
    const iconElem = this.container?.querySelector<IdsIcon>('.ids-accordion-display-icon');

    if (iconElem) {
      iconElem.icon = iconDef;
      this.container?.classList[iconDef.length ? 'add' : 'remove']('has-icon');
    } else {
      this.container?.classList.remove('has-icon');
    }

    const hasParentIcon = this.parentHasIcon;
    this.container?.classList[hasParentIcon ? 'add' : 'remove']('parent-has-icon');
  }

  /**
   * @returns {boolean} true if this accordion header should appear "selected"
   */
  get selected(): boolean {
    return stringToBool(this.getAttribute(attributes.SELECTED));
  }

  /**
   * @param {boolean} val true if this accordion header should appear "selected"
   */
  set selected(val: boolean) {
    const currentValue = this.selected;
    const isValueTruthy = stringToBool(val);

    if (currentValue !== isValueTruthy) {
      if (isValueTruthy) {
        this.setAttribute(attributes.SELECTED, `${val}`);
      } else {
        this.removeAttribute(attributes.SELECTED);
      }
      this.#refreshSelected(isValueTruthy);

      if (isValueTruthy) {
        this.triggerEvent('selected', this, {
          bubbles: true,
          detail: {
            elem: this,
          }
        });
      }
    }
  }

  /**
   * Refreshes the visual "Selected" state
   * @param {boolean} isSelected true if the Accordion Header should appear "Selected"
   */
  #refreshSelected(isSelected: any) {
    this.container?.classList[isSelected ? 'add' : 'remove']('selected');

    const textNode = this.textNode;
    if (textNode && this.colorVariant === 'app-menu') {
      textNode.fontWeight = isSelected ? 'bold' : null;
    }
  }

  /**
   * Toggles the display of an expander icon
   * @param {boolean} val true if the expander icon should be displayed
   */
  toggleExpanderIcon(val: string | boolean) {
    if (this.panel.isExpandable && stringToBool(val)) {
      this.#showExpanderIcon();
    } else {
      this.#hideExpanderIcon();
    }
  }

  /**
   * Renders the expander icon, either adding it to the DOM or updating if it exists.
   */
  #showExpanderIcon(): void {
    const appendLocation = this.panel.hasParentPanel ? 'afterbegin' : 'beforeend';
    const expander = this.container?.querySelector('.ids-accordion-expander-icon');

    if (!expander) {
      // Apply the expander button in front of the text
      // for any variants prefixed with `sub-`.
      const expanderIcon = this.templateExpanderIcon();
      this.container?.insertAdjacentHTML(appendLocation, expanderIcon);
    } else if (appendLocation === 'afterbegin') {
      this.container?.prepend(expander);
    } else {
      this.container?.append(expander);
    }

    this.#refreshExpanderIconType();
  }

  /**
   * Removes the expander icon from the DOM.
   * @returns {void}
   */
  #hideExpanderIcon(): void {
    this.container?.querySelector('.ids-accordion-expander-icon')?.remove();
  }

  /**
   * Changes the visual style of the expander icon
   * @returns {void}
   */
  #refreshExpanderIconType(): void {
    const icon = this.container?.querySelector('.ids-accordion-expander-icon');
    if (!icon) {
      return;
    }

    let iconType = DEFAULT_ICON_OFF;
    if (this.expanderType === 'plus-minus') {
      iconType = this.expanded ? ICON_PLUS : ICON_MINUS;
    }
    icon.setAttribute('icon', iconType);
  }

  /**
   * @param {boolean} val true if this accordion header should appear to be "filtered",
   *  which usually means "hidden"
   */
  set hiddenByFilter(val: boolean) {
    if (stringToBool(val)) {
      this.setAttribute(attributes.HIDDEN_BY_FILTER, '');
      this.container?.classList.add(attributes.HIDDEN_BY_FILTER);
    } else {
      this.removeAttribute(attributes.HIDDEN_BY_FILTER);
      this.container?.classList.remove(attributes.HIDDEN_BY_FILTER);
    }
  }

  /**
   * @returns {boolean} true if this accordion header is currently displayed as "filtered"
   */
  get hiddenByFilter(): boolean {
    return this.hasAttribute(attributes.HIDDEN_BY_FILTER);
  }

  /**
   * @param {boolean} val true if this accordion header's panel contains a child panel
   * that matches the specified filter term, and should be displayed accordingly
   */
  set childFilterMatch(val: boolean) {
    if (stringToBool(val)) {
      this.setAttribute(attributes.CHILD_FILTER_MATCH, '');
      this.container?.classList.add(attributes.CHILD_FILTER_MATCH);
    } else {
      this.removeAttribute(attributes.CHILD_FILTER_MATCH);
      this.container?.classList.remove(attributes.CHILD_FILTER_MATCH);
    }
  }

  /**
   * @returns {boolean} true if this accordion header's panel contains a child panel
   * that matches the specified filter term, and should be displayed accordingly
   */
  get childFilterMatch(): boolean {
    return this.hasAttribute(attributes.HIDDEN_BY_FILTER);
  }

  /**
   * Gets disabled property
   * @readonly
   * @returns {boolean} true if accordion set to disable
   */
  get disabled() {
    return stringToBool(this.getAttribute(attributes.DISABLED));
  }

  /**
   * Sets disabled property
   * @param {boolean|string} value true/false
   */
  set disabled(value) {
    const disabled = stringToBool(value);

    if (disabled) {
      this.setAttribute(attributes.DISABLED, `${disabled}`);
      this.container?.classList.add(attributes.DISABLED);
    } else {
      this.removeAttribute(attributes.DISABLED);
      this.container?.classList.remove(attributes.DISABLED);
    }
  }

  refreshDepth() {
    if (!this.container) return;

    let depth = 0;
    let currentEl: HTMLElement = this;

    while (currentEl.parentElement && currentEl.parentElement.tagName === 'IDS-ACCORDION-PANEL') {
      depth += 1;
      currentEl = currentEl.parentElement;
    }

    if (this.depth) this.container.classList.remove(`depth-${this.depth}`);

    this.depth = depth;
    if (depth > 0) this.container.classList.add(`depth-${depth}`);
  }
}
