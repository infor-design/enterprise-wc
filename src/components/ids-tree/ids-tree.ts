import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';

import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsElement from '../../core/ids-element';

import IdsTreeShared from './ids-tree-shared';
import '../ids-text/ids-text';
import '../ids-icon/ids-icon';
import './ids-tree-node';
import { type IdsTreeNodeData } from './ids-tree-node';
import type IdsTreeNode from './ids-tree-node';

import { unescapeHTML, escapeHTML } from '../../utils/ids-xss-utils/ids-xss-utils';
import { stringToBool, camelCase } from '../../utils/ids-string-utils/ids-string-utils';

import styles from './ids-tree.scss';
import { next } from '../../utils/ids-dom-utils/ids-dom-utils';

interface IdsTreeActive {
  old: IdsTreeNode | null;
  current: IdsTreeNode | null;
  selectedOld: IdsTreeNode | null;
  selectedCurrent: IdsTreeNode | null;
}

const Base = IdsLocaleMixin(
  IdsEventsMixin(
    IdsElement
  )
);

/**
 * IDS Tree Component
 * @type {IdsTree}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsLocaleMixin
 * @part tree - the tree element
 */
@customElement('ids-tree')
@scss(styles)
export default class IdsTree extends Base {
  /**
   * Active node elements.
   * @type {IdsTreeActive}
   */
  #active: IdsTreeActive = {
    old: null,
    current: null,
    selectedOld: null,
    selectedCurrent: null,
  };

  /**
   * List of node elements attached to tree.
   * @private
   * @type {Array<object>}
   */
  #nodes: Array<any> = [];

  constructor() {
    super();

    // Setup initial internal states
    this.state = {};
  }

  /**
   * Invoked each time the custom element is appended into a document-connected element.
   */
  connectedCallback() {
    super.connectedCallback();
    this.#attachEventHandlers();
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
      attributes.SHOW_EXPAND_AND_TOGGLE_ICONS,
      attributes.TOGGLE_COLLAPSE_ICON,
      attributes.TOGGLE_EXPAND_ICON,
      attributes.TOGGLE_ICON_ROTATE,
      attributes.EXPAND_TARGET
    ];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    const disabled = this.disabled ? ' disabled' : '';
    const label = `aria-label="${this.label}"`;

    return `<div class="ids-tree" part="tree" role="tree" ${label} ${disabled}>
      <slot></slot>
    </div>`;
  }

  /**
   * Set the data array of the tree
   * @param {Array} value The array to use
   */
  set data(value: Array<IdsTreeNodeData>) {
    if (Array.isArray(value)) {
      this.redraw(value);
      return;
    }

    this.clear();
  }

  get data(): Array<IdsTreeNodeData> {
    return this.rootNodes.map((child) => child.data);
  }

  /**
   * Sets the tree to be expanded
   * @param {boolean|string} value If true will set expanded attribute
   */
  set expanded(value: boolean | string) {
    const treeExpanded = stringToBool(value);
    this.toggleAttribute(attributes.EXPANDED, treeExpanded);
    this.#traverseTree((treeNode) => {
      if (treeNode.isGroup) treeNode.toggleAttribute(attributes.EXPANDED, treeExpanded);
    });
  }

  get expanded(): boolean {
    return stringToBool(this.getAttribute(attributes.EXPANDED));
  }

  /**
   * Sets the tree group to be selectable 'single', 'multiple'
   * @param {string | null} value The selectable
   */
  set selectable(value: string | null) {
    const val = `${value}`;
    const isValid = IdsTreeShared.SELECTABLE.indexOf(val) > -1;

    if (isValid) {
      if (val === 'none') this.unselectAll();
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
   * Sets the tree node icon
   * @param {string|null} value The icon name
   */
  set icon(value: string | null) {
    if (value) {
      this.setAttribute(attributes.ICON, value.toString());
    } else {
      this.removeAttribute(attributes.ICON);
    }

    this.#updateNodeAttribute(attributes.ICON, true);
  }

  get icon(): string {
    return this.getAttribute(attributes.ICON) ?? IdsTreeShared.DEFAULTS.icon;
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
    this.#updateNodeAttribute(attributes.COLLAPSE_ICON);
  }

  get collapseIcon(): string | null {
    return this.getAttribute(attributes.COLLAPSE_ICON) ?? IdsTreeShared.DEFAULTS.collapseIcon;
  }

  /**
   * Sets the tree's expand target
   * @param {boolean|string} value Either node or icon
   */
  set expandTarget(value: 'node' | 'icon' | string) {
    if (value) {
      this.setAttribute(attributes.EXPAND_TARGET, `${value}`);
    } else {
      this.removeAttribute(attributes.EXPAND_TARGET);
    }

    this.#updateNodeAttribute(attributes.EXPAND_TARGET);
  }

  get expandTarget(): 'node' | 'icon' | string {
    return this.getAttribute(attributes.EXPAND_TARGET) || 'node';
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

    this.#updateNodeAttribute(attributes.EXPAND_ICON);
  }

  get expandIcon(): string | null {
    return this.getAttribute(attributes.EXPAND_ICON) ?? IdsTreeShared.DEFAULTS.expandIcon;
  }

  /**
   * Sets the tree to disabled
   * @param {boolean|string} value If true will set disabled attribute
   */
  set disabled(value: string | boolean) {
    const isDisabled = stringToBool(value);
    this.toggleAttribute(attributes.DISABLED, isDisabled);
    this.container?.toggleAttribute(attributes.DISABLED, isDisabled);
    this.rootNodes.forEach((child) => child.toggleAttribute(attributes.DISABLED, isDisabled));
  }

  get disabled(): boolean {
    return stringToBool(this.getAttribute(attributes.DISABLED));
  }

  get rootNodes(): Array<IdsTreeNode> {
    return [...this.querySelectorAll<IdsTreeNode>(':scope > ids-tree-node')];
  }

  get treeNodes(): Array<IdsTreeNode> {
    return [...this.querySelectorAll<IdsTreeNode>('ids-tree-node')];
  }

  get nodesData(): Array<IdsTreeNode> {
    return this.treeNodes;
  }

  /**
   * Set the tree aria label text
   * @param {string} value of the label text
   */
  set label(value: string) {
    if (value) {
      this.setAttribute(attributes.LABEL, value.toString());
      this.container?.setAttribute('aria-label', value.toString());
    } else {
      this.removeAttribute(attributes.LABEL);
      this.container?.setAttribute('aria-label', IdsTreeShared.TREE_ARIA_LABEL);
    }
  }

  get label(): string {
    return this.getAttribute(attributes.LABEL) || IdsTreeShared.TREE_ARIA_LABEL;
  }

  get isMultiSelect() {
    return this.selectable === 'multiple';
  }

  /**
   * Sets the tree to show expand and collapse icons
   * @param {boolean} value If true will set
   */
  set showExpandAndToggleIcons(value: boolean) {
    const show = stringToBool(value);
    this.toggleAttribute(attributes.SHOW_EXPAND_AND_TOGGLE_ICONS, show);
    this.#updateNodeAttribute(attributes.SHOW_EXPAND_AND_TOGGLE_ICONS, true);
  }

  /**
   * Get the tree to show expand and collapse icons
   * @returns {boolean} true if the tree show expand and collapse icons
   */
  get showExpandAndToggleIcons(): boolean {
    return stringToBool(this.getAttribute(attributes.SHOW_EXPAND_AND_TOGGLE_ICONS));
  }

  /**
   * Sets the tree group toggle collapse icon
   * @param {string|null} value The icon name
   */
  set toggleCollapseIcon(value: string | null) {
    if (value) {
      this.setAttribute(attributes.TOGGLE_COLLAPSE_ICON, value.toString());
    } else {
      this.removeAttribute(attributes.TOGGLE_COLLAPSE_ICON);
    }

    this.#updateNodeAttribute(attributes.TOGGLE_COLLAPSE_ICON);
  }

  get toggleCollapseIcon(): string {
    return this.getAttribute(attributes.TOGGLE_COLLAPSE_ICON) || IdsTreeShared.DEFAULTS.toggleCollapseIcon;
  }

  /**
   * Sets the tree group toggle expand icon
   * @param {string|null} value The icon name
   */
  set toggleExpandIcon(value: string | null) {
    if (value) {
      this.setAttribute(attributes.TOGGLE_EXPAND_ICON, value.toString());
    } else {
      this.removeAttribute(attributes.TOGGLE_EXPAND_ICON);
    }

    this.#updateNodeAttribute(attributes.TOGGLE_EXPAND_ICON);
  }

  get toggleExpandIcon(): string {
    return this.getAttribute(attributes.TOGGLE_EXPAND_ICON) || IdsTreeShared.DEFAULTS.toggleExpandIcon;
  }

  /**
   * Sets the tree to use toggle icon rotate
   * @param {boolean|string} value If false will set to use toggle icon to be false
   */
  set toggleIconRotate(value: boolean | string | null) {
    this.toggleAttribute(attributes.TOGGLE_ICON_ROTATE, stringToBool(value));
    this.#updateNodeAttribute(attributes.TOGGLE_ICON_ROTATE);
  }

  get toggleIconRotate(): boolean {
    return stringToBool(this.getAttribute(attributes.TOGGLE_ICON_ROTATE));
  }

  /**
   * The currently selected
   * @returns {IdsTreeNode | null} An node object if selectable: single
   */
  get selected(): IdsTreeNode | Array<IdsTreeNode> | null {
    if (this.selectable === 'multiple') {
      return [...this.querySelectorAll<IdsTreeNode>('ids-tree-node[selected]')];
    }

    return this.treeNodes.find((node) => node.selected) ?? null;
  }

  /**
   * An async function that fires as the node is expanding
   * @param {Function} func The async function
   */
  set beforeExpanded(func: (params: any) => Promise<Array<IdsTreeNodeData>>) {
    this.state.beforeExpanded = func;
  }

  get beforeExpanded(): () => Promise<Array<IdsTreeNodeData>> {
    return this.state.beforeExpanded;
  }

  /**
   * An async function that fires after the node was expanded
   * @param {Function} func The async function
   */
  set afterExpanded(func: () => Promise<void>) {
    this.state.afterExpanded = func;
  }

  get afterExpanded(): () => Promise<void> {
    return this.state.afterExpanded;
  }

  /**
   * Collapse all attached nodes to the tree
   * @returns {void}
   */
  collapseAll() {
    this.treeNodes
      .filter((node) => node.isGroup)
      .forEach((node) => node.toggleAttribute(attributes.EXPANDED, false));
  }

  /**
   * Expand all attached nodes to the tree
   * @returns {void}
   */
  expandAll() {
    this.treeNodes
      ?.filter((node) => node.isGroup)
      .forEach((node) => node.toggleAttribute(attributes.EXPANDED, true));
  }

  /**
   * Collapse a tree node by given CSS selector.
   * @param {string} selector The selector string to use
   * @returns {void}
   */
  collapse(selector: string) {
    const node = this.getNode(selector);
    node?.toggleAttribute(attributes.EXPANDED, false);
  }

  /**
   * Expand a tree node by given CSS selector.
   * @param {string} selector The selector string to use
   * @returns {void}
   */
  expand(selector: string) {
    const node = this.getNode(selector);
    node?.toggleAttribute(attributes.EXPANDED, true);
  }

  /**
   * Toggle a tree node by given CSS selector.
   * @param {string} selector The selector string to use
   * @returns {void}
   */
  toggle(selector: string) {
    const node = this.getNode(selector);
    node?.toggleAttribute(attributes.EXPANDED, !node.expanded);
  }

  /**
   * Selects a tree node by given CSS selector.
   * @param {string} selector The selector string to use
   * @returns {void}
   */
  select(selector: string) {
    const node = this.getNode(selector);
    node?.toggleAttribute(attributes.SELECTED, true);
  }

  /**
   * UnSelects a tree node by given CSS selector.
   * @param {string} selector The selector string to use
   * @returns {void}
   */
  unselect(selector: string) {
    const node = this.getNode(selector);
    node?.toggleAttribute(attributes.SELECTED, false);
  }

  unselectAll(): void {
    this.treeNodes.forEach((node) => node.toggleAttribute(attributes.SELECTED, false));
  }

  /**
   * Get all child nodes of given parent
   * @param {IdsTreeNode} parent Parent IdsTreeNode
   * @returns {Array<IdsTreeNode>} Children IdsrootNodes
   */
  getAllChildNodes(parent: IdsTreeNode): Array<IdsTreeNode> {
    return [...parent.querySelectorAll<IdsTreeNode>('ids-tree-node')];
  }

  /**
   * Ckeck if related node is selected or not, by given CSS selector.
   * @param {string} selector The selector string to use
   * @returns {boolean} true, if given node is selected
   */
  isSelected(selector: string): boolean {
    return !!this.getNode(selector)?.selected;
  }

  /**
   * Get a tree node by given CSS selector.
   * @param {string} selector The selector string to use
   * @returns {object} The node element
   */
  getNode(selector: string): IdsTreeNode | null {
    return this.treeNodes.find((node) => node.matches(selector)) ?? null;
  }

  /**
   * Add more node data into the tree
   * @param {Array<IdsTreeNodeData>} nodeData The selector string to use
   * @param {string} location The location where to add the data
   * @param {IdsTreeNode} node The option HtmlElement to connect before and after to
   * @returns {void}
   */
  addNodes(nodeData: Array<IdsTreeNodeData>, location?: 'bottom' | 'top' | 'before' | 'after' | 'child', node?: IdsTreeNode): void {
    const treeNodeHTML = nodeData.reduce((tmpl, data) => tmpl + this.#buildTreeNodeHTML(data), '');

    switch (location) {
      case 'top':
        this.insertAdjacentHTML('afterbegin', treeNodeHTML);
        break;
      case 'before':
        node?.insertAdjacentHTML('beforebegin', treeNodeHTML);
        break;
      case 'after':
        node?.insertAdjacentHTML('afterend', treeNodeHTML);
        break;
      case 'child':
        node?.insertAdjacentHTML('beforeend', treeNodeHTML);
        node?.toggleAttribute(attributes.EXPANDED, true);
        break;
      case 'bottom':
      default:
        this.insertAdjacentHTML('beforeend', treeNodeHTML);
    }
  }

  #updateSelectableMode() {
    const selectableMode = this.selectable;
    this.rootNodes.forEach((node) => node.setAttribute(attributes.SELECTABLE, selectableMode));
  }

  /**
   * Set the focus to given node, and set as active node
   * @param {object} node The target node element
   */
  #setFocus(node: IdsTreeNode): void {
    if (!node || node === this.#active.current) return;

    this.#active.old = this.#active.current;
    this.#active.current = node;
    this.#active.current.setFocus();
  }

  /**
   * Update the given node attribute
   * @param {string} attr The attribute name
   * @param {boolean} mustUpdate if true, will must update
   */
  #updateNodeAttribute(attr: string, mustUpdate?: boolean) {
    this.treeNodes.forEach((node: IdsTreeNode) => {
      const nodeVal = node.getAttribute(attr);
      const value = (this as any)[camelCase(attr)];

      if (value === null) {
        node.removeAttribute(attr);
      } else if (mustUpdate || nodeVal !== value) {
        node.setAttribute(attr, value?.toString());
      }
    });
  }

  #traverseTree(fn: (treeNode: IdsTreeNode) => void) {
    this.querySelectorAll<IdsTreeNode>('ids-tree-node').forEach((treeNode) => {
      fn(treeNode);
    });
  }

  #navigate(node: IdsTreeNode, key: string) {
    // Keep `Space` in keydown allow options, so page not scrolls
    const allow = ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Space'];
    // Set the move action with arrow keys
    const move = {
      next: (current: IdsTreeNode) => {
        const nextNode = this.#next(current);
        if (nextNode) {
          this.#setFocus(nextNode);
        }
      },
      previous: (current: IdsTreeNode) => {
        const previousNode = this.#previous(current);
        if (previousNode) {
          this.#setFocus(previousNode);
        }
      },
      forward: (current: IdsTreeNode) => {
        if (current.isGroup) {
          if (current.expanded) {
            const forwardNode = this.#nextInGroup(current);
            this.#setFocus(forwardNode);
          } else {
            current.toggleAttribute(attributes.EXPANDED, true);
          }
        }
      },
      backward: (current: IdsTreeNode) => {
        if (current.isGroup && current.expanded) {
          current.toggleAttribute(attributes.EXPANDED, false);
        } else if (current.level > 1) {
          const previous = current.parentElement as IdsTreeNode;
          this.#setFocus(previous);
        }
      }
    };

    if (allow.includes(key)) {
      const current = node;
      const isRTL = this.localeAPI.isRTL();

      if (key === 'ArrowDown') {
        move.next(current);
      } else if (key === 'ArrowUp') {
        move.previous(current);
      } else if (key === 'ArrowRight') {
        move[isRTL ? 'backward' : 'forward'](current);
      } else if (key === 'ArrowLeft') {
        move[isRTL ? 'forward' : 'backward'](current);
      }
    }
  }

  /**
   * Get the next node element and index
   * @param {IdsTreeNode} current The current node.
   * @param {boolean} skipCurrent The current node.
   * @returns {IdsTreeNode|null} The next node element and index
   */
  #next(current: IdsTreeNode, skipCurrent = false): IdsTreeNode | null {
    // navigate to first child
    if (!skipCurrent && current.expanded && current.hasChildren) {
      const nextChild = current.slottedTreeNodes.find((node) => !node.disabled);
      if (nextChild) return nextChild;
    }

    // navivate to next sibling
    const nextSibling = next<IdsTreeNode>(current, 'ids-tree-node:not([disabled])');
    if (nextSibling) {
      return nextSibling;
    }

    // navigate to parent's sibling
    if (current.parentElement?.nodeName === 'IDS-TREE-NODE') {
      return this.#next(current.parentElement as IdsTreeNode, true);
    }

    return null;
  }

  /**
   * Get the next node element and index in group
   * @private
   * @param {object} [current] The current node.
   * @param {HTMLElement} [current.elem] The current node element
   * @param {number} [current.idx] The current node Index
   * @returns {object} The next node element and index
   */
  #nextInGroup(current: any) {
    let nodes = [...this.#nodes].splice(current.idx + 1);
    const last = nodes.findIndex((n: any) => n.level === current.level);
    if (last > 0) {
      nodes = nodes.splice(0, last).filter((n: any) => n.level === (current.level + 1));
    }
    return nodes.find((n: any) => !n.elem.disabled);
  }

  /**
   * Get the previous focusable IdsTreeNode
   * @private
   * @param {IdsTreeNode} current The current IdsTreeNode.
   * @returns {IdsTreeNode} The previous focusable IdsTreeNode
   */
  #previous(current: IdsTreeNode) {
    const nodes = [...this.querySelectorAll<IdsTreeNode>('ids-tree-node')];
    const currentIdx = nodes.indexOf(current);

    if (nodes[0] !== current) {
      return [...nodes].slice(0, currentIdx).reverse().find((node) => {
        if (node.level > current.level) {
          const parentNode = node.parentElement as IdsTreeNode;
          if (parentNode?.nodeName === 'IDS-TREE-NODE' && !parentNode?.expanded) {
            return parentNode === node;
          }
        }
        return !node.disabled;
      });
    }

    return nodes[0];
  }

  /**
   * Establish Internal Event Handlers
   * @private
   * @returns {void}
   */
  #attachEventHandlers(): void {
    this.offEvent('keydown.tree-node', this);
    this.onEvent('keydown.tree-node', this, (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const node = e.composedPath().find((el: any) => el.nodeName === 'IDS-TREE-NODE') as IdsTreeNode;
      if (node.disabled) return;
      this.#navigate(node, e.code);
    });

    this.offEvent('keyup.tree', this.container);
    this.onEvent('keyup.tree', this.container, (e: any) => {
      const allow = ['Space', 'Enter'];
      const key = e.code;
      const node = e.composedPath().find((el: any) => el.nodeName === 'IDS-TREE-NODE');
      if (allow.indexOf(key) > -1) {
        e.preventDefault();
        e.stopPropagation();
        node.handleClickEvent(e);
      }
    });

    const slotElement = this.container?.querySelector('slot');
    this.offEvent('slotchange.tree-root', slotElement);
    this.onEvent('slotchange.tree-root', slotElement, () => {
      // sync selection mode
      this.#updateSelectableMode();

      // sync aria levels, posinset, setsize
      this.#updateTreeArias(this.rootNodes);

      // set selected current
      this.#active.selectedCurrent = this.treeNodes.find((node) => node.selected) ?? null;
    });

    this.offEvent('expandready', this);
    this.onEvent('expandready', this, async (evt: CustomEvent) => {
      // wait and load async data
      if (this.state.beforeExpanded) {
        const node = evt.detail.node;
        const data = await this.state.beforeExpanded({ elem: this, node });
        if (data) this.addNodes(data, 'child', node);
        evt.detail.onReady();
        return;
      }

      evt.detail.onReady();
    });

    this.offEvent('selected.tree-node', this);
    this.onEvent('selected.tree-node', this, (evt: CustomEvent) => {
      if (this.selectable === 'single') {
        this.#active.selectedOld = this.#active.selectedCurrent;
        this.#active.selectedCurrent = evt.detail.node;
        this.#active.selectedOld?.toggleAttribute(attributes.SELECTED, false);
      }
    });
  }

  #updateTreeArias(rootNodes: Array<IdsTreeNode>) {
    rootNodes.forEach((node, idx) => {
      const prevLevel = node.getAttribute(`aria-level`);
      node.setAttribute(`aria-level`, '1');
      node.setAttribute(`aria-setsize`, String(rootNodes.length));
      node.setAttribute(`aria-posinset`, String(idx + 1));

      // if node was moved from another level, update nested nodes
      if (prevLevel && prevLevel !== '1') node.updateTreeArias();
    });
  }

  clear(): void {
    this.rootNodes.forEach((node) => node.remove());
  }

  redraw(treeData: Array<IdsTreeNodeData> = []): void {
    this.clear();
    const treeHTML = treeData.map((data) => this.#buildTreeNodeHTML(data));
    this.insertAdjacentHTML('afterbegin', treeHTML.join(''));
  }

  #buildTreeNodeHTML(n: IdsTreeNodeData): string {
    const attrs: string[] = [];
    const processed = (s: any) => (/&#?[^\s].{1,9};/g.test(s) ? unescapeHTML(s) : s);
    const validatedText = (s: any) => escapeHTML(processed(s));
    const addAttr = (key: keyof IdsTreeNodeData, useKey?: string) => {
      if (typeof n[key] !== 'undefined') {
        const value = n[key];

        if (typeof value === 'boolean' && value === true) {
          attrs.push(useKey || key);
          return;
        }

        const safeValue = typeof value === 'string' ? validatedText(value) : value;
        attrs.push(`${useKey || key}="${safeValue}"`);
      }
    };

    // set icon from tree
    if (this.icon) n.icon ??= this.icon;

    // build tree node specific attributes
    addAttr('id');
    addAttr('disabled');
    addAttr('text', 'label');
    addAttr('icon');
    addAttr('selected');

    // build children tree nodes
    let children = '';
    if (n.children) {
      addAttr('expanded');

      // set expand/collapse icons
      attrs.push(`collapse-icon="${n.collapseIcon ?? this.collapseIcon}"`);
      attrs.push(`expand-icon="${n.expandIcon ?? this.expandIcon}"`);

      if (this.showExpandAndToggleIcons) {
        attrs.push(attributes.SHOW_EXPAND_AND_TOGGLE_ICONS);
        attrs.push(`${attributes.TOGGLE_COLLAPSE_ICON}="${this.toggleCollapseIcon}"`);
        attrs.push(`${attributes.TOGGLE_EXPAND_ICON}="${this.toggleExpandIcon}"`);
      }

      // for async children
      if (n.children.length === 0) {
        attrs.push('load-async');
      }

      children = n.children
        .map((child) => this.#buildTreeNodeHTML(child))
        .join('');
    }

    const badgeConfig = n.badge;
    let badgeHTML = '';
    if (badgeConfig) {
      badgeHTML = `<ids-badge slot="badge"
        ${badgeConfig.color ? `color="${badgeConfig.color}"` : ''}
        ${badgeConfig.shape ? `shape="${badgeConfig.shape}"` : ''}>
        ${badgeConfig.text ? `${badgeConfig.text}` : ''}
        ${badgeConfig.textAudible ? `<ids-text audible="true">${badgeConfig.textAudible}</ids-text>` : ''}
        ${badgeConfig.icon ? `<ids-icon icon="${badgeConfig.icon}"></ids-icon>` : ''}
      </ids-badge>`;
    }

    return `<ids-tree-node ${attrs.join(' ')}>${badgeHTML}${children}</ids-tree-node>`;
  }
}
