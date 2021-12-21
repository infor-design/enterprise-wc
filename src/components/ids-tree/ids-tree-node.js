import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

import Base from './ids-tree-node-base';

import IdsTreeShared from './ids-tree-shared';
import IdsBadge from '../ids-badge/ids-badge';
import IdsText from '../ids-text/ids-text';

import styles from './ids-tree-node.scss';

/**
 * IDS Tree Node Component
 * @type {IdsTreeNode}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
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
  constructor() {
    super();
  }

  /**
   * Main node container
   */
  nodeContainer = null;

  /**
   * Invoked each time the custom element is appended into a document-connected element.
   */
  connectedCallback() {
    this.nodeContainer = this.shadowRoot?.querySelector('.node-container');
    this.groupNodesEl = this.shadowRoot?.querySelector('.group-nodes');
    super.connectedCallback();
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
      attributes.USE_TOGGLE_TARGET
    ];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    // Set the closest tree element
    this.tree = this.tree || this.closestElement('ids-tree');

    // Set the type is group or node
    const isNodeEl = (el) => /^ids-tree-node$/i.test(el.nodeName);
    this.isGroup = [...this.childNodes].some((el) => isNodeEl(el));

    // Set group template
    if (this.isGroup) {
      let childNodesHTML = '';
      for (let i = 0; i < this.childNodes.length; i++) {
        const node = this.childNodes[i];
        if (isNodeEl(node)) {
          childNodesHTML += node.outerHTML;
        }
      }
      const templ = this.getTemplate(true);
      return templ.replace('{group-nodes}', childNodesHTML);
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
  getTemplate(isGroup) {
    const disabled = `${this.disabled ? ' disabled' : ''}`;
    const selected = `${this.isSelected ? ' selected' : ''}`;
    const ariaDisabled = ` aria-disabled="${this.disabled}"`;
    const ariaSelected = ` aria-selected="${this.isSelected}"`;
    const tabindex = ` tabindex="${this.isTabbable ? '0' : '-1'}"`;

    if (isGroup) {
      const ariaExpanded = ` aria-expanded="${this.expanded}"`;
      const cssClass = `class="ids-tree-node ${this.toggleClass}"`;
      return `
        <li ${cssClass} part="group-node" role="none"${disabled}${selected}>
          <span class="node-container" part="node-container" role="treeitem"${tabindex}${disabled}${selected}${ariaDisabled}${ariaSelected}${ariaExpanded}>
            <ids-icon class="icon" icon="${this.nodeIcon}" part="icon"></ids-icon>
            ${this.toggleIconHtml}
            <slot name="badge" class="badge"></slot>
            <ids-text class="text" part="text">${this.label}</ids-text>
          </span>
          <ul class="group-nodes" role="group">{group-nodes}</ul>
        </li>`;
    }

    return `
      <li class="ids-tree-node" part="node" role="none"${disabled}${selected}>
        <span class="node-container" part="node-container" role="treeitem"${tabindex}${disabled}${selected}${ariaDisabled}${ariaSelected}>
          <ids-icon class="icon" part="icon" icon="${this.nodeIcon}"></ids-icon>
          <slot name="badge" class="badge"></slot>
          <ids-text class="text" part="text"><slot></slot></ids-text>
        </span>
      </li>`;
  }

  /**
   * Get the closest element for given selector.
   * @private
   * @param {string} selector The selector string
   * @param {HTMLElement} base The base element
   * @returns {HTMLElement|null} the closest found element
   */
  closestElement(selector, base = this) {
    const closestFrom = (el) => {
      if (!el || el === document || el === window) {
        return null;
      }
      if (el.assignedSlot) {
        el = el.assignedSlot;
      }
      return el.closest(selector) || closestFrom(el.getRootNode().host);
    };
    return closestFrom(base);
  }

  /**
   * Get tree attribute value for given selector
   * @private
   * @param {string} selector The selector string
   * @returns {string|null} The tree attribute value
   */
  treeAttribute(selector) {
    return this.tree?.getAttribute(selector);
  }

  /**
   * Set focus to node container
   * @returns {void}
   */
  setFocus() {
    this.nodeContainer.focus();
  }

  /**
   * Set the node to be expanded/collapsed
   * @private
   * @returns {void}
   */
  #setExpandCollapse() {
    const iconEl = this.shadowRoot?.querySelector('.icon');
    iconEl?.setAttribute(attributes.ICON, this.nodeIcon);
    this.container.classList.remove(...Object.values(IdsTreeShared.TOGGLE_CLASSES));
    this.container.classList.add(this.toggleClass);
    this.nodeContainer?.setAttribute('aria-expanded', this.expanded.toString());

    if (this.useToggleTarget) {
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
        this.groupNodesEl.style.visibility = '';
        this.groupNodesEl.style.maxHeight = `${this.groupNodesEl.scrollHeight}px`;
        this.offEvent('transitionend.expanded.tree', this.groupNodesEl);
        this.onEvent('transitionend.expanded.tree', this.groupNodesEl, () => {
          this.groupNodesEl.style.maxHeight = '';
        });
      } else {
        // Collapse
        this.offEvent('transitionend.expanded.tree', this.groupNodesEl);
        this.groupNodesEl.style.transition = 'none';
        this.groupNodesEl.style.maxHeight = `${this.groupNodesEl.scrollHeight}px`;
        this.groupNodesEl.style.transition = '';
        requestAnimationFrame(() => {
          this.groupNodesEl.style.maxHeight = 0;
          this.groupNodesEl.style.visibility = 'hidden';
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
  #rotatePlusminus(target) {
    if (this.tree?.toggleIconRotate && this.useToggleTarget && target?.elem) {
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
    if (this.isGroup && this.useToggleTarget && !toggleIconEl) {
      const refEl = this.shadowRoot.querySelector('slot.badge');
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
    if (!!this.selectable && this.isSelected) {
      this.container.setAttribute(attributes.SELECTED, '');
      this.nodeContainer?.setAttribute(attributes.SELECTED, '');
      this.nodeContainer?.setAttribute('aria-selected', 'true');
    } else {
      this.container.removeAttribute(attributes.SELECTED);
      this.nodeContainer?.removeAttribute(attributes.SELECTED);
      this.nodeContainer?.setAttribute('aria-selected', 'false');
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
   * Gets toggle icon html
   * @returns {HTMLElement} the toggle icon html
   */
  get toggleIconHtml() {
    return this.useToggleTarget
      ? `<ids-icon class="toggle-icon" icon="${this.toggleIcon}" part="toggle-icon"></ids-icon>`
      : '';
  }

  /**
   * Gets the current node icon or expand/collapse icon
   * @returns {HTMLElement} the current icon
   */
  get nodeIcon() {
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

  /**
   * Gets the current state is tabbable or not
   * @returns {boolean} the state is tabbable or not
   */
  get isTabbable() { return !this.disabled && this.tabbable; }

  /**
   * Gets the current toggle css class name
   * @returns {string} the toggle css class name
   */
  get toggleClass() {
    return this.expanded
      ? IdsTreeShared.TOGGLE_CLASSES.expanded : IdsTreeShared.TOGGLE_CLASSES.collapsed;
  }

  /**
   * Sets the tree group toggle icon
   * @returns {string} The toggle icon
   */
  get toggleIcon() {
    if (this.useToggleTarget) {
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
  set collapseIcon(value) {
    if (value) {
      this.setAttribute(attributes.COLLAPSE_ICON, value.toString());
    } else {
      this.removeAttribute(attributes.COLLAPSE_ICON);
    }
    this.#setNodeIcon();
  }

  get collapseIcon() { return IdsTreeShared.getVal(this, attributes.COLLAPSE_ICON); }

  /**
   * Sets the tree node to disabled
   * @param {boolean|string} value If true will set disabled attribute
   */
  set disabled(value) {
    const val = stringToBool(value);
    if (val) {
      this.setAttribute(attributes.DISABLED, '');
      this.container.setAttribute(attributes.DISABLED, '');
      this.nodeContainer?.setAttribute(attributes.DISABLED, '');
      this.nodeContainer?.setAttribute('aria-disabled', 'true');
    } else {
      this.removeAttribute(attributes.DISABLED);
      this.container.removeAttribute(attributes.DISABLED);
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
  set expandIcon(value) {
    if (value) {
      this.setAttribute(attributes.EXPAND_ICON, value.toString());
    } else {
      this.removeAttribute(attributes.EXPAND_ICON);
    }
    this.#setNodeIcon();
  }

  get expandIcon() { return IdsTreeShared.getVal(this, attributes.EXPAND_ICON); }

  /**
   * Sets the tree group to be expanded
   * @param {boolean|string} value If true will set expanded attribute
   */
  set expanded(value) {
    if (IdsTreeShared.isBool(value)) {
      this.setAttribute(attributes.EXPANDED, `${value}`);
    } else {
      this.removeAttribute(attributes.EXPANDED);
    }
    this.#setExpandCollapse();
  }

  get expanded() { return IdsTreeShared.getBoolVal(this, attributes.EXPANDED); }

  /**
   * Sets the tree node icon
   * @param {string|null} value The icon name
   */
  set icon(value) {
    if (value) {
      this.setAttribute(attributes.ICON, value.toString());
    } else {
      this.removeAttribute(attributes.ICON);
    }
    this.#setNodeIcon();
  }

  get icon() { return IdsTreeShared.getVal(this, attributes.ICON); }

  /**
   * Set the node label text
   * @param {string} value of the label text
   */
  set label(value) {
    if (value) {
      this.setAttribute(attributes.LABEL, value.toString());
    } else {
      this.removeAttribute(attributes.LABEL);
    }
    if (this.isGroup) {
      this.shadowRoot.querySelector('.text').textContent = `${value}`;
    }
  }

  get label() { return this.getAttribute(attributes.LABEL) || ''; }

  /**
   * Sets the tree node to be selectable 'single', 'multiple'
   * @param {string|null} value The icon name
   */
  set selectable(value) {
    const val = `${value}`;
    const isValid = IdsTreeShared.SELECTABLE.indexOf(val) > -1;
    if (isValid) {
      this.setAttribute(attributes.SELECTABLE, val);
    } else {
      this.removeAttribute(attributes.SELECTABLE);
    }
    this.#setSelection();
  }

  get selectable() {
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
  set selected(value) {
    const val = stringToBool(value);
    if (val) {
      this.setAttribute(attributes.SELECTED, '');
    } else {
      this.removeAttribute(attributes.SELECTED);
    }
    this.#setSelection();
  }

  get selected() { return stringToBool(this.getAttribute(attributes.SELECTED)); }

  /**
   * Set if the node is tabbable
   * @param {boolean|string} value The tabbable
   */
  set tabbable(value) {
    this.setAttribute(attributes.TABBABLE, `${value}`.toString());
    this.#setTabbable();
  }

  get tabbable() { return stringToBool(this.getAttribute(attributes.TABBABLE)); }

  /**
   * Sets the tree to use toggle target
   * @param {boolean|string} value If true will set to use toggle target
   */
  set useToggleTarget(value) {
    if (IdsTreeShared.isBool(value)) {
      this.setAttribute(attributes.USE_TOGGLE_TARGET, `${value}`);
    } else {
      this.removeAttribute(attributes.USE_TOGGLE_TARGET);
    }
    this.#setToggleIconElement();
  }

  get useToggleTarget() { return IdsTreeShared.getBoolVal(this, attributes.USE_TOGGLE_TARGET); }
}
