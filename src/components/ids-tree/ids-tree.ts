import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';

import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsElement from '../../core/ids-element';

import IdsDataSource from '../../core/ids-data-source';
import IdsTreeShared from './ids-tree-shared';
import '../ids-text/ids-text';
import './ids-tree-node';
import '../ids-icon/ids-icon';
import type IdsTreeNode from './ids-tree-node';

import { unescapeHTML, escapeHTML } from '../../utils/ids-xss-utils/ids-xss-utils';
import { stringToBool, camelCase } from '../../utils/ids-string-utils/ids-string-utils';

import styles from './ids-tree.scss';

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
  constructor() {
    super();

    // Setup initial internal states
    this.state = {
    };
  }

  /**
   * Invoked each time the custom element is appended into a document-connected element.
   */
  connectedCallback() {
    super.connectedCallback();

    // if data set before connected
    if (this.datasource?.data?.length) {
      this.redraw();
    } else {
      this.#init();
    }
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
    const label = ` aria-label="${this.label}"`;
    return `
      <ul class="ids-tree" part="tree" role="tree"${label}${disabled}>
        <slot></slot>
      </ul>`;
  }

  /**
   * Tree datasource.
   * @type {object}
   */
  datasource: any = new IdsDataSource();

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
    this.#nodes.filter((n: any) => n.elem.isGroup).forEach((n: any) => {
      n.elem.expanded = true;
    });
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
    this.#expand(node);
  }

  /**
   * Toggle a tree node by given CSS selector.
   * @param {string} selector The selector string to use
   * @returns {void}
   */
  toggle(selector: string) {
    const node = this.getNode(selector);
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.#toggle(node);
  }

  /**
   * Selects a tree node by given CSS selector.
   * @param {string} selector The selector string to use
   * @returns {void}
   */
  select(selector: string) {
    const node = this.getNode(selector);
    if (this.isMultiSelect) {
      this.#setMultiSelected(node);
    }
    this.#setSelected(node);
  }

  /**
   * UnSelects a tree node by given CSS selector.
   * @param {string} selector The selector string to use
   * @returns {void}
   */
  unselect(selector: string) {
    const node = this.getNode(selector);
    this.#setUnSelected(node);
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
   * @returns {object} The node element and index
   */
  getNode(selector: string): any {
    return this.#nodes.find((n: any) => n.elem.matches(selector));
  }

  /**
   * Get the index's data from a given node
   * @param {HTMLElement} node The node HTMLElement
   * @returns {object} The node element and index
   */
  getNodeData(node: HTMLElement): IdsTreeNodeData {
    const nodeData = this.#nodes.find((el) => el.elem === node);
    return nodeData;
  }

  /**
   * Add more node data into the tree
   * @param {Array<IdsTreeData>} nodeData The selector string to use
   * @param {string} location The location where to add the data
   * @param {HTMLElement} node The option HtmlElement to connect before and after to
   * @returns {void}
   */
  addNodes(nodeData: Array<IdsTreeData>, location?: 'bottom' | 'top' | 'before' | 'after' | 'child', node?: HTMLElement) {
    const slot = this.shadowRoot?.querySelector('slot');
    if (!slot) return;
    const { html } = this.#htmlAndData(nodeData);
    if (location === 'top') {
      this.datasource.data = [...nodeData, ...this.datasource.data];
      slot.insertAdjacentHTML('afterbegin', html);
    }
    if (location === 'bottom') {
      this.datasource.data = [...this.datasource.data, ...nodeData];
      slot.insertAdjacentHTML('beforeend', html);
    }
    if (location === 'before' && node) {
      const nodeDatum = this.getNodeData(node);
      const posinsetIdx = (nodeDatum.posinset || 1) - 1;

      const parentArray = (nodeDatum?.data as any)?.parent;
      if (parentArray) {
        parentArray.children = parentArray.children?.reduce((acc: IdsTreeData[], val: IdsTreeData, index: number) => {
          if (index === posinsetIdx) {
            acc.push(...nodeData);
          }
          acc.push(val);
          return acc;
        }, []) || [];
      } else {
        this.datasource.data = this.datasource.data.reduce((acc: IdsTreeData[], val: IdsTreeData, index: number) => {
          if (index === posinsetIdx) {
            acc.push(...nodeData);
          }
          acc.push(val);
          return acc;
        }, []);
      }
      node.insertAdjacentHTML('beforebegin', html);
    }
    if (location === 'after' && node) {
      const nodeDatum = this.getNodeData(node);
      const posinsetIdx = (nodeDatum.posinset || 1) - 1;

      const parentArray = (nodeDatum?.data as any)?.parent;
      if (parentArray) {
        parentArray.children = parentArray.children?.reduce((acc: IdsTreeData[], val: IdsTreeData, index: number) => {
          acc.push(val);
          if (index === posinsetIdx) {
            acc.push(...nodeData);
          }
          return acc;
        }, []) || [];
      } else {
        this.datasource.data = this.datasource.data.reduce((acc: IdsTreeData[], val: IdsTreeData, index: number) => {
          acc.push(val);
          if (index === posinsetIdx) {
            acc.push(...nodeData);
          }
          return acc;
        }, []);
      }

      node.insertAdjacentHTML('afterend', html);
    }
    if (location === 'child' && node) {
      const nodeDatum = this.getNodeData(node);
      const idx = nodeDatum.idx;
      if (this.nodesData && idx !== undefined && this.nodesData[idx]) {
        const sourceData = (nodeDatum?.data as any);
        if (!sourceData.children) sourceData.children = [];
        sourceData.children.push(...nodeData);
      }
      node.shadowRoot?.querySelector('li')?.insertAdjacentHTML('beforeend', `<ul class="group-nodes" role="group">${html}</ul>`);
    }

    const { data } = this.#htmlAndData(this.data);
    this.nodesData = data;
    this.#setNodes();
    this.#initIcons();
    this.#initTabbable();
    this.#initSelection();
  }

  /**
   * Active node elements.
   * @private
   * @type {object}
   */
  #active: any = {
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

  /**
   * The current flatten data array.
   * @private
   * @type {Array<IdsTreeData>}
   */
  nodesData: Array<IdsTreeData> = [];

  /**
   * Build nodes html and flatten data array
   * @private
   * @param {Array<IdsTreeData>} nodeData the nodes to add (or partial nodes)
   * @returns {object} The html and data array
   */
  #htmlAndData(nodeData: Array<IdsTreeData>) {
    const processed = (s: any) => (/&#?[^\s].{1,9};/g.test(s) ? unescapeHTML(s) : s);
    const validatedText = (s: any) => escapeHTML(processed(s));
    let html = '';
    const data: any = [];

    const nodesHtml = (nodesData: any, parent?: any) => {
      nodesData.forEach((n: any) => {
        const hasKey = (key: any, node = n) => typeof node[key] !== 'undefined';
        const addKey = (key?: any, useKey?: any) => {
          if (hasKey(key)) {
            const text = useKey === 'label' ? validatedText(n[key]) : n[key];
            html += ` ${useKey || key}="${text}"`;
          }
        };

        if (!n.dataRef) n.dataRef = { ...n };
        if (parent) n.parent = parent;
        data.push(n);

        html += '<ids-tree-node';
        addKey('id');
        addKey('disabled');
        addKey('selected');

        if (hasKey('children')) {
          addKey('collapseIcon');
          addKey('expandIcon');
          addKey((hasKey('expanded') ? 'expanded' : 'open'), 'expanded');
          addKey((hasKey('label') ? 'label' : 'text'), 'label');
          html += '>';

          let fakeChildren = false;
          if (n.children.length === 0) {
            n.children = [{ placeholder: true }];
            fakeChildren = true;
          }
          nodesHtml(n.children, n);
          if (fakeChildren) n.children = [];
        } else {
          addKey('icon');
          addKey((this.isMultiSelect && hasKey('label') ? 'label' : 'text'), 'label');
          const text = hasKey('label') ? n.label : (n.text || '');
          html += `>${validatedText(text)}`;
        }

        // Add a badge
        if (hasKey('badge')) {
          const hasBadgeKey = (key: any) => hasKey(key, n.badge);
          let badgeHtml = '<ids-badge slot="badge"';
          if (hasBadgeKey('color')) {
            badgeHtml += ` color="${n.badge.color}"`;
          }
          if (hasBadgeKey('shape')) {
            badgeHtml += ` shape="${n.badge.shape}"`;
          }
          badgeHtml += '>';
          if (hasBadgeKey('text')) {
            badgeHtml += `${n.badge.text}`;
          }
          if (hasBadgeKey('textAudible')) {
            badgeHtml += ` <ids-text audible="true">${n.badge.textAudible}</ids-text>`;
          }
          if (hasBadgeKey('icon')) {
            badgeHtml += ` <ids-icon icon="${n.badge.icon}" size="normal"></ids-icon>`;
          }
          badgeHtml += '</ids-badge>';
          html += badgeHtml;
        }
        html += '</ids-tree-node>';
      });
    };

    nodesHtml(nodeData);
    return { html, data };
  }

  /**
   * Rerender by re applying the data
   * @private
   * @returns {void}
   */
  redraw() {
    if (this.data.length === 0 || !this.shadowRoot) {
      return;
    }

    const slot = this.shadowRoot?.querySelector('slot');

    if (slot) {
      const { data, html } = this.#htmlAndData(this.data);
      this.nodesData = data;
      slot.innerHTML = html;
      this.#init();
    }
  }

  /**
   * Set all the attached nodes to tree
   * @private
   * @returns {object} This API object for chaining
   */
  #init() {
    this.#setNodes();
    this.#initIcons();
    this.#initTabbable();
    this.#initSelection();
    this.#attachEventHandlers();

    return this;
  }

  /**
   * Set all the attached nodes to tree
   * @private
   * @returns {object} This API object for chaining
   */
  #setNodes() {
    this.#nodes = [];
    const nodesData = this.nodesData?.filter((item: any) => !item.placeholder) || [];

    const isNodeEl = (elem: any) => /^ids-tree-node$/i.test(elem.nodeName);
    let nodeIdx = 0;
    const setNodes = (root: any, depth: any) => {
      let nodes = [];
      if (depth === 0) {
        nodes = root.childNodes.length
          ? [...root.childNodes].filter((n: any) => isNodeEl(n))
          : root.shadowRoot.querySelectorAll('slot > ids-tree-node');
      } else {
        nodes = root.shadowRoot.querySelectorAll('.group-nodes > ids-tree-node');
      }
      const len = nodes.length;
      for (let i = 0; i < len; i++) {
        const elem = nodes[i];
        const idx = nodeIdx + depth;
        const level = depth + 1;
        const posinset = i + 1;
        const setsize = len;
        elem.setAttribute('role', 'none');
        elem.nodeContainer?.setAttribute('aria-level', `${level}`);
        elem.nodeContainer?.setAttribute('aria-setsize', `${setsize}`);
        elem.nodeContainer?.setAttribute('aria-posinset', `${posinset}`);
        const args: any = {
          elem, level, posinset, setsize, idx, isGroup: elem.isGroup
        };
        if (nodesData[idx]) {
          args.data = nodesData[idx];
        }
        this.#nodes.push(args);
        if (elem.isGroup) {
          setNodes(elem, depth + 1);
        }
        nodeIdx++;
      }
    };
    setNodes(this, 0);
    return this;
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
      this.#active.current.elem.tabbable = true;
    }
    return this;
  }

  /**
   * Initialize selection
   * single selectable: first selected only, if end user set more than one
   * @private
   * @returns {object} This API object for chaining
   */
  #initSelection() {
    const selected = this.#nodes.filter((n: any) => n.elem.isSelected);
    const len = selected.length;
    const unSelect = (nodes: any) => {
      nodes.forEach((n: any) => {
        n.elem.selected = false;
      });
    };
    this.#updateNodeAttribute(attributes.SELECTABLE);
    if (this.selectable === 'single' && len) {
      if (len > 1) {
        this.#active.selectedCurrent = selected.shift();
        unSelect(selected);
      } else {
        this.#active.selectedCurrent = selected[0];
      }
    } else {
      unSelect(selected);
    }
    return this;
  }

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
   * @param {object} [current] The current node.
   * @param {HTMLElement} [current.elem] The current node element
   * @param {number} [current.idx] The current node Index
   * @returns {object} The next node element and index
   */
  #next(current: any) {
    const len = this.#nodes.length;
    if ((current.idx + 1) < len) {
      return [...this.#nodes].splice(current.idx + 1).find((node) => {
        if (current.elem.isGroup && !current.elem.expanded) {
          return node.level === current.level;
        }
        return !node.elem.disabled;
      });
    }
    return this.#nodes[len - 1];
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

  /**
   * Set the focus to given node, and set as active node
   * @private
   * @param {object} target The target node element
   * @returns {void}
   */
  #setFocus(target: any) {
    if (target && target.elem && target.elem !== this.#active.current?.elem) {
      this.#active.old = this.#active.current;
      this.#active.current = target;
      this.#active.current.elem.tabbable = true;
      this.#active.old.elem.tabbable = false;
      this.#active.current.elem.setFocus();
    }
  }

  /**
   * Set the selected to given node
   * @private
   * @param {object} node The target node element
   * @returns {void}
   */
  #setSelected(node: any) {
    if (node && node.elem && node.elem !== this.#active.selectedCurrent?.elem) {
      let canProceed = true;
      const response = (veto: any) => {
        canProceed = !!veto;
      };
      this.triggerEvent(
        IdsTreeShared.EVENTS.beforeselected,
        this,
        { detail: { elem: this, response, node } }
      );
      if (!canProceed) {
        return;
      }

      this.#active.selectedOld = this.#active.selectedCurrent;
      this.#active.selectedCurrent = node;
      this.#active.selectedCurrent.elem.selected = true;
      if (this.#active.selectedOld) {
        this.#active.selectedOld.elem.selected = false;
      }
      this.triggerEvent(IdsTreeShared.EVENTS.selected, this, { detail: { elem: this, node } });
    }
  }

  /**
   * Set the selection when multi-select enabled
   * @param {HTMLElement | any} node tree node
   * @returns {void}
   */
  #setMultiSelected(node: HTMLElement | any) {
    if (node && node.elem) {
      let canProceed = true;
      const response = (veto: any) => {
        canProceed = !!veto;
      };
      this.triggerEvent(
        IdsTreeShared.EVENTS.beforeselected,
        this,
        { detail: { elem: this, response, node } }
      );
      if (!canProceed) {
        return;
      }

      const parentNode: any = this.getParentNode(node);
      node.elem.selected = true;

      if (node.isGroup) {
        this.selectNestedNodes(node);
      }

      // If node has a parent et current state on parentNode of current node.
      if (parentNode) {
        this.selectParentNodes(parentNode);
      }

      this.triggerEvent(IdsTreeShared.EVENTS.selected, this, { detail: { elem: this, node } });
    }
  }

  /**
   * Set unselected to given node
   * @private
   * @param {HTMLElement | any} node The target node element
   * @returns {void}
   */
  #setUnSelected(node: HTMLElement | any) {
    if (node && node.elem && node.elem === this.#active.selectedCurrent?.elem) {
      let canProceed = true;
      const response = (veto: any) => {
        canProceed = !!veto;
      };
      this.triggerEvent(
        IdsTreeShared.EVENTS.beforeunselected,
        this,
        { detail: { elem: this, response, node } }
      );
      if (!canProceed) {
        return;
      }

      this.#active.selectedCurrent.elem.selected = false;
      this.#active.selectedOld = null;
      this.#active.selectedCurrent = null;
      this.triggerEvent(IdsTreeShared.EVENTS.unselected, this, { detail: { elem: this, node } });
    }
  }

  /**
   * Set unselected to given node
   * @private
   * @param {HTMLElement | any} node The target node element
   * @returns {void}
   */
  #setMultiUnSelected(node: any) {
    let canProceed = true;
    const response = (veto: any) => {
      canProceed = !!veto;
    };
    this.triggerEvent(
      IdsTreeShared.EVENTS.beforeunselected,
      this,
      { detail: { elem: this, response, node } }
    );
    if (!canProceed) {
      return;
    }

    const parentNode: any = this.getParentNode(node);
    node.elem.selected = null;

    // If the node is a parent, unselect it's children
    if (node.isGroup) {
      this.unselectNestedNodes(node);
    }

    // If node has a parent et current state on parentNode of current node.
    if (parentNode) {
      this.selectParentNodes(parentNode);
    }

    this.triggerEvent(IdsTreeShared.EVENTS.unselected, this, { detail: { elem: this, node } });
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
   * @param {HTMLElement | any} parent node
   * @returns {object | HTMLElement | any} value
   */
  getAllChildNodes(parent: HTMLElement | any): object | HTMLElement | any {
    if (parent.elem) {
      return parent.elem.shadowRoot.querySelectorAll('.group-nodes > ids-tree-node');
    }
    if (parent.shadowRoot) {
      return parent.shadowRoot.querySelectorAll('.group-nodes > ids-tree-node');
    }
    if (Array.isArray(parent)) {
      return parent.map((p: any) => p.shadowRoot.querySelectorAll('.group-nodes > ids-tree-node'));
    }
    return parent.querySelectorAll('.group-nodes > ids-tree-node');
  }

  /**
   * Set the correct selection of parent nodes
   * @param {HTMLElement | any} parent node(s)
   */
  selectParentNodes(parent: HTMLElement | any) {
    parent.forEach((p: any) => {
      const checkbox = p.container.querySelector('ids-checkbox');
      const selectedNodes = [...this.getAllChildNodes(p)]
        .filter((node: any) => node.selected === true);
      const indeterminateNodes = selectedNodes
        .filter((node: any) => node.shadowRoot.querySelector('ids-checkbox').indeterminate === 'true');

      p.selected = true;

      // If current node has parent and all nodes are selected
      // remove indeterminate from parent
      if (this.getAllChildNodes(p).length === selectedNodes.length) {
        checkbox.indeterminate = null;
      }

      // If there are no selected nodes underneath the parent
      // Remove selection from the parent
      if (selectedNodes.length === 0) {
        p.selected = null;
        checkbox.indeterminate = null;
      }

      // If all children are selected
      if (this.getAllChildNodes(p).length === selectedNodes.length) {
        p.selected = true;
        checkbox.indeterminate = null;
      }

      // If current node is unselected, has parent and siblings are mix selected
      if (
        (selectedNodes.length !== 0 && this.getAllChildNodes(p).length > selectedNodes.length)
        || indeterminateNodes.length > 0
      ) {
        checkbox.indeterminate = true;
      }

      this.triggerEvent(IdsTreeShared.EVENTS.selected, this, { detail: { elem: this, node: p } });
    });
  }

  /**
   * Select nodes under given parent node
   * @param {HTMLElement | any} node element
   */
  selectNestedNodes(node: HTMLElement | any) {
    const findNestedNodes: HTMLElement | any = (n: HTMLElement | any) => {
      if (n.elem && n.elem.hasChildNodes()) {
        const children = [...this.getAllChildNodes(n.elem)];
        children.forEach((childNode: HTMLElement | any) => {
          if (childNode.hasChildNodes() && !childNode.disabled) {
            childNode.selected = true;
            this.triggerEvent(IdsTreeShared.EVENTS.selected, this, { detail: { elem: this, childNode } });
          }
          findNestedNodes(childNode);
        });

        // Set the correct state for the parent nodes
        requestAnimationFrame(() => {
          const selectedChildren = [...this.getAllChildNodes(n.elem)].filter((child: any) => child.selected === true);
          const indeterminateNodes = [...this.getAllChildNodes(n.elem)]
            .filter((childNode: any) => childNode.shadowRoot.querySelector('ids-checkbox')?.indeterminate === 'true');
          if (children.length > selectedChildren.length || indeterminateNodes.length > 0) {
            n.elem.shadowRoot.querySelector('ids-checkbox').indeterminate = true;
          } else {
            n.elem.shadowRoot.querySelector('ids-checkbox').indeterminate = null;
          }
        });
      } else if (n && n.shadowRoot?.querySelector('.group-nodes')) {
        const children = [...this.getAllChildNodes(n)];
        children.forEach((childNode: HTMLElement | any) => {
          if (childNode.hasChildNodes() && !childNode.disabled) {
            childNode.selected = true;
            this.triggerEvent(IdsTreeShared.EVENTS.selected, this, { detail: { elem: this, childNode } });
          }
          findNestedNodes(childNode);
        });

        // Set the correct state for the parent nodes
        requestAnimationFrame(() => {
          const selectedChildren = [...this.getAllChildNodes(n)].filter((child: any) => child.selected === true);
          const indeterminateNodes = [...this.getAllChildNodes(n)]
            .filter((childNode: any) => childNode.shadowRoot.querySelector('ids-checkbox')?.indeterminate === 'true');

          if (children.length > selectedChildren.length || indeterminateNodes.length > 0) {
            n.shadowRoot.querySelector('ids-checkbox').indeterminate = true;
          } else {
            n.shadowRoot.querySelector('ids-checkbox').indeterminate = null;
          }
        });
      }
    };

    findNestedNodes(node);
  }

  /**
   * Unselect nodes under given parent node
   * @param {HTMLElement | any} node element
   */
  unselectNestedNodes(node: HTMLElement | any) {
    const findNestedNodes: HTMLElement | any = (n: HTMLElement | any) => {
      if (n.elem && n.elem.hasChildNodes()) {
        const children = [...this.getAllChildNodes(n.elem)];
        children.forEach((childNode: HTMLElement | any) => {
          if (childNode.hasChildNodes() && !childNode.disabled) {
            childNode.selected = null;
            this.triggerEvent(IdsTreeShared.EVENTS.unselected, this, { detail: { elem: this, childNode } });
          }
          findNestedNodes(childNode);
        });
        n.elem.shadowRoot.querySelector('ids-checkbox').indeterminate = null;
      } else if (n && n.shadowRoot?.querySelector('.group-nodes')) {
        const children = [...this.getAllChildNodes(n)];
        children.forEach((childNode: HTMLElement | any) => {
          if (childNode.hasChildNodes() && !childNode.disabled) {
            childNode.selected = null;
            this.triggerEvent(IdsTreeShared.EVENTS.unselected, this, { detail: { elem: this, childNode } });
          }
          findNestedNodes(childNode);
        });
        n.shadowRoot.querySelector('ids-checkbox').indeterminate = null;
      }
    };

    findNestedNodes(node);
  }

  /**
   * Collapse the given node
   * @private
   * @param {object} node The target node element
   * @returns {void}
   */
  #collapse(node: any) {
    if (node && node.elem?.isGroup && node.elem?.expanded) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.#toggle(node);
    }
  }

  /**
   * Expand the given node
   * @private
   * @param {object} node The target node element
   * @returns {void}
   */
  #expand(node: any) {
    if (node && node.elem?.isGroup && !node.elem?.expanded) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.#toggle(node);
    }
  }

  /**
   * Toggle the expand/collapse
   * @private
   * @param {object} node The target node element
   * @returns {void}
   */
  async #toggle(node: any) {
    if (node && node.elem?.isGroup) {
      const events = node.elem.expanded
        ? { before: IdsTreeShared.EVENTS.beforecollapsed, after: IdsTreeShared.EVENTS.collapsed }
        : { before: IdsTreeShared.EVENTS.beforeexpanded, after: IdsTreeShared.EVENTS.expanded };
      let canProceed = true;
      const response = (veto: any) => {
        canProceed = !!veto;
      };
      this.triggerEvent(events.before, this, { detail: { elem: this, response, node } });

      // Trigger an async callback for children
      const isExpanded = node.elem.expanded;
      if (!isExpanded && this.state.beforeExpanded) {
        const data = await this.state.beforeExpanded({ elem: this, node });
        if (!node.data.children || node.data.children.length === 0) {
          if (!data) return;
          this.addNodes(data, 'child', node.elem);
        }
      }

      if (!canProceed) {
        return;
      }

      node.elem.expanded = !node.elem.expanded;
      this.triggerEvent(events.after, this, { detail: { elem: this, node } });

      if (!isExpanded && this.state.afterExpanded) {
        await this.state.afterExpanded({ elem: this, node });
      }
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
            this.#expand(current);
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

    // Handle mouse click, and keyup space, enter keys
    const handleClick = (e: any, node: any) => {
      if (!node.elem.disabled) {
        if (this.expandTarget === 'icon' || this.isMultiSelect) {
          const hasToggle = e.composedPath().find((el: any) => el.nodeName === 'IDS-ICON' && (el.classList.contains('toggle-icon') || el.classList.contains('icon')));
          if (node.elem.isGroup && hasToggle) {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            this.#toggle(node);
          } else {
            if (this.isMultiSelect) {
              if (!node.elem.selected) {
                this.#setMultiSelected(node);
              } else {
                this.#setMultiUnSelected(node);
              }
              return;
            }
            this.#setSelected(node);
            this.#setFocus(node);
          }
        } else {
          if (node.elem.isGroup) {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            this.#toggle(node);
          }
          this.#setSelected(node);
          this.#setFocus(node);
        }
      }
    };

    this.offEvent('keydown.tree', this.container);
    this.onEvent('keydown.tree', this.container, (e: any) => {
      const node = e.composedPath().find((el: any) => el.nodeName === 'IDS-TREE-NODE');
      const nodeData = this.getNodeData(node);
      if (nodeData.elem?.disabled) {
        return;
      }
      // Keep `Space` in keydown allow options, so page not scrolls
      const allow = ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Space'];
      const key = e.code;
      if (allow.indexOf(key) > -1) {
        const current = this.#current(nodeData.elem);
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

    this.offEvent('click.tree', this.container);
    this.onEvent('click.tree', this.container, (e: any) => {
      const found = e.composedPath().find((i: any) => {
        if (i.nodeName === 'SPAN' || i?.classList?.contains('.node-container')) {
          return i;
        }
      });
      if (!found) return;
      const node = e.composedPath().find((el: any) => el.nodeName === 'IDS-TREE-NODE');
      const nodeData = this.getNodeData(node);
      handleClick(e, nodeData);
    });
  }

  /**
   * The currently selected
   * @returns {IdsTreeNodeData | null} An node object if selectable: single
   */
  get selected(): IdsTreeNodeData | null {
    if (this.selectable) {
      const selected = this.#nodes.filter((n: any) => n.elem.isSelected) as any;
      const len = selected.length;
      if (this.selectable === 'single') {
        return len ? selected[0] : null;
      }
      return selected;
    }
    return null;
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

  /**
   * Set the data array of the tree
   * @param {Array} value The array to use
   */
  set data(value: Array<IdsTreeData>) {
    if (value && value.constructor === Array) {
      this.datasource.data = value;
      this.redraw();
      return;
    }
    this.datasource.data = null;
  }

  get data(): Array<IdsTreeData> { return this.datasource?.data || []; }

  /**
   * Sets the tree to disabled
   * @param {boolean|string} value If true will set disabled attribute
   */
  set disabled(value: string | boolean) {
    const val = stringToBool(value);
    if (val) {
      this.setAttribute(attributes.DISABLED, '');
      this.container?.setAttribute(attributes.DISABLED, '');
    } else {
      this.removeAttribute(attributes.DISABLED);
      this.container?.removeAttribute(attributes.DISABLED);
    }
    this.#updateNodeAttribute(attributes.DISABLED);
  }

  get disabled(): string | boolean { return stringToBool(this.getAttribute(attributes.DISABLED)); }

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
    if (IdsTreeShared.isBool(value)) {
      this.setAttribute(attributes.EXPANDED, `${value}`);
    } else {
      this.removeAttribute(attributes.EXPANDED);
    }
    this.#updateNodeAttribute(attributes.EXPANDED, true);
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

  get label(): string { return this.getAttribute(attributes.LABEL) || IdsTreeShared.TREE_ARIA_LABEL; }

  /**
   * Sets the tree group to be selectable 'single', 'multiple'
   * @param {string | null| boolean} value The selectable
   */
  set selectable(value: string | null | boolean) {
    const val = `${value}`;
    const isValid = IdsTreeShared.SELECTABLE.indexOf(val) > -1;
    if (isValid) {
      this.setAttribute(attributes.SELECTABLE, val);
    } else {
      this.removeAttribute(attributes.SELECTABLE);
    }
    this.#initSelection();
  }

  get selectable(): string | null | boolean {
    const value = this.getAttribute(attributes.SELECTABLE);
    if (value === 'false') {
      return false;
    }
    return value !== null ? value : IdsTreeShared.DEFAULTS.selectable;
  }

  get isMultiSelect() {
    return this.selectable === 'multiple';
  }

  set showExpandAndToggleIcons(value: boolean) {
    if (IdsTreeShared.isBool(value)) {
      this.setAttribute(attributes.SHOW_MULTIPLE_ICONS, `${value}`);
    } else {
      this.removeAttribute(attributes.SHOW_MULTIPLE_ICONS);
    }
  }

  get showExpandAndToggleIcons(): boolean { return IdsTreeShared.getBoolVal(this, attributes.SHOW_MULTIPLE_ICONS); }

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

  get expandTarget(): 'node' | 'icon' | string { return this.getAttribute(attributes.EXPAND_TARGET) || 'node'; }
}
