import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';

import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsElement from '../../core/ids-element';

import IdsDataSource from '../../core/ids-data-source';
import IdsTreeShared from './ids-tree-shared';
import '../ids-text/ids-text';
import '../ids-icon/ids-icon';
import './ids-tree-node';
import { type TreeNode } from './ids-tree-node';
import IdsTreeNode from './ids-tree-node';

import { unescapeHTML, escapeHTML } from '../../utils/ids-xss-utils/ids-xss-utils';
import { stringToBool, camelCase } from '../../utils/ids-string-utils/ids-string-utils';

import styles from './ids-tree.scss';
import { next } from '../../utils/ids-dom-utils/ids-dom-utils';

export interface IdsTreeData {
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
  children?: Array<IdsTreeData>;
}

export interface IdsTreeNodeData {
  /* The Html Node/Element */
  elem?: IdsTreeNode;
  /* The attached data element */
  data?: IdsTreeData;
  /* The overal indx */
  idx?: number;
  /* Is it a group node */
  isGroup?: boolean;
  /* The tree level */
  level?: number;
  /* The position within the tree level */
  posinset?: number;
  /* The number of items with it in the set */
  setsize?: number;
}

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
   * Tree datasource.
   * @type {object}
   */
  datasource: any = new IdsDataSource();

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

  #rootNodes: Array<IdsTreeNode> = [];

  /**
   * List of node elements attached to tree.
   * @private
   * @type {Array<object>}
   */
  #nodes: Array<any> = [];

  /**
   * The current flatten data array.
   * @private
   * @type {Array<IdsTreeData>}
   */
  nodesData: Array<IdsTreeData> = [];

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
   * Set all the attached nodes to tree
   * @private
   * @returns {object} This API object for chaining
   */
  #init() {
    this.#initIcons();
    this.#initTabbable();
    this.#updateSelectableMode();
    this.#attachEventHandlers();

    return this;
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
   * Collapse all attached nodes to the tree
   * @returns {void}
   */
  collapseAll() {
    this.#nodes.filter((n: any) => n.elem.isGroup).forEach((n: any) => {
      n.elem.expanded = false;
    });
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
    this.#collapse(node);
  }

  /**
   * Expand a tree node by given CSS selector.
   * @param {string} selector The selector string to use
   * @returns {void}
   */
  expand(selector: string) {
    const node = this.getNode(selector);
  }

  /**
   * Toggle a tree node by given CSS selector.
   * @param {string} selector The selector string to use
   * @returns {void}
   */
  toggle(selector: string) {
    const node = this.getNode(selector);
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.#toggleExpanded(node);
  }

  /**
   * Selects a tree node by given CSS selector.
   * @param {string} selector The selector string to use
   * @returns {void}
   */
  select(selector: string) {
    const node = this.getNode(selector);
  }

  /**
   * UnSelects a tree node by given CSS selector.
   * @param {string} selector The selector string to use
   * @returns {void}
   */
  unselect(selector: string) {
    const node = this.getNode(selector);
  }

  /**
   * Ckeck if related node is selected or not, by given CSS selector.
   * @param {string} selector The selector string to use
   * @returns {boolean} true, if given node is selected
   */
  isSelected(selector: string) {
    const node = this.getNode(selector);
    return !!node?.elem?.isSelected;
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
   * DEPRECATE: What is this for?
   * Get the index's data from a given node
   * @param {HTMLElement} node The node HTMLElement
   * @returns {object} The node element
   */
  getNodeData(node: HTMLElement): IdsTreeNodeData {
    const nodeData = this.#nodes.find((el) => el.elem === node);
    return nodeData;
  }

  /**
   * Add more node data into the tree
   * @param {Array<TreeNode>} nodeData The selector string to use
   * @param {string} location The location where to add the data
   * @param {IdsTreeNode} node The option HtmlElement to connect before and after to
   * @returns {void}
   */
  addNodes(nodeData: Array<TreeNode>, location?: 'bottom' | 'top' | 'before' | 'after' | 'child', node?: IdsTreeNode): void {
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
        break;
      case 'bottom':
      default:
        this.insertAdjacentHTML('beforeend', treeNodeHTML);
    }
  }

  /**
   * Initialize tree settings
   * @private
   * @returns {object} This API object for chaining
   */
  #initIcons() {
    const collapseIcon = this.getAttribute(attributes.COLLAPSE_ICON);
    const expandIcon = this.getAttribute(attributes.EXPAND_ICON);
    const icon = this.getAttribute(attributes.ICON);
    const expandTarget = this.getAttribute(attributes.EXPAND_TARGET);
    if (collapseIcon) {
      this.#updateNodeAttribute(attributes.COLLAPSE_ICON);
    }
    if (expandIcon) {
      this.#updateNodeAttribute(attributes.EXPAND_ICON);
    }
    if (icon) {
      this.#updateNodeAttribute(attributes.ICON);
    }
    if (expandTarget) {
      this.#updateNodeAttribute(attributes.EXPAND_TARGET);
    }
    return this;
  }

  /**
   * Initialize tabable to first focusable node as tabable
   * @private
   * @returns {object} This API object for chaining
   */
  #initTabbable() {
    const first = this.#nodes.find((n: any) => !n.elem.disabled);
    if (first) {
      this.#active.current = first;
      this.#active.current.tabbable = true;
    }
    return this;
  }

  #updateSelectableMode() {
    const selectableMode = this.selectable;
    this.rootNodes.forEach((node) => node.setAttribute(attributes.SELECTABLE, selectableMode));
  }

  /**
   * Initialize selection
   * single selectable: first selected only, if end user set more than one
   */
  // #updateSelectableMode() {
  //   this.#traverseTree((treeNode: IdsTreeNode) => {
  //     treeNode.setAttribute(attributes.SELECTABLE, 'multiple');
  //   });
  // }

  /**
   * Get the current node element and index
   * @private
   * @param {HTMLElement | undefined} target The target node element
   * @returns {object} The node element and index
   */
  #current(target: HTMLElement | undefined) {
    return this.#nodes.find((n: any) => n.elem === target);
  }

  /**
   * Get the next node element and index
   * @private
   * @param {IdsTreeNdoe} current The current node.
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
    if (current.parentElement instanceof IdsTreeNode) {
      return this.#next(current.parentElement, true);
    }

    return null;
    // if (nextSibling instanceof IdsTreeNode && !nextSibling)
    // if ((current.idx + 1) < len) {
    //   return [...this.#nodes].splice(current.idx + 1).find((node) => {
    //     if (current.elem.isGroup && !current.elem.expanded) {
    //       return node.level === current.level;
    //     }
    //     return !node.elem.disabled;
    //   });
    // }
    // return this.#nodes[len - 1];
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
   * Get the previous node element and index
   * @private
   * @param {object} [current] The current node.
   * @param {HTMLElement} [current.elem] The current node element
   * @param {number} [current.idx] The current node Index
   * @returns {object} The previous node element and index
   */
  #previous(current: any) {
    if ((current.idx - 1) > -1) {
      return [...this.#nodes].slice(0, current.idx).reverse().find((node) => {
        if (node.level > current.level) {
          const host = node.elem.getRootNode().host;
          if (!host.expanded) {
            return host === node.elem;
          }
        }
        return !node.elem.disabled;
      });
    }
    return this.#nodes[0];
  }

  #canProceed(eventName: string, node?: IdsTreeNode): boolean {
    let canProceed = true;
    const response = (veto: boolean) => { canProceed = veto; };
    this.triggerEvent(eventName, this, {
      detail: { elem: this, response, node}
    });

    return canProceed;
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
   * Gets the parent node of the currently selected node.
   * @param {HTMLElement | any} node ids-tree-node
   * @returns {HTMLElement | any} value
   */
  getParentNode(node: HTMLElement | any) {
    const value: any = [];
    const findParentElements: HTMLElement | any = (n: HTMLElement | any) => {
      if (
        (n && n?.classList?.contains('ids-tree-node'))
        || (n.elem && n?.elem?.classList?.contains('ids-tree-node'))
      ) {
        // value = n.getRootNode().host;
        value.push(n.getRootNode().host);
      } else if (n && n.parentElement) {
        findParentElements(n.parentElement);
        if (n.getRootNode().host?.parentElement) {
          findParentElements(n.getRootNode().host.parentElement);
        }
      } else if (n.elem && n.elem.parentElement) {
        findParentElements(n.elem.parentElement);
      }
    };

    findParentElements(node);
    return value;
  }

  /**
   * Get all child nodes of given parent
   * @param {IdsTreeNode} parent Parent IdsTreeNode
   * @returns {Array<IdsTreeNode>} Children IdsrootNodes
   */
  getAllChildNodes(parent: IdsTreeNode): Array<IdsTreeNode> {
    return parent.rootNodes;
  }

  /**
   * Collapse the given node
   * @private
   * @param {object} node The target node element
   * @returns {void}
   */
  #collapse(node: IdsTreeNode) {
    if (!node.isGroup
      || !node.expanded
      || !this.#canProceed('beforecollapsed', node)
    ) return;

    node.toggleAttribute('expanded', false);
    this.triggerEvent('collapsed', this, { detail: { elem: this, node } });
  }

  /**
   * Expand the given node
   * @private
   * @param {object} node The target node element
   * @returns {void}
   */
  async #expand(node: IdsTreeNode) {
    if (!node.isGroup
      || node.expanded
      || !this.#canProceed('beforeexpanded', node)
    ) return;

    // wait and load async data
    if (this.state.beforeExpanded && !node.hasChildren) {
      const data = await this.state.beforeExpanded({ elem: this, node });
      if (data) this.addNodes(data, 'child', node);
    }

    node.toggleAttribute(attributes.EXPANDED, true);
    this.triggerEvent('expanded', this, { detail: { elem: this, node } });

    // wait for any operations after expanding
    if (this.state.afterExpanded) {
      await this.state.afterExpanded({ elem: this, node });
    }
  }

  /**
   * Toggle the expand/collapse
   * @param {IdsTreeNode} node The target node element
   */
  async #toggleExpanded(node: IdsTreeNode) {
    if (!node) return;

    const isExpanded = node.expanded;
    if (isExpanded) {
      this.#collapse(node);
    } else {
      await this.#expand(node);
    }
  }

  /**
   * An async function that fires as the node is expanding
   * @param {Function} func The async function
   */
  set beforeExpanded(func: (params: any) => Promise<Array<IdsTreeNodeData>>) {
    this.state.beforeExpanded = func;
  }

  get beforeExpanded(): () => Promise<Array<IdsTreeNodeData>> { return this.state.beforeExpanded; }

  /**
   * An async function that fires after the node was expanded
   * @param {Function} func The async function
   */
  set afterExpanded(func: () => Promise<void>) {
    this.state.afterExpanded = func;
  }

  get afterExpanded(): () => Promise<void> { return this.state.afterExpanded; }

  /**
   * Set toggle icon
   * @private
   * @returns {void}
   */
  #setToggleIcon(): void {
    this.#nodes.forEach((n: any) => {
      if (n.isGroup) {
        const toggleIconEl = n.elem.shadowRoot?.querySelector('.toggle-icon');
        toggleIconEl?.setAttribute(attributes.ICON, n.elem.toggleIcon);
      }
    });
  }

  /**
   * Update the given node attribute
   * @private
   * @param {string} attr The attribute name
   * @param {boolean} mustUpdate if true, will must update
   */
  #updateNodeAttribute(attr: string, mustUpdate?: boolean) {
    this.#nodes.forEach((n: any) => {
      const nodeVal = n.elem.getAttribute(attr);
      const value = (this as any)[camelCase(attr)];
      if (mustUpdate || nodeVal !== value) {
        n.elem.setAttribute(attr, value?.toString());
      }
    });
  }

  #traverseTree(fn: (treeNode: IdsTreeNode) => void) {
    this.querySelectorAll<IdsTreeNode>('ids-tree-node').forEach((treeNode) => {
      fn(treeNode);
    });
  }

  /**
   * Establish Internal Event Handlers
   * @private
   * @returns {void}
   */
  #attachEventHandlers(): void {
    // Set the move action with arrow keys
    const move = {
      next: (current: any) => {
        const next = this.#next(current);
        if (next) {
          this.#setFocus(next);
        }
      },
      previous: (current: any) => {
        const previous = this.#previous(current);
        if (previous) {
          this.#setFocus(previous);
        }
      },
      forward: (current: any) => {
        if (current.elem.isGroup) {
          if (current.elem.expanded) {
            const next = this.#nextInGroup(current);
            this.#setFocus(next);
          } else {
            //this.#expand(current);
          }
        }
      },
      backward: (current: any) => {
        if (current.elem.isGroup && current.elem.expanded) {
          this.#collapse(current);
        } else if (current.level > 1) {
          const previous = { elem: current.elem.getRootNode().host };
          this.#setFocus(previous);
        }
      }
    };

    this.offEvent('treenodekeydown', this);
    this.onEvent('treenodekeydown', this, (e: any) => {
      console.log('IDSTREE keydown', e.detail);
      e.preventDefault();
      e.stopPropagation();
      const node = e.detail.node;
      if (node.disabled) return;

      // Keep `Space` in keydown allow options, so page not scrolls
      const allow = ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Space'];
      const key = e.detail.code;

      if (allow.indexOf(key) > -1) {
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
        e.preventDefault();
        e.stopPropagation();
      }
    });

    this.offEvent('keyup.tree', this.container);
    this.onEvent('keyup.tree', this.container, (e: any) => {
      const allow = ['Space', 'Enter'];
      const key = e.code;
      const node = e.composedPath().find((el: any) => el.nodeName === 'IDS-TREE-NODE');
      const nodeData = this.getNodeData(node);
      if (allow.indexOf(key) > -1) {
        handleClick(e, nodeData);
        e.preventDefault();
        e.stopPropagation();
      }
    });

    const slotElement = this.container?.querySelector('slot');
    this.offEvent('slotchange.tree-root', slotElement);
    this.onEvent('slotchange.tree-root', slotElement, () => {
      console.log('IDSTREE SLOTCHANGE');
      // sync selection mode
      this.#updateSelectableMode();

      // sync aria levels, posinset, setsize
      this.#updateTreeArias(this.rootNodes);
    });

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

    this.onEvent('selected.tree-node', this, (evt: CustomEvent) => {
      if (this.selectable === 'single') {
        this.#active.selectedOld = this.#active.selectedCurrent;
        this.#active.selectedCurrent = evt.detail.elem;

        if (this.#active.selectedOld !== this.#active.selectedCurrent) {
          this.#active.selectedOld?.toggleAttribute(attributes.SELECTED, false);
        }
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

  /**
   * The currently selected
   * @returns {IdsTreeNode | null} An node object if selectable: single
   */
  get selected(): IdsTreeNode | null {
    return this.#active.selectedCurrent ?? null;
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

  get collapseIcon(): string | null { return IdsTreeShared.getVal(this, attributes.COLLAPSE_ICON); }

  get slotElement() {
    return this.container?.querySelector<HTMLSlotElement>('slot');
  }

  clear() {
    this.slotElement?.assignedElements().forEach((treeNode) => treeNode.remove());
  }

  redraw(treeData: Array<TreeNode> = []) {
    this.clear();
    const treeHTML = treeData.map((data) => this.#buildTreeNodeHTML(data));
    this.insertAdjacentHTML('afterbegin', treeHTML.join(''));
  }

  #buildTreeNodeHTML(n: TreeNode): string {
    const attrs: string[] = [];
    const addAttr = (key: keyof TreeNode, useKey?: string) => {
      if (typeof n[key] !== 'undefined') {
        const value = n[key];

        if (typeof value === 'boolean' && value === true) {
          attrs.push(useKey || key);
          return;
        }

        const safeValue = typeof value === 'string' ? escapeHTML(value) : value;
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

    // build children tree nodes
    let children = '';
    if (n.children) {
      addAttr('collapseIcon');
      addAttr('expandIcon');
      addAttr('expanded');

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

  get rootNodes(): Array<IdsTreeNode> {
    return [...this.querySelectorAll<IdsTreeNode>(':scope > ids-tree-node')];
  }

  get treeNodes(): Array<IdsTreeNode> {
    return [...this.querySelectorAll<IdsTreeNode>('ids-tree-node')];
  }

  /**
   * Set the data array of the tree
   * @param {Array} value The array to use
   */
  set data(value: Array<TreeNode>) {
    if (Array.isArray(value)) {
      this.redraw(value);
      return;
    }

    this.clear();
  }

  get data(): Array<TreeNode> {
    return this.rootNodes.map((child) => child.data);
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

  get expandIcon(): string | null { return IdsTreeShared.getVal(this, attributes.EXPAND_ICON); }

  /**
   * Sets the tree to be expanded
   * @param {boolean|string} value If true will set expanded attribute
   */
  set expanded(value: boolean | string) {
    const treeExpanded = stringToBool(value);
    this.toggleAttribute(attributes.EXPANDED, treeExpanded);

    //this.#updateNodeAttribute(attributes.EXPANDED, true);
  }

  get expanded(): boolean | string { return IdsTreeShared.getBoolVal(this, attributes.EXPANDED); }

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

    this.#updateNodeAttribute(attributes.ICON);
  }

  get icon(): string { return IdsTreeShared.getVal(this, attributes.ICON); }

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

  /**
   * Sets the tree group to be selectable 'single', 'multiple'
   * @param {string | null} value The selectable
   */
  set selectable(value: string | null) {
    const val = `${value}`;
    const isValid = IdsTreeShared.SELECTABLE.indexOf(val) > -1;

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

  get isMultiSelect() {
    return this.selectable === 'multiple';
  }

  /**
   * Sets the tree to show expand and collapse icons
   * @param {boolean} value If true will set
   */
  set showExpandAndToggleIcons(value: boolean) {
    if (IdsTreeShared.isBool(value)) {
      this.setAttribute(attributes.SHOW_EXPAND_AND_COLLAPSE_ICONS, `${value}`);
    } else {
      this.removeAttribute(attributes.SHOW_EXPAND_AND_COLLAPSE_ICONS);
    }
  }

  /**
   * Get the tree to show expand and collapse icons
   * @returns {boolean} true if the tree show expand and collapse icons
   */
  get showExpandAndToggleIcons(): boolean {
    return IdsTreeShared.getBoolVal(this, attributes.SHOW_EXPAND_AND_COLLAPSE_ICONS);
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
    this.#setToggleIcon();
  }

  get toggleCollapseIcon(): string | null { return IdsTreeShared.getVal(this, attributes.TOGGLE_COLLAPSE_ICON); }

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
    this.#setToggleIcon();
  }

  get toggleExpandIcon(): string | null { return IdsTreeShared.getVal(this, attributes.TOGGLE_EXPAND_ICON); }

  /**
   * Sets the tree to use toggle icon rotate
   * @param {boolean|string} value If false will set to use toggle icon to be false
   */
  set toggleIconRotate(value: boolean | string) {
    if (IdsTreeShared.isBool(value)) {
      this.setAttribute(attributes.TOGGLE_ICON_ROTATE, `${value}`);
    } else {
      this.removeAttribute(attributes.TOGGLE_ICON_ROTATE);
    }
  }

  get toggleIconRotate(): boolean | string { return IdsTreeShared.getBoolVal(this, attributes.TOGGLE_ICON_ROTATE); }

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
}
