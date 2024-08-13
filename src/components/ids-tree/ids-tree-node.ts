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

export type IdsTreeNodeData = {
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
  children?: Array<IdsTreeNodeData>;
  /* IdsBadge config */
  badge?: TreeNodeBadge;
  /** Sets selected state */
  selected?: boolean;
  /** Sets collapse icon */
  collapseIcon?: string;
  /** Sets expand icon */
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
      attributes.SHOW_EXPAND_AND_TOGGLE_ICONS,
      attributes.TOGGLE_EXPAND_ICON,
      attributes.TOGGLE_COLLAPSE_ICON
    ];
  }

  get elem(): IdsTreeNode {
    return this;
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
    return [...this.querySelectorAll<IdsTreeNode>(':scope > ids-tree-node')];
  }

  get data(): IdsTreeNodeData {
    const nodeData: Partial<IdsTreeNodeData> = {
      id: this.id,
      text: this.label,
      icon: this.icon,
      expandIcon: this.expandIcon,
      collapseIcon: this.collapseIcon,
      expanded: this.expanded,
      disabled: this.disabled,
      selected: this.selected
    };

    // only append children property if has children os is async parent
    if (this.isAsyncParent || this.hasChildren) {
      nodeData.children = this.slottedTreeNodes.map((child) => child.data);
    }

    return nodeData;
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

  get level(): number {
    return Number(this.getAttribute('aria-level'));
  }

  get setsize(): number {
    return Number(this.getAttribute('aria-setsize'));
  }

  get posinset(): number {
    return Number(this.getAttribute('aria-posinset'));
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    const disabled = `${this.disabled ? ' disabled' : ''}`;
    const selected = `${this.isSelected ? ' selected' : ''}`;
    const expanded = `${this.expanded ? 'expanded' : ''}`;
    const nodeIcon = this.isGroup ? this.expandCollapseIcon : this.icon;
    const toggleExpandCollapseIcon = this.toggleExpandCollapseIcon;
    const toggleIcon = this.showExpandAndToggleIcons
      ? `<ids-icon class="toggle-icon" part="toggle-icon" icon="${toggleExpandCollapseIcon}"></ids-icon>`
      : '';

    return `<div class="ids-tree-node ${expanded}" role="none" ${disabled} ${selected}>
      <span class="node-container" part="node-container" role="treeitem" tabindex="0">
        <ids-icon class="icon" part="icon" icon="${nodeIcon}"></ids-icon>
        ${toggleIcon}
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
    const nodeLevel = this.level;
    const children = this.slottedTreeNodes;

    children.forEach((node, idx) => {
      const prevLevel = node.level;
      node.setAttribute(`aria-level`, String(nodeLevel + 1));
      node.setAttribute(`aria-setsize`, String(children.length));
      node.setAttribute(`aria-posinset`, String(idx + 1));

      // if node was moved from another level, update nested nodes
      if (prevLevel && prevLevel !== nodeLevel + 1) node.updateTreeArias();
    });
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
    const slotElem = this.container?.querySelector<HTMLSlotElement>('.group-nodes > slot');

    this.onEvent('click.tree-node', this.nodeContainer, (evt: CustomEvent) => {
      evt.preventDefault();
      evt.stopPropagation();
      this.handleClickEvent(evt);
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
      // filter out text nodes and move them to ids-text
      const slottedNodes = slotElem?.assignedNodes();
      const textNode = slottedNodes?.find((n) => n.nodeType === 3);

      if (textNode) {
        this.textElem?.append(textNode);
        return;
      }

      this.#updateSelectableMode();
      this.updateTreeArias();

      if (this.showExpandAndToggleIcons) {
        this.slottedTreeNodes.forEach((node) => node.toggleAttribute(attributes.SHOW_EXPAND_AND_TOGGLE_ICONS), true);
      }
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

  handleClickEvent(evt: CustomEvent) {
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
        this.toggleAttribute(attributes.SELECTED, this.isMultiSelect ? shouldSelect : true);
      }
    }

    // FOCUS ON CLICK
    this.setFocus();
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

  /**
   * Sets selected states on node elements
   */
  #select() {
    if (this.container?.hasAttribute(attributes.SELECTED)) return;

    this.container?.setAttribute(attributes.SELECTED, '');
    this.nodeContainer?.setAttribute('aria-selected', 'true');
    this.checkboxElem?.setAttribute(attributes.CHECKED, '');

    this.triggerEvent(`selected.tree-node`, this, {
      bubbles: true,
      detail: { node: this }
    });
  }

  /**
   * Sets unselected states on node elements
   */
  #deselect() {
    if (!this.container?.hasAttribute(attributes.SELECTED)) return;

    this.container?.removeAttribute(attributes.SELECTED);
    this.nodeContainer?.setAttribute('aria-selected', 'false');
    this.checkboxElem?.removeAttribute(attributes.CHECKED);

    this.triggerEvent(`deselected.tree-node`, this, {
      bubbles: true,
      detail: { elem: this }
    });
  }

  /**
   * Toggles selected states on node elements
   * @param {boolean} selected selected state
   */
  #toggleSelected(selected?: boolean) {
    selected = typeof selected === 'boolean' ? selected : !this.selected;

    if (selected) {
      this.#select();
    } else {
      this.#deselect();
    }
  }

  /**
   * Toggles expanded states on node elements
   * @param {boolean} expanded expanded state
   */
  #toggleExpanded(expanded?: boolean) {
    expanded = typeof expanded === 'boolean' ? expanded : !this.selected;

    if (expanded) {
      this.#expand();
    } else {
      this.#collapse();
    }
  }

  /**
   * Sets expanded states on node elements
   */
  #expand(): void {
    const expand = () => {
      this.container?.setAttribute(attributes.EXPANDED, '');
      this.groupNodesEl?.style.setProperty('display', 'block');
      this.groupNodesEl?.style.setProperty('max-height', `${this.groupNodesEl.scrollHeight}px`);
      this.nodeContainer?.querySelector('.icon')?.setAttribute(attributes.ICON, this.expandIcon);
      this.nodeContainer?.querySelector('.toggle-icon')?.setAttribute(attributes.ICON, this.toggleExpandIcon);
      this.#rotateToggleIcon(true);

      this.triggerEvent('expanded', this, {
        bubbles: true,
        detail: { node: this }
      });
    };

    // Async load children, then expand
    if (this.isAsyncParent && !this.hasChildren) {
      this.triggerEvent('expandready', this, {
        bubbles: true,
        detail: { node: this, onReady: () => expand() }
      });
      return;
    }

    expand();
  }

  /**
   * Sets collapsed states on node elements
   */
  #collapse(): void {
    this.container?.removeAttribute(attributes.EXPANDED);
    this.groupNodesEl?.style.setProperty('max-height', `0px`);
    this.groupNodesEl?.style.setProperty('display', `none`);
    this.container?.querySelector('.icon')?.setAttribute(attributes.ICON, this.collapseIcon);
    this.container?.querySelector('.toggle-icon')?.setAttribute(attributes.ICON, this.toggleCollapseIcon);
    this.#rotateToggleIcon(false);

    this.triggerEvent('collapsed', this, {
      bubbles: true,
      detail: { node: this }
    });
  }

  /**
   * Rotate toggle icon
   * @param {boolean} rotateForward Rotate forward if true, rotate backward if false
   */
  #rotateToggleIcon(rotateForward: boolean) {
    const toggleIcon = this.nodeContainer?.querySelector('.toggle-icon');

    if (!toggleIcon || !this.treeElem?.toggleIconRotate) return;

    const rotateClass = rotateForward ? 'rotate-forward' : 'rotate-backward';
    toggleIcon.classList.add(rotateClass);
    this.onEvent(`animationend`, toggleIcon, () => {
      toggleIcon.classList.remove(rotateClass);
      toggleIcon.setAttribute(attributes.ICON, this.toggleExpandCollapseIcon);
    }, { once: true });
  }

  /**
   * Gets the current node icon or expand/collapse icon
   * @returns {string} the current icon name
   */
  get nodeIcon(): string {
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

  get disabled(): boolean {
    return stringToBool(this.getAttribute(attributes.DISABLED));
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
  }

  get collapseIcon(): string {
    return this.getAttribute(attributes.COLLAPSE_ICON) || IdsTreeShared.DEFAULTS.collapseIcon;
  }

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
  }

  get expandIcon(): string {
    return this.getAttribute(attributes.EXPAND_ICON) || IdsTreeShared.DEFAULTS.expandIcon;
  }

  get expandCollapseIcon(): string {
    return this.expanded
      ? this.getAttribute(attributes.EXPAND_ICON) || IdsTreeShared.DEFAULTS.expandIcon
      : this.getAttribute(attributes.COLLAPSE_ICON) || IdsTreeShared.DEFAULTS.collapseIcon;
  }

  set toggleExpandIcon(value: string) {
    if (value) {
      this.setAttribute(attributes.TOGGLE_EXPAND_ICON, value);
    } else {
      this.removeAttribute(attributes.TOGGLE_EXPAND_ICON);
    }

    this.#updateToggleIcons();
  }

  get toggleExpandIcon(): string {
    return this.getAttribute(attributes.TOGGLE_EXPAND_ICON) || IdsTreeShared.DEFAULTS.toggleExpandIcon;
  }

  set toggleCollapseIcon(value: string) {
    if (value) {
      this.setAttribute(attributes.TOGGLE_COLLAPSE_ICON, value);
    } else {
      this.removeAttribute(attributes.TOGGLE_COLLAPSE_ICON);
    }

    this.#updateToggleIcons();
  }

  get toggleCollapseIcon(): string {
    return this.getAttribute(attributes.TOGGLE_COLLAPSE_ICON) || IdsTreeShared.DEFAULTS.toggleCollapseIcon;
  }

  get toggleExpandCollapseIcon(): string {
    return this.expanded
      ? this.getAttribute(attributes.TOGGLE_EXPAND_ICON) || IdsTreeShared.DEFAULTS.toggleExpandIcon
      : this.getAttribute(attributes.TOGGLE_COLLAPSE_ICON) || IdsTreeShared.DEFAULTS.toggleCollapseIcon;
  }

  set showExpandAndToggleIcons(value: boolean | null) {
    const show = stringToBool(value);
    this.toggleAttribute(attributes.SHOW_EXPAND_AND_TOGGLE_ICONS, show);
    this.#updateToggleIcons();
    this.slottedTreeNodes.forEach((node) => node.toggleAttribute(attributes.SHOW_EXPAND_AND_TOGGLE_ICONS), show);
  }

  get showExpandAndToggleIcons(): boolean {
    return stringToBool(this.getAttribute(attributes.SHOW_EXPAND_AND_TOGGLE_ICONS));
  }

  /**
   * Sets the tree node icon
   * @param {string|null} value The icon name
   */
  set icon(value: string | null) {
    this.setAttribute(attributes.ICON, value ?? IdsTreeShared.DEFAULTS.icon);
    this.#updateNodeIcon();
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
   * Sets the trees expand target between clicking the whole node or just the icon
   * @param {boolean|string} value Either 'node' or 'icon'
   */
  set expandTarget(value: 'node' | 'icon' | string) {
    if (IdsTreeShared.isBool(value)) {
      this.setAttribute(attributes.EXPAND_TARGET, `${value}`);
    } else {
      this.removeAttribute(attributes.EXPAND_TARGET);
    }
  }

  get expandTarget(): 'node' | 'icon' | string {
    return this.getAttribute(attributes.EXPAND_TARGET) || 'node';
  }

  #updateSelectableMode() {
    const selectableMode = this.selectable;

    if (selectableMode === 'multiple' && !this.checkboxElem) {
      this.checkboxElem = document.createElement('ids-checkbox') as IdsCheckbox;
      this.checkboxElem.checked = this.selected;
      this.checkboxElem.label = this.label;
      this.checkboxElem.setAttribute('tabindex', '-1');
      this.nodeContainer?.insertBefore(this.checkboxElem, this.textElem);
      this.textElem?.style.setProperty('display', 'none');
    }

    if (selectableMode === 'single') {
      this.checkboxElem?.remove();
      this.checkboxElem = null;
      this.textElem?.style.setProperty('display', 'inline-block');
    }

    this.slottedTreeNodes.forEach((node) => node.setAttribute(attributes.SELECTABLE, selectableMode));
  }

  #updateNodeIcon() {
    const nodeIcon = this.isGroup ? this.expandCollapseIcon : this.icon;
    this.nodeContainer?.querySelector('.icon')?.setAttribute(attributes.ICON, nodeIcon);
  }

  #updateToggleIcons() {
    if (!this.showExpandAndToggleIcons || !this.isGroup) {
      this.container?.querySelector('.toggle-icon')?.remove();
      return;
    }

    // add icon component if does not exist
    const toggleIconElem = this.container?.querySelector('.toggle-icon');
    const toggleExpandCollapseIcon = this.toggleExpandCollapseIcon;

    if (!toggleIconElem) {
      const tmpl = `<ids-icon class="toggle-icon" part="toggle-icon" icon="${toggleExpandCollapseIcon}"></ids-icon>`;
      this.nodeContainer?.querySelector('.icon')?.insertAdjacentHTML('afterend', tmpl);
    } else {
      toggleIconElem?.setAttribute(attributes.ICON, toggleExpandCollapseIcon);
    }
  }
}
