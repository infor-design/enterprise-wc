import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsElement from '../../core/ids-element';
import IdsTreeShared from './ids-tree-shared';

import '../ids-badge/ids-badge';
import '../ids-text/ids-text';
import '../ids-checkbox/ids-checkbox';

import styles from './ids-tree-node.scss';
import type IdsCheckbox from '../ids-checkbox/ids-checkbox';
import type IdsIcon from '../ids-icon/ids-icon';
import type IdsText from '../ids-text/ids-text';
import type IdsTree from './ids-tree';

export type TreeNodeBadge = {
  color?: string;
  shape?: string;
  text?: string;
  textAudible?: string;
  icon?: string;
};

export type TreeNode = {
  /* Set the id attribute */
  id?: string;
  /* Sets the text label */
  text?: string;
  /* Sets the icon name */
  icon?: string;
  /* Sets if expanded */
  expanded?: string | boolean;
  /* Sets if disabled */
  disabled?: string | boolean;
  /* Sets if expanded */
  children?: Array<TreeNode>;
  /* IdsBadge config */
  badge?: TreeNodeBadge;
  selected?: boolean;
  collapseIcon?: string;
  expandIcon?: string;
};

const Base = IdsEventsMixin(IdsElement);

/**
 * IDS Tree Node Component
 * @type {IdsTreeNode}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
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

  childrenTreeNodes: Array<IdsTreeNode> = [];

  checkboxElem: IdsCheckbox | null = null;

  textElem: IdsText | null = null;

  #tree: IdsTree | null = null;

  constructor() {
    super();
  }

  /**
   * Invoked each time the custom element is appended into a document-connected element.
   */
  connectedCallback() {
    super.connectedCallback();
    this.nodeContainer = this.shadowRoot!.querySelector('.node-container');
    this.groupNodesEl = this.shadowRoot!.querySelector('.group-nodes');
    this.checkboxElem = this.shadowRoot!.querySelector<IdsCheckbox>('ids-checkbox');
    this.textElem = this.shadowRoot!.querySelector<IdsText>('ids-text');
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
      attributes.EXPAND_TARGET,
      attributes.ICON,
      attributes.LABEL,
      attributes.SELECTABLE,
      attributes.SELECTED,
      attributes.TABBABLE
    ];
  }

  get iconElement(): IdsIcon | null {
    return this.container?.querySelector<IdsIcon>('.icon') ?? null;
  }

  get hasChildren(): boolean {
    return !!this.querySelector('ids-tree-node');
  }

  get isAsyncParent(): boolean {
    return this.hasAttribute('load-async');
  }

  get isGroup(): boolean {
    return !!this.querySelector('ids-tree-node') || this.isAsyncParent;
  }

  get slottedTreeNodes(): Array<IdsTreeNode> {
    return [...this.querySelectorAll<IdsTreeNode>('ids-tree-node')];
  }

  get data(): TreeNode {
    return {
      id: this.id,
      text: this.label,
      icon: this.icon || undefined,
      expanded: this.expanded,
      disabled: this.disabled,
      children: this.slottedTreeNodes.map((child) => child.data)
    };
  }

  get treeElem(): IdsTree | null {
    if (this.#tree) return this.#tree;

    let cursor = this.parentElement;
    while (cursor && !(cursor.nodeName === 'IDS-TREE')) {
      cursor = cursor.parentElement;
    }
    this.#tree = cursor as IdsTree;

    return this.#tree;
  }

  get isMultiSelect(): boolean {
    return this.selectable === 'multiple';
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    const disabled = `${this.disabled ? ' disabled' : ''}`;
    const selected = `${this.isSelected ? ' selected' : ''}`;
    const expanded = `${this.expanded ? 'expanded' : ''}`;

    return `<div class="ids-tree-node ${expanded}" role="none" ${disabled} ${selected}>
      <span class="node-container" part="node-container" role="treeitem" tabindex="0">
        <ids-icon class="icon" part="icon" icon="${this.nodeIcon}"></ids-icon>
        <slot name="badge" class="badge"></slot>
        <ids-text class="text" part="text">${this.label}</ids-text>
      </span>
      <div class="group-nodes" part="group-nodes">
        <slot></slot>
      </div>
    </div>`;
  }

  /**
   * Set focus to node container
   * @returns {void}
   */
  setFocus(): void {
    this.nodeContainer?.focus();
  }

  updateTreeArias(): void {
    const nodeLevel = Number(this.getAttribute('aria-level'));
    const children = this.slottedTreeNodes;

    children.forEach((node, idx) => {
      const prevLevel = Number(node.getAttribute(`aria-level`));
      node.setAttribute(`aria-level`, String(nodeLevel + 1));
      node.setAttribute(`aria-setsize`, String(children.length));
      node.setAttribute(`aria-posinset`, String(idx + 1));

      // if node was moved from another level, update nested nodes
      if (prevLevel && prevLevel !== nodeLevel + 1) node.updateTreeArias();
    });
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

  #canProceed(eventName: string): boolean {
    let canProceed = true;

    const response = (veto: boolean) => { canProceed = veto; };
    this.triggerEvent(eventName, this, {
      bubbles: true,
      detail: { elem: this.#tree, response, node: this }
    });

    return canProceed;
  }

  /**
   * Sets the tree node to be selected
   * @param {boolean|string} value If true will set selected attribute
   */
  set selected(value: boolean | string) {
    const bool = stringToBool(value);
    const prev = this.container?.hasAttribute(attributes.SELECTED);
    const vetoEvent = bool ? 'beforeselected' : 'beforeunselected';

    if (
      this.disabled
      || bool === prev
      || this.selectable === 'none'
      || !this.#canProceed(vetoEvent)
    ) {
      this.toggleAttribute(attributes.SELECTED, prev);
      return;
    }

    this.toggleAttribute(attributes.SELECTED, bool);
    this.#toggleSelected(bool);
  }

  get selected(): boolean {
    return stringToBool(this.getAttribute(attributes.SELECTED));
  }

  /**
   * Sets the tree group to be expanded
   * @param {boolean|string} value If true will set expanded attribute
   */
  set expanded(value: boolean | string) {
    const bool = stringToBool(value);
    const prev = this.container?.hasAttribute(attributes.EXPANDED);
    const vetoEvent = bool ? 'beforeexpanded' : 'beforecollapsed';

    if (
      this.disabled
      || bool === prev
      || !this.#canProceed(vetoEvent)
    ) {
      this.toggleAttribute(attributes.EXPANDED, prev);
      return;
    }

    this.toggleAttribute(attributes.EXPANDED, bool);
    this.#toggleExpanded(bool);
  }

  get expanded(): boolean {
    return stringToBool(this.getAttribute(attributes.EXPANDED));
  }

  get isIndeterminate(): boolean {
    return stringToBool(this.checkboxElem?.getAttribute(attributes.INDETERMINATE));
  }

  /**
   * Attach event listeners
   */
  #attachEventListeners() {
    const slotElem = this.container?.querySelector('.group-nodes > slot');

    this.onEvent('click.tree-node', this.nodeContainer, (evt: CustomEvent) => {
      evt.preventDefault();
      evt.stopPropagation();
      this.#handleClickEvent(evt);
    });

    let nodeSelectDelay: any;
    this.onEvent('selected.tree-node', slotElem, (evt: CustomEvent) => {
      clearTimeout(nodeSelectDelay);

      // if selected node is direct child of this node
      if ((evt.target as Element).parentElement === this) {
        nodeSelectDelay = setTimeout(() => this.#updateIndeterminateState(), 10);
      }
    });

    let nodeDeselectDelay: any;
    this.onEvent('deselected.tree-node', slotElem, (evt: CustomEvent) => {
      clearTimeout(nodeDeselectDelay);

      // if selected node is direct child of this node
      if ((evt.target as Element).parentElement === this) {
        nodeDeselectDelay = setTimeout(() => this.#updateIndeterminateState(), 10);
      }
    });

    this.onEvent('transitionend.expanded-tree', this.groupNodesEl, () => {
      if (this.expanded) {
        this.groupNodesEl?.style.setProperty('max-height', 'max-content');
      }
    });

    this.onEvent('slotchange', slotElem, () => {
      console.log('slotchange', this.label, this.slottedTreeNodes);
      this.#updateSelectableMode();
      this.updateTreeArias();
    });

    this.onEvent('keydown', this, (evt: KeyboardEvent) => {
      evt.preventDefault();
      evt.stopPropagation();
      evt.stopImmediatePropagation();
      this.triggerEvent('treenodekeydown', this, {
        bubbles: true,
        detail: { node: this, code: evt.code }
      });
    });
  }

  #updateIndeterminateState() {
    if (!this.isMultiSelect) return;
    const isIndeterminate = this.#isIndeterminateParent();
    this.toggleAttribute(attributes.SELECTED, !!this.slottedTreeNodes.find((child) => child.selected));
    this.#toggleIndeterminate(this.selected && isIndeterminate);
  }

  // TreeNode is indeterminate if not all children are checked
  #isIndeterminateParent(): boolean {
    const children = this.slottedTreeNodes;
    return !!children.length && !!children.find((child) => !child.selected || child.isIndeterminate);
  }

  #handleClickEvent(evt: CustomEvent) {
    if (this.disabled) return;

    const clickTarget = evt.target as Element;
    const isCheckboxClick = clickTarget.nodeName === 'IDS-CHECKBOX';
    const isIconClick = clickTarget.nodeName === 'IDS-ICON';

    // HANDLE EXPANSION
    const isValidExpandClick = this.treeElem?.expandTarget === 'icon' ? isIconClick : true;
    const shouldHandleExpansion = this.isGroup && isValidExpandClick;

    if (shouldHandleExpansion && this.isGroup && !isCheckboxClick) {
      const shouldExpand = !this.expanded;
      this.toggleAttribute(attributes.EXPANDED, shouldExpand);
    }

    // HANDLE SELECTION
    const shouldHandleSelection = !isIconClick && this.selectable !== 'none';

    if (shouldHandleSelection) {
      const shouldSelect = !this.selected;

      if (this.isMultiSelect && this.hasChildren) {
        this.toggleSelectedChildren(shouldSelect);
      } else {
        // CLEAN UP
        this.toggleAttribute(attributes.SELECTED, this.isMultiSelect ? shouldSelect : true);
      }
    }

    // FOCUS ON CLICK
    this.setFocus();
  }

  #updateSelectionUI(selectMode: string) {
    if (selectMode === 'multiple' && !this.checkboxElem) {
      this.checkboxElem = document.createElement('ids-checkbox') as IdsCheckbox;
      this.checkboxElem.checked = this.selected;
      this.checkboxElem.label = this.label;
      this.checkboxElem.setAttribute('tabindex', '-1');
      this.nodeContainer?.insertBefore(this.checkboxElem, this.textElem);
      this.textElem?.style.setProperty('display', 'none');
      return;
    }

    if (selectMode === 'single') {
      this.checkboxElem?.remove();
      this.checkboxElem = null;
      this.textElem?.style.setProperty('display', 'inline-block');
    }
  }

  #updateSelectableMode() {
    const selectableMode = this.selectable;
    this.#updateSelectionUI(selectableMode);
    this.slottedTreeNodes.forEach((node) => node.setAttribute(attributes.SELECTABLE, selectableMode));
  }

  toggleSelectedChildren(shouldSelect: boolean): void {
    if (this.disabled) return;

    if (this.hasChildren) {
      this.slottedTreeNodes.forEach((childNode) => childNode.toggleSelectedChildren(shouldSelect));
      return;
    }

    this.toggleAttribute(attributes.SELECTED, shouldSelect);
  }

  #toggleIndeterminate(isIndeterminate: boolean): void {
    this.checkboxElem?.toggleAttribute(attributes.INDETERMINATE, isIndeterminate);
  }

  #select() {
    this.container?.setAttribute(attributes.SELECTED, '');
    this.nodeContainer?.setAttribute('aria-selected', 'true');
    this.checkboxElem?.setAttribute(attributes.CHECKED, '');

    this.triggerEvent(`selected.tree-node`, this, {
      bubbles: true,
      detail: { elem: this }
    });
  }

  #deselect() {
    this.container?.removeAttribute(attributes.SELECTED);
    this.nodeContainer?.setAttribute('aria-selected', 'false');
    this.checkboxElem?.removeAttribute(attributes.CHECKED);

    this.triggerEvent(`deselected.tree-node`, this, {
      bubbles: true,
      detail: { elem: this }
    });
  }

  #toggleSelected(selected?: boolean) {
    selected = typeof selected === 'boolean' ? selected : !this.selected;

    if (selected) {
      this.#select();
    } else {
      this.#deselect();
    }
  }

  #toggleExpanded(expanded?: boolean) {
    expanded = typeof expanded === 'boolean' ? expanded : !this.selected;

    if (expanded) {
      this.#expand();
    } else {
      this.#collapse();
    }
  }

  #expand() {
    const expand = () => {
      this.container?.setAttribute(attributes.EXPANDED, '');
      this.groupNodesEl?.style.setProperty('display', 'block');
      this.groupNodesEl?.style.setProperty('max-height', `${this.groupNodesEl.scrollHeight}px`);
      this.iconElement?.setAttribute(attributes.ICON, this.expandIcon);

      this.triggerEvent('expanded', this, {
        bubbles: true,
        detail: { node: this }
      });
    };

    if (this.isAsyncParent && !this.hasChildren) {
      this.triggerEvent('expandready', this, {
        bubbles: true,
        detail: { node: this, onReady: () => expand() }
      });
      return;
    }

    expand();
  }

  #collapse() {
    this.container?.removeAttribute(attributes.EXPANDED);
    this.groupNodesEl?.style.setProperty('max-height', `0px`);
    this.groupNodesEl?.style.setProperty('display', `none`);
    this.iconElement?.setAttribute(attributes.ICON, this.collapseIcon);
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
   * @returns {string} the current icon name
   */
  get nodeIcon(): string {
    if (this.isGroup) {
      return this.expanded ? this.expandIcon : this.collapseIcon;
    }

    return this.icon;
  }

  /**
   * Gets the current state is selected or not
   * @returns {boolean} the state is selected or not
   */
  get isSelected() {
    return !!this.selectable && this.selected;
  }

  get checkbox() {
    return this.shadowRoot?.querySelector('ids-checkbox');
  }

  /**
   * Gets the current toggle css class name
   * @returns {string} the toggle css class name
   */
  get toggleClass(): string {
    return this.expanded
      ? IdsTreeShared.TOGGLE_CLASSES.expanded
      : IdsTreeShared.TOGGLE_CLASSES.collapsed;
  }

  /**
   * Sets the tree group toggle icon
   * @returns {string} The toggle icon
   */
  get toggleIcon(): string {
    if (this.expandTarget === 'icon' || this.tree?.showExpandAndToggleIcons) {
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

  get collapseIcon(): string {
    return IdsTreeShared.getVal((this as any), attributes.COLLAPSE_ICON);
  }

  /**
   * Sets the tree node to disabled
   * @param {boolean|string} value If true will set disabled attribute
   */
  set disabled(value) {
    const isDisabled = stringToBool(value);

    this.toggleAttribute(attributes.DISABLED, isDisabled);
    this.container?.toggleAttribute(attributes.DISABLED, isDisabled);
    this.nodeContainer?.toggleAttribute(attributes.DISABLED, isDisabled);
    this.nodeContainer?.setAttribute('aria-disabled', `${isDisabled}`);

    // Disable children
    this.slottedTreeNodes.forEach((child) => child.toggleAttribute(attributes.DISABLED, isDisabled));
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

  get expandIcon(): string {
    return IdsTreeShared.getVal((this as any), attributes.EXPAND_ICON);
  }

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

  get icon(): string {
    return this.getAttribute(attributes.ICON) || IdsTreeShared.DEFAULTS.icon;
  }

  /**
   * Set the node label text
   * @param {string} value of the label text
   */
  set label(value: string | null) {
    if (value) {
      this.setAttribute(attributes.LABEL, value.toString());
    } else {
      this.removeAttribute(attributes.LABEL);
    }

    if (this.textElem) {
      this.textElem.textContent = value;
    }
  }

  get label(): string {
    return this.getAttribute(attributes.LABEL) || '';
  }

  /**
   * Sets the tree node to be selectable 'single', 'multiple', 'none'
   * @param {string} val selectable mode
   */
  set selectable(val: string) {
    const isValid = IdsTreeShared.SELECTABLE.includes(val);

    if (isValid) {
      this.setAttribute(attributes.SELECTABLE, val);
    } else {
      this.removeAttribute(attributes.SELECTABLE);
    }

    this.#updateSelectableMode();
  }

  get selectable(): string {
    const attrVal = this.getAttribute(attributes.SELECTABLE) ?? 'single';
    return IdsTreeShared.SELECTABLE.includes(attrVal) ? attrVal : 'single';
  }

  /**
   * Set if the node is tabbable
   * @param {boolean|string} value The tabbable
   */
  set tabbable(value: boolean | string) {
    const isTabbable = stringToBool(value) && !this.disabled;
    this.toggleAttribute(attributes.TABBABLE, isTabbable);
    this.nodeContainer?.setAttribute('tabindex', isTabbable ? '0' : '-1');
  }

  get tabbable(): boolean {
    return !this.disabled && stringToBool(this.getAttribute(attributes.TABBABLE));
  }

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

  get expandTarget(): 'node' | 'icon' | string {
    return this.getAttribute(attributes.EXPAND_TARGET) || 'node';
  }
}
