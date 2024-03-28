import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsElement from '../../core/ids-element';

import IdsTreeShared from './ids-tree-shared';
import '../ids-badge/ids-badge';
import '../ids-text/ids-text';
import '../ids-checkbox/ids-checkbox';

import styles from './ids-tree-node.scss';
import type IdsTree from './ids-tree';
import type IdsCheckbox from '../ids-checkbox/ids-checkbox';
import { getClosest } from '../../utils/ids-dom-utils/ids-dom-utils';

const Base = IdsLocaleMixin(
  IdsEventsMixin(
    IdsElement
  )
);

/**
 * IDS Tree Node Component
 * @type {IdsTreeNode}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsLocaleMixin
 * @part group-node - the group node element
 * @part node - the node element
 * @part node-container - the node container element
 * @part icon - the icon element
 * @part toggle-icon - the toggle icon element
 * @part text - the text element
 */
@customElement('ids-tree-node')
@scss(styles)
export default class IdsTreeNode extends Base {
  /**
   * Main node container
   */
  nodeContainer?: HTMLElement | null = null;

  groupNodesEl?: HTMLElement | null = null;

  tree?: IdsTree | null = null;

  constructor() {
    super();
  }

  /**
   * Invoked each time the custom element is appended into a document-connected element.
   */
  connectedCallback() {
    super.connectedCallback();
    this.nodeContainer = this.shadowRoot?.querySelector('.node-container');
    this.groupNodesEl = this.shadowRoot?.querySelector('.group-nodes');
    this.#attachEventListeners();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.COLLAPSE_ICON,
      attributes.DISABLED,
      attributes.EXPAND_ICON,
      attributes.EXPANDED,
      attributes.ICON,
      attributes.LABEL,
      attributes.SELECTABLE,
      attributes.SELECTED,
      attributes.TABBABLE,
      attributes.EXPAND_TARGET
    ];
  }

  get isGroup(): boolean {
    const isNodeEl = (el: HTMLElement) => /^ids-tree-node$/i.test(el.nodeName);
    return [...this.childNodes].some((el) => isNodeEl(el as HTMLElement))
      || !!this.container?.querySelector('.group-nodes');
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    // Set the closest tree element
    this.tree = this.tree || getClosest(this, 'ids-tree');

    // Set the type is group or node
    const isNodeEl = (el: HTMLElement) => /^ids-tree-node$/i.test(el.nodeName);

    // Set group template
    if (this.isGroup) {
      let childNodesHTML = '';
      for (let i = 0; i < this.childNodes.length; i++) {
        const node = this.childNodes[i] as HTMLElement;
        if (isNodeEl(node)) {
          childNodesHTML += node.outerHTML;
        }
      }
      const templ = this.getTemplate(true);
      // Handle empty parent nodes
      return templ.replace('{group-nodes}', childNodesHTML.replace('<ids-tree-node></ids-tree-node>', ''));
    }

    // Node template
    return this.getTemplate();
  }

  /**
   * Select node
   * @private
   * @param {boolean|undefined} isGroup If true node type is group
   * @returns {string} The html template
   */
  getTemplate(isGroup?: boolean) {
    const disabled = `${this.disabled ? ' disabled' : ''}`;
    const selected = `${this.isSelected ? ' selected' : ''}`;
    const ariaDisabled = ` aria-disabled="${this.disabled}"`;
    const ariaSelected = ` aria-selected="${this.isSelected}"`;
    const tabindex = ` tabindex="${this.isTabbable ? '0' : '-1'}"`;

    if (isGroup) {
      const ariaExpanded = ` aria-expanded="${this.expanded}"`;
      const cssClass = `class="ids-tree-node ${this.toggleClass}"`;
      return `<li ${cssClass} part="group-node" role="none"${disabled}${selected}>
          <span class="node-container" part="node-container" role="treeitem"${tabindex}${disabled}${selected}${ariaDisabled}${ariaSelected}${ariaExpanded}>
            <ids-icon class="icon" icon="${this.nodeIcon}" part="icon"></ids-icon>
            ${this.toggleIconHtml}
            ${this.isMultiSelect ? `<ids-checkbox label="${this.label}" ${disabled}></ids-checkbox>` : ''}
            <slot name="badge" class="badge"></slot>
            <ids-text class="text" part="text" ${this.isMultiSelect ? 'hidden' : ''}>${this.label}</ids-text>
          </span>
          <ul class="group-nodes" role="group">{group-nodes}</ul>
        </li>`;
    }

    return `
      <li class="ids-tree-node" part="node" role="none"${disabled}${selected}>
        <span class="node-container" part="node-container" role="treeitem"${tabindex}${disabled}${selected}${ariaDisabled}${ariaSelected}>
          <ids-icon class="icon" part="icon" icon="${this.nodeIcon}"></ids-icon>
          ${this.isMultiSelect ? `<ids-checkbox label="${this.label}" ${disabled}></ids-checkbox>` : ''}
          <slot name="badge" class="badge"></slot>
          <ids-text class="text" part="text" ${this.isMultiSelect ? 'hidden' : ''}><slot></slot></ids-text>
        </span>
      </li>`;
  }

  /**
   * Get tree attribute value for given selector
   * @private
   * @param {string} selector The selector string
   * @returns {string|null} The tree attribute value
   */
  treeAttribute(selector: string) {
    return this.tree?.getAttribute(selector);
  }

  /**
   * Set focus to node container
   * @returns {void}
   */
  setFocus(): void {
    (this.nodeContainer as any).focus();
  }

  /**
   * Set the node to be expanded/collapsed
   * @private
   * @returns {void}
   */
  #setExpandCollapse() {
    const iconEl = this.shadowRoot?.querySelector('.icon');
    iconEl?.setAttribute(attributes.ICON, this.nodeIcon);
    this.container?.classList.remove(...Object.values(IdsTreeShared.TOGGLE_CLASSES));
    this.container?.classList.add(this.toggleClass);
    this.nodeContainer?.setAttribute('aria-expanded', this.expanded.toString());

    if (this.expandTarget === 'icon') {
      const toggleIconEl = this.shadowRoot?.querySelector('.toggle-icon');
      toggleIconEl?.setAttribute(attributes.ICON, this.toggleIcon);
      this.#rotatePlusminus({
        elem: toggleIconEl,
        rotateClass: `rotate-${this.expanded ? 'forward' : 'backward'}`
      });
    }

    if (this.groupNodesEl) {
      if (this.expanded) {
        // Expand
        this.groupNodesEl.style.display = '';
        this.groupNodesEl.style.maxHeight = `${this.groupNodesEl.scrollHeight}px`;
        this.offEvent('transitionend.expanded.tree', this.groupNodesEl);
        this.onEvent('transitionend.expanded.tree', this.groupNodesEl, () => {
          this.groupNodesEl?.style.removeProperty('max-height');
        });
      } else {
        // Collapse
        this.offEvent('transitionend.expanded.tree', this.groupNodesEl);
        this.groupNodesEl.style.transition = 'none';
        this.groupNodesEl.style.maxHeight = `${this.groupNodesEl.scrollHeight}px`;
        this.groupNodesEl.style.transition = '';
        requestAnimationFrame(() => {
          this.groupNodesEl?.style.setProperty('max-height', '0');
          this.groupNodesEl?.style.setProperty('display', 'none');
        });
      }
    }
  }

  /**
   * Rotate class for plusminus icons.
   * @private
   * @param {object} target to set values.
   * @returns {void}
   */
  #rotatePlusminus(target: any) {
    if (this.tree?.toggleIconRotate && this.expandTarget === 'icon' && target?.elem) {
      target.elem.classList.add(target.rotateClass);
      const events = ['webkitAnimationEnd', 'oAnimationEnd', 'msAnimationEnd', 'animationend'];
      events.forEach((evt) => {
        this.onEvent(`${evt}.tree`, target.elem, () => {
          target.elem.classList.remove(target.rotateClass);
          events.forEach((rmEvt) => {
            this.offEvent(`${rmEvt}.tree`, target.elem);
          });
        });
      });
    }
  }

  /**
   * Set the node icon
   * @private
   * @returns {void}
   */
  #setNodeIcon() {
    const iconEl = this.shadowRoot?.querySelector('.icon');
    iconEl?.setAttribute(attributes.ICON, this.nodeIcon);
  }

  /**
   * Set toggle icon element
   * @private
   * @returns {void}
   */
  #setToggleIconElement() {
    const toggleIconEl = this.nodeContainer?.querySelector('.toggle-icon');
    if (this.isGroup && this.expandTarget === 'icon' && !toggleIconEl) {
      const refEl = this.shadowRoot?.querySelector('slot.badge') as HTMLSlotElement;
      const template = document.createElement('template');
      template.innerHTML = this.toggleIconHtml;
      this.nodeContainer?.insertBefore(template.content.cloneNode(true), refEl);
      return;
    }
    toggleIconEl?.remove();
  }

  /**
   * Set node selection
   * @private
   * @returns {void}
   */
  #setSelection() {
    const checkboxElem = this.container?.querySelector<IdsCheckbox>('ids-checkbox');

    if (!!this.selectable && this.isSelected) {
      this.container?.setAttribute(attributes.SELECTED, '');
      this.nodeContainer?.setAttribute(attributes.SELECTED, '');
      this.nodeContainer?.setAttribute('aria-selected', 'true');
      if (checkboxElem) checkboxElem.checked = true;
    } else {
      this.container?.removeAttribute(attributes.SELECTED);
      this.nodeContainer?.removeAttribute(attributes.SELECTED);
      this.nodeContainer?.setAttribute('aria-selected', 'false');
      if (checkboxElem) checkboxElem.checked = false;
    }
  }

  /**
   * Set node as tabbable or not
   * @private
   * @returns {void}
   */
  #setTabbable() {
    this.nodeContainer?.setAttribute('tabindex', (this.isTabbable ? '0' : '-1'));
  }

  /**
   * Attach event listeners
   */
  #attachEventListeners() {
    this.onEvent('click', this.checkbox, (e: any) => {
      e.preventDefault();
    });
  }

  /**
   * Gets toggle icon html
   * @returns {HTMLElement} the toggle icon html
   */
  get toggleIconHtml(): any {
    return this.expandTarget === 'icon'
      ? `<ids-icon class="toggle-icon" icon="${this.toggleIcon}" part="toggle-icon"></ids-icon>`
      : '';
  }

  /**
   * Gets the current node icon or expand/collapse icon
   * @returns {HTMLElement} the current icon
   */
  get nodeIcon(): any {
    if (this.isGroup) {
      return this.expanded ? this.expandIcon : this.collapseIcon;
    }
    return this.icon;
  }

  /**
   * Gets the current state is selected or not
   * @returns {boolean} the state is selected or not
   */
  get isSelected() { return !!this.selectable && this.selected; }

  get checkbox() {
    return this.shadowRoot?.querySelector('ids-checkbox');
  }

  /**
   * Gets the current state is tabbable or not
   * @returns {boolean} the state is tabbable or not
   */
  get isTabbable() { return !this.disabled && this.tabbable; }

  get isMultiSelect() { return this.tree?.selectable === 'multiple'; }

  /**
   * Gets the current toggle css class name
   * @returns {string} the toggle css class name
   */
  get toggleClass(): string {
    return this.expanded
      ? IdsTreeShared.TOGGLE_CLASSES.expanded : IdsTreeShared.TOGGLE_CLASSES.collapsed;
  }

  /**
   * Sets the tree group toggle icon
   * @returns {string} The toggle icon
   */
  get toggleIcon(): string {
    if (this.expandTarget === 'icon') {
      return this.expanded
        ? (this.treeAttribute(attributes.TOGGLE_EXPAND_ICON)
          || IdsTreeShared.DEFAULTS.toggleExpandIcon)
        : (this.treeAttribute(attributes.TOGGLE_COLLAPSE_ICON)
          || IdsTreeShared.DEFAULTS.toggleCollapseIcon);
    }
    return '';
  }

  /**
   * Sets the tree group collapse icon
   * @param {string|null} value The icon name
   */
  set collapseIcon(value: string | null) {
    if (value) {
      this.setAttribute(attributes.COLLAPSE_ICON, value.toString());
    } else {
      this.removeAttribute(attributes.COLLAPSE_ICON);
    }
    this.#setNodeIcon();
  }

  get collapseIcon(): string | null { return IdsTreeShared.getVal((this as any), attributes.COLLAPSE_ICON); }

  /**
   * Sets the tree node to disabled
   * @param {boolean|string} value If true will set disabled attribute
   */
  set disabled(value) {
    const val = stringToBool(value);
    if (val) {
      this.setAttribute(attributes.DISABLED, '');
      this.container?.setAttribute(attributes.DISABLED, '');
      this.nodeContainer?.setAttribute(attributes.DISABLED, '');
      this.nodeContainer?.setAttribute('aria-disabled', 'true');
    } else {
      this.removeAttribute(attributes.DISABLED);
      this.container?.removeAttribute(attributes.DISABLED);
      this.nodeContainer?.removeAttribute(attributes.DISABLED);
      this.nodeContainer?.setAttribute('aria-disabled', 'false');
    }
    this.#setTabbable();
  }

  get disabled() { return stringToBool(this.getAttribute(attributes.DISABLED)); }

  /**
   * Sets the tree group expand icon
   * @param {string|null} value The icon name
   */
  set expandIcon(value: string | null) {
    if (value) {
      this.setAttribute(attributes.EXPAND_ICON, value.toString());
    } else {
      this.removeAttribute(attributes.EXPAND_ICON);
    }
    this.#setNodeIcon();
  }

  get expandIcon(): string | null { return IdsTreeShared.getVal((this as any), attributes.EXPAND_ICON); }

  /**
   * Sets the tree group to be expanded
   * @param {boolean|string} value If true will set expanded attribute
   */
  set expanded(value: boolean | string) {
    if (IdsTreeShared.isBool(value)) {
      this.setAttribute(attributes.EXPANDED, `${value}`);
    } else {
      this.removeAttribute(attributes.EXPANDED);
    }
    this.#setExpandCollapse();
  }

  get expanded(): boolean { return IdsTreeShared.getBoolVal((this as any), attributes.EXPANDED); }

  /**
   * Sets the tree node icon
   * @param {string|null} value The icon name
   */
  set icon(value: string | null) {
    if (value) {
      this.setAttribute(attributes.ICON, value.toString());
    } else {
      this.removeAttribute(attributes.ICON);
    }
    this.#setNodeIcon();
  }

  get icon(): string | null { return IdsTreeShared.getVal((this as any), attributes.ICON); }

  /**
   * Set the node label text
   * @param {string} value of the label text
   */
  set label(value: string) {
    if (value) {
      this.setAttribute(attributes.LABEL, value.toString());
    } else {
      this.removeAttribute(attributes.LABEL);
    }

    const textElem = this.shadowRoot?.querySelector('.text');
    if (textElem) {
      textElem.textContent = `${value}`;
    }
  }

  get label(): string { return this.getAttribute(attributes.LABEL) || ''; }

  /**
   * Sets the tree node to be selectable 'single', 'multiple'
   * @param {string | null | boolean} value The icon name
   */
  set selectable(value: any) {
    const val = `${value}`;
    const isValid = IdsTreeShared.SELECTABLE.indexOf(val) > -1;
    if (isValid) {
      this.setAttribute(attributes.SELECTABLE, val);
    } else {
      this.removeAttribute(attributes.SELECTABLE);
    }
    this.#setSelection();
  }

  get selectable(): string | null | boolean {
    const value = this.getAttribute(attributes.SELECTABLE);
    if (value === 'false') {
      return false;
    }
    return value !== null ? value : IdsTreeShared.DEFAULTS.selectable;
  }

  /**
   * Sets the tree node to be selected
   * @param {boolean|string} value If true will set selected attribute
   */
  set selected(value: boolean | string) {
    const val = stringToBool(value);
    if (val) {
      this.setAttribute(attributes.SELECTED, '');
    } else {
      this.removeAttribute(attributes.SELECTED);
    }
    this.#setSelection();
  }

  get selected(): boolean | string { return stringToBool(this.getAttribute(attributes.SELECTED)); }

  /**
   * Set if the node is tabbable
   * @param {boolean|string} value The tabbable
   */
  set tabbable(value: boolean | string) {
    this.setAttribute(attributes.TABBABLE, `${value}`.toString());
    this.#setTabbable();
  }

  get tabbable(): boolean | string { return stringToBool(this.getAttribute(attributes.TABBABLE)); }

  /**
   * Sets the trees expand target between clicking the whole node or just the icon
   * @param {boolean|string} value Either 'node' or 'icon'
   */
  set expandTarget(value: 'node' | 'icon' | string) {
    if (IdsTreeShared.isBool(value)) {
      this.setAttribute(attributes.EXPAND_TARGET, `${value}`);
    } else {
      this.removeAttribute(attributes.EXPAND_TARGET);
    }
    this.#setToggleIconElement();
  }

  get expandTarget(): 'node' | 'icon' | string { return this.getAttribute(attributes.EXPAND_TARGET) || 'node'; }
}
