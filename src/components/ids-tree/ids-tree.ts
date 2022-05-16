import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';

import Base from './ids-tree-base';
import IdsDataSource from '../../core/ids-data-source';
import IdsTreeShared from './ids-tree-shared';
import './ids-tree-node';
import '../ids-text/ids-text';

import { unescapeHTML, htmlEntities } from '../../utils/ids-xss-utils/ids-xss-utils';
import { stringToBool, camelCase } from '../../utils/ids-string-utils/ids-string-utils';

import styles from './ids-tree.scss';

/**
 * IDS Tree Component
 * @type {IdsTree}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @mixes IdsLocaleMixin
 * @part tree - the tree element
 */
@customElement('ids-tree')
@scss(styles)
export default class IdsTree extends Base {
  constructor() {
    super();
  }

  /**
   * Invoked each time the custom element is appended into a document-connected element.
   */
  connectedCallback() {
    this.#init();
    super.connectedCallback();

    // this.onEvent(IdsTreeShared.EVENTS.selected, this, (e: any) => {
    //   // If is a group parent select all children
    //   // console.log(e.detail);
    //   // console.log(this.groupNodes);
    //   // if (e.detail.node.isGroup) {
    //   //   const nodesInGroup = e.detail.node.elem?.querySelectorAll('ids-tree-node');
    //   //   if (nodesInGroup) {
    //   //     [...nodesInGroup].forEach((node: any) => {
    //   //       this.#setMultiSelected(node);
    //   //     });
    //   //   }
    //   // }
    //   // If is a node in a group, select and set all parents checkbox up the chain to indeterminate.
    //   // If is a node in a group and all other children are selected set parents to selected.

    //   // const selectedNode = [...this.groupNodes].filter((node) => node.elem === e.detail.node.elem);
    //   // [...this.groupNodes].forEach((node: any) => {
    //   //   console.log(node);
    //   //   console.log(node.elem.querySelectorAll('ids-tree-node'));
    //   // });
    //   // console.log(selectedNode);

    //   // if (e.detail.node.level > 1) {
    //   //   console.log('set parent to indeterminate');
    //   // }
    // });

    // this.onEvent(IdsTreeShared.EVENTS.unselected, this, (e: any) => {
    //   // If is a group parent deselect all children
    //   // If is a node in a group, deselect and set all parents checkbox up the chain to indeterminate.
    //   // If is a node in a group and all other children are deselected set parents to deselected.

    //   // console.log(e.detail);
    //   // console.log(this.groupNodes);
    // });
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
      attributes.USE_TOGGLE_TARGET
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
    this.#toggle(node);
  }

  /**
   * Selects a tree node by given CSS selector.
   * @param {string} selector The selector string to use
   * @returns {void}
   */
  select(selector: string) {
    const node = this.getNode(selector);
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
   * @type {Array<object>}
   */
  #nodesData = [];

  /**
   * Build nodes html and flatten data array
   * @private
   * @returns {object} The html and data array
   */
  #htmlAndData() {
    const processed = (s: any) => (/&#?[^\s].{1,9};/g.test(s) ? unescapeHTML(s) : s);
    const validatedText = (s: any) => htmlEntities(processed(s));
    let html = '';
    const data: any = [];
    const nodesHtml = (nodesData: any) => {
      nodesData.forEach((n: any) => {
        const hasKey = (key: any, node = n) => typeof node[key] !== 'undefined';
        const addKey = (key?: any, useKey?: any) => {
          if (hasKey(key)) {
            const text = useKey === 'label' ? validatedText(n[key]) : n[key];
            html += ` ${useKey || key}="${text}"`;
          }
        };
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
          nodesHtml(n.children);
        } else {
          addKey('icon');
          addKey((this.isMultiSelect && hasKey('label') ? 'label' : 'text'), 'label');
          const text = hasKey('label') ? n.label : (n.text || '');
          html += `>${validatedText(text)}`;
        }
        // Buld the badge
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

    nodesHtml(this.data);
    return { html, data };
  }

  getSelectedStatus(groupNodes: any) {
    let total = 0;
    let selected = 0;
    let unselected = 0;

    if (groupNodes) {
      [...groupNodes.querySelectorAll('ids-tree-node')].forEach((node: any) => {
        total++;
        if (node.selected) {
          selected++;
        } else {
          unselected++;
        }
      });
    }

    let status;
    if (total === selected) {
      status = true;
    } else if (total === unselected) {
      status = false;
    } else {
      status = 'mixed';
    }
    return status;
  }

  /**
   * Rerender by re applying the data
   * @private
   * @returns {void}
   */
  #rerender() {
    if (this.data.length === 0) {
      return;
    }

    const slot = this.shadowRoot.querySelector('slot');
    const { data, html } = this.#htmlAndData();
    slot.innerHTML = html;
    this.#nodesData = data;
    this.#init();
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
        if (this.#nodesData[idx]) {
          args.data = this.#nodesData[idx];
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
    const useToggleTarget = this.getAttribute(attributes.USE_TOGGLE_TARGET);
    if (collapseIcon) {
      this.#updateNodeAttribute(attributes.COLLAPSE_ICON);
    }
    if (expandIcon) {
      this.#updateNodeAttribute(attributes.EXPAND_ICON);
    }
    if (icon) {
      this.#updateNodeAttribute(attributes.ICON);
    }
    if (useToggleTarget) {
      this.#updateNodeAttribute(attributes.USE_TOGGLE_TARGET);
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
   * @param {HTMLElement} target The target node element
   * @returns {object} The node element and index
   */
  #current(target: HTMLElement) {
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

      if (this.isMultiSelect) {
        node.elem.selected = true;
        node.elem.shadowRoot.querySelector('ids-checkbox').input.checked = true;
        this.triggerEvent(IdsTreeShared.EVENTS.selected, this, { detail: { elem: this, node } });

        if (node.isGroup) {
          [...node.elem.shadowRoot.querySelectorAll('ids-tree-node')].forEach((groupNode: any) => {
            if (!groupNode.disabled) {
              groupNode.selected = true;
              groupNode.shadowRoot.querySelector('ids-checkbox').input.checked = true;
              this.triggerEvent(IdsTreeShared.EVENTS.selected, this, { detail: { elem: this, groupNode } });
            }
          });
        }

        const parent: any = this.getParentSelection(node);
        if (parent) {
          const selectedNodes: any = [...this.allChildNodes(parent)]
            .filter((nestedNode: any) => nestedNode.selected === true);
          parent.getRootNode().host.selected = true;
          parent.querySelector('ids-checkbox').input.checked = true;

          // If current node has parent and not all nodes are slelected
          if (this.allChildNodes(parent).length === selectedNodes.length) {
            parent.querySelector('ids-checkbox').indeterminate = null;
          } else {
            // If current node has parent and all nodes are slelected
            parent.querySelector('ids-checkbox').indeterminate = true;
          }
        }
      } else {
        this.#active.selectedOld = this.#active.selectedCurrent;
        this.#active.selectedCurrent = node;
        this.#active.selectedCurrent.elem.selected = true;
        if (this.#active.selectedOld) {
          this.#active.selectedOld.elem.selected = false;
        }
        this.triggerEvent(IdsTreeShared.EVENTS.selected, this, { detail: { elem: this, node } });
      }
    }
  }

  getParentSelection(node: any) {
    let value;
    const fn: any = (n: any) => {
      if (
        (n && n?.classList?.contains('ids-tree-node'))
        || (n.elem && n?.elem?.classList?.contains('ids-tree-node'))
      ) {
        value = n;
      } else if (n && n.parentElement) {
        fn(n.parentElement);
      } else if (n.elem && n.elem.parentElement) {
        fn(n.elem.parentElement);
      }
    };

    fn(node);
    return value;
  }

  allChildNodes(parent: any) {
    return parent.querySelector('.group-nodes').querySelectorAll('ids-tree-node');
  }

  /**
   * Set unselected to given node
   * @private
   * @param {object} node The target node element
   * @returns {void}
   */
  #setUnSelected(node: any) {
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

    node.elem.selected = null;
    node.elem.shadowRoot.querySelector('ids-checkbox').input.checked = null;
    node.elem.shadowRoot.querySelector('ids-checkbox').indeterminate = null;

    if (node.isGroup) {
      [...node.elem.shadowRoot.querySelectorAll('ids-tree-node')].forEach((groupNode: any) => {
        if (!groupNode.disabled) {
          groupNode.selected = null;
          groupNode.shadowRoot.querySelector('ids-checkbox').input.checked = null;
          this.triggerEvent(IdsTreeShared.EVENTS.unselected, this, { detail: { elem: this, groupNode } });
        }
      });
    }

    const parent: any = this.getParentSelection(node);
    if (parent) {
      const selectedNodes: any = [...this.allChildNodes(parent)]
        .filter((nestedNode: any) => nestedNode.selected === true);

      if (selectedNodes.length === 0) {
        parent.getRootNode().host.selected = null;
        parent.querySelector('ids-checkbox').input.checked = null;
        parent.querySelector('ids-checkbox').indeterminate = null;
      }

      // If current node has parent and not all nodes are slelected
      if (this.allChildNodes(parent).length === selectedNodes.length) {
        parent.getRootNode().host.selected = true;
        parent.querySelector('ids-checkbox').input.checked = true;
        parent.querySelector('ids-checkbox').indeterminate = null;
      }

      if (selectedNodes.length !== 0 && this.allChildNodes(parent).length > selectedNodes.length) {
        parent.querySelector('ids-checkbox').indeterminate = true;
      }
    }

    this.triggerEvent(IdsTreeShared.EVENTS.unselected, this, { detail: { elem: this, node } });
  }

  /**
   * Collapse the given node
   * @private
   * @param {object} node The target node element
   * @returns {void}
   */
  #collapse(node: any) {
    if (node && node.elem?.isGroup && node.elem?.expanded) {
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
      this.#toggle(node);
    }
  }

  /**
   * Toggle the expand/collapse
   * @private
   * @param {object} node The target node element
   * @returns {void}
   */
  #toggle(node: any) {
    if (node && node.elem?.isGroup) {
      const events = node.elem.expanded
        ? { before: IdsTreeShared.EVENTS.beforecollapsed, after: IdsTreeShared.EVENTS.collapsed }
        : { before: IdsTreeShared.EVENTS.beforeexpanded, after: IdsTreeShared.EVENTS.expanded };
      let canProceed = true;
      const response = (veto: any) => {
        canProceed = !!veto;
      };
      this.triggerEvent(events.before, this, { detail: { elem: this, response, node } });
      if (!canProceed) {
        return;
      }

      node.elem.expanded = !node.elem.expanded;
      this.triggerEvent(events.after, this, { detail: { elem: this, node } });
    }
  }

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
      const value = this[camelCase(attr)];
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

    // Check if contains atleast one css class, in given list separated by spaces
    const hasSomeClass = (el: any, str: any) => str.split(' ').some((s: any) => el.classList.contains(s));

    // Handle mouse click, and keyup space, enter keys
    const handleClick = (e: any, node: any) => {
      if (!node.elem.disabled) {
        if (this.useToggleTarget || this.isMultiSelect) {
          if (node.elem.isGroup && hasSomeClass(e.target, 'icon toggle-icon')) {
            this.#toggle(node);
          } else {
            if (this.isMultiSelect) {
              if (!node.elem.selected) {
                this.#setSelected(node);
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
            this.#toggle(node);
          }
          this.#setSelected(node);
          this.#setFocus(node);
        }
      }
    };

    this.#nodes.forEach((n: any) => {
      this.onEvent('keydown.tree', n.elem.nodeContainer, (e: any) => {
        if (n.elem.disabled) {
          return;
        }
        // Keep `Space` in keydown allow options, so page not scrolls
        const allow = ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Space'];
        const key = e.code;
        if (allow.indexOf(key) > -1) {
          const current = this.#current(n.elem);
          const isRTL = this.locale.isRTL();

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

      this.onEvent('keyup.tree', n.elem.nodeContainer, (e: any) => {
        const allow = ['Space', 'Enter'];
        const key = e.code;
        if (allow.indexOf(key) > -1) {
          handleClick(e, n);
          e.preventDefault();
          e.stopPropagation();
        }
      });

      this.onEvent('click.tree', n.elem.nodeContainer, (e: any) => {
        e.stopPropagation();
        handleClick(e, n);
      });
    });
  }

  /**
   * The currently selected
   * @returns {object|null} An node object if selectable: single
   */
  get selected(): object | null {
    if (this.selectable) {
      const selected = this.#nodes.filter((n: any) => n.elem.isSelected);
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
   * Set the data array of the datagrid
   * @param {Array} value The array to use
   */
  set data(value: Array<any>) {
    if (value && value.constructor === Array) {
      this.datasource.data = value;
      this.#rerender();
      return;
    }
    this.datasource.data = null;
  }

  get data(): Array<any> { return this.datasource?.data || []; }

  /**
   * Sets the tree to disabled
   * @param {boolean|string} value If true will set disabled attribute
   */
  set disabled(value: string | boolean) {
    const val = stringToBool(value);
    if (val) {
      this.setAttribute(attributes.DISABLED, '');
      this.container.setAttribute(attributes.DISABLED, '');
    } else {
      this.removeAttribute(attributes.DISABLED);
      this.container.removeAttribute(attributes.DISABLED);
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
      this.container.setAttribute('aria-label', value.toString());
    } else {
      this.removeAttribute(attributes.LABEL);
      this.container.setAttribute('aria-label', IdsTreeShared.TREE_ARIA_LABEL);
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
   * Sets the tree to use toggle target
   * @param {boolean|string} value If true will set to use toggle target
   */
  set useToggleTarget(value: boolean | string) {
    if (IdsTreeShared.isBool(value)) {
      this.setAttribute(attributes.USE_TOGGLE_TARGET, `${value}`);
    } else {
      this.removeAttribute(attributes.USE_TOGGLE_TARGET);
    }
    this.#updateNodeAttribute(attributes.USE_TOGGLE_TARGET);
  }

  get useToggleTarget(): boolean | string { return IdsTreeShared.getBoolVal(this, attributes.USE_TOGGLE_TARGET); }
}
