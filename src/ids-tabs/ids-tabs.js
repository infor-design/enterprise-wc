import {
  IdsElement,
  customElement,
  props,
  scss,
  mix
} from '../ids-base/ids-element';
import { IdsKeyboardMixin, IdsEventsMixin } from '../ids-base';
import IdsTab from './ids-tab';
import styles from './ids-tabs.scss';

let idCounter = 0;

/**
 * combines classes and considers truthy/falsy +
 * doesn't pollute the attribs/DOM without
 * any fuss
 *
 * @param  {...any} classes classes/expressions
 * @returns {string} ` class="c1 c2..."` || ""
 */
const buildClassAttrib = (...classes) => {
  const classAttrib = classes.reduce((attribStr = '', c) => {
    if (attribStr && c) { return `${attribStr} ${c}`; }
    if (!attribStr && c) { return c; }
    return attribStr;
  }, '');

  return !classAttrib ? '' : ` class=${classAttrib}`;
};

/**
 * IDS Tabs Component
 * @type {IdsTabs}
 * @inherits IdsElement
 */
@customElement('ids-tabs')
@scss(styles)
class IdsTabs extends mix(IdsElement).with(IdsEventsMixin, IdsKeyboardMixin) {
  /**
   * needed for persistent tab id in app
   */
  id;

  /**
   * lets us quickly reference the active element
   * for current index selected with arrow left/right
   * mapping
   */
  childrenIndexMap = new Map();

  /**
   * needed to keep track of event listeners
   * added
   */
  tabValueSet = new Set();

  constructor() {
    super();
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return [props.ORIENTATION, props.VALUE, props.ID];
  }

  /**
   * Create the Template for the contents
   * @returns {string} the template to render
   */
  template() {
    return (
      `<ul
        ${buildClassAttrib('ids-tabs', this.orientation)}
        id="${this.id}"
        role="tablist"
        tabindex="0"
        aria-label="testing"
      >
        <slot></slot>
      </ul>`
    );
  }

  getFocusedTabIndex() {
    if (!(document.activeElement instanceof IdsTab)) {
      return -1;
    }

    const shadowElement = document.activeElement.shadowRoot.activeElement;

    if (this.childrenIndexMap.has(shadowElement)) {
      return this.childrenIndexMap.get(shadowElement);
    }

    return -1;
  }

  // TODO: run child-attrib setters in another re-usable fn
  connectedCallback() {
    if (!this.id) {
      this.setAttribute(props.ID, `ids-tabs-${++idCounter}`);
    }

    let ariaOwnsAttrib = '';

    for (let i = 0; i < this.children.length; i++) {
      const tabElem = this.children[i].shadowRoot.querySelector('.ids-tab');
      this.childrenIndexMap.set(tabElem, i);

      const tabId = `${this.id}-${i}`;
      ariaOwnsAttrib += `${ariaOwnsAttrib ? ' ' : ''}${tabId}`;
      this.children[i].setAttribute(props.TAB_ID, tabId);
    }

    this.container.setAttribute('aria-owns', ariaOwnsAttrib);

    // TODO: (1) only ArrowLeft/Right on horizontal orientation
    // TODO: (2) ArrowUp/Down for vertical orientation

    this.listen('ArrowLeft', this.container, () => {
      const focusedTabIndex = this.getFocusedTabIndex();

      if (focusedTabIndex > 0) {
        this.children[focusedTabIndex - 1].container.focus();
      }
    });

    this.listen('ArrowRight', this.container, () => {
      const focusedTabIndex = this.getFocusedTabIndex();

      if (focusedTabIndex + 1 < this.children.length) {
        this.children[focusedTabIndex + 1].container.focus();
      }
    });

    this.listen('Enter', this.container, () => {
      const focusedTabIndex = this.getFocusedTabIndex();

      if (focusedTabIndex >= 0 && focusedTabIndex < this.children.length) {
        this.setAttribute(props.VALUE, this.getTabIndexValue(focusedTabIndex));
      }
    });

    this.listen('Tab', this.container, (e) => {
      e.preventDefault?.();
      if (e.shiftKey) {
        const focusedTabIndex = this.getFocusedTabIndex();

        if (focusedTabIndex > 0) {
          this.children[focusedTabIndex - 1].container.focus();
        }
        return;
      }

      const focusedTabIndex = this.getFocusedTabIndex();

      if (focusedTabIndex + 1 < this.children.length) {
        this.children[focusedTabIndex + 1].container.focus();
      }
    });
  }

  disconnectedCallback() {
    this.detachAllListeners();
  }

  /**
   * Binds associated callbacks and cleans
   * old handlers when template refreshes
   */
  rendered() {
    /* istanbul ignore next */
    if (!this.shouldUpdateCallbacks) {
      return;
    }

    // stop observing changes before updating DOM
    this.stepObserver.disconnect();
    this.resizeObserver.disconnect();

    // set up observer for resize which prevents overlapping labels
    this.resizeObserver.observe(this.container);

    // set up observer for monitoring if a child element changed
    this.stepObserver.observe(this, {
      childList: true,
      attributes: true,
      subtree: true
    });

    this.shouldUpdateCallbacks = false;
  };

  /**
   * Set the orientation of how tabs will be laid out
   * @param {'horizontal' | 'vertical'} value orientation
   */
  set orientation(value) {
    switch (value) {
    case 'vertical': {
      this.setAttribute(props.ORIENTATION, 'vertical');
      break;
    }
    case 'horizontal':
    default: {
      this.setAttribute(props.ORIENTATION, 'horizontal');
      break;
    }
    }
  }

  get orientation() {
    return this.getAttribute(props.ORIENTATION);
  }

  /**
   * the value representing a currently selected tab
   * @type {string}
   */
  set value(value) {
    this.setAttribute(props.VALUE, value);

    // determine which child tab value was set,
    // then highlight the item

    for (let i = 0; i < this.children.length; i++) {
      const tabValue = this.children[i].getAttribute(props.VALUE);
      this.children[i].selected = tabValue === value;
    }
  }

  get value() {
    return this.getAttribute(props.VALUE);
  }

  set id(value) {
    this.setAttribute(props.ID, value);
  }

  get id() {
    return this.getAttribute(props.ID);
  }

  /**
   * Returns the value provided for a tab at a specified
   * index; if it does not exist, then return zero-based index
   *
   * @param {number} index 0-based tab index
   * @returns {string | number} value or index
   */
  getTabIndexValue(index) {
    return this.children?.[index]?.getAttribute(props.VALUE) || index;
  }

  rendered = () => {
    // clear each existing click handler

    for (const tabValue of this.tabValueSet) {
      this.offEvent(`click.${tabValue}`);
      this.tabValueSet.delete(tabValue);
    }

    // scan through children and add click handlers
    for (let i = 0; i < this.children.length; i++) {
      const tabValue = this.getTabIndexValue(i);
      const eventNs = `click.${tabValue}`;
      this.tabValueSet.add(eventNs);
      this.onEvent(
        eventNs,
        this.children[i],
        () => { this.value = tabValue; }
      );
    }
  };
}

export default IdsTabs;
