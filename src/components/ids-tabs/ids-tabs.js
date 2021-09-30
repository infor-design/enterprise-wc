import {
  IdsElement,
  customElement,
  attributes,
  scss,
  mix,
} from '../../core/ids-element';

import {
  IdsKeyboardMixin,
  IdsEventsMixin,
  IdsThemeMixin,
  IdsAttributeProviderMixin
} from '../../mixins';

import IdsHeader from '../ids-header';
import IdsTab from './ids-tab';
import styles from './ids-tabs.scss';

/**
 * list of entries for attributes provided by
 * the ids-tabs-context and how they map,
 * as well as which are listened on for updates
 * in the children
 */
const attributeProviderDefs = {
  attributesProvided: [{
    attribute: attributes.COLOR_VARIANT,
    component: IdsTab
  }]
};

/**
 * IDS Tabs Component
 * @type {IdsTabs}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @mixes IdsKeyboardMixin
 */
@customElement('ids-tabs')
@scss(styles)
class IdsTabs extends mix(IdsElement).with(
    IdsAttributeProviderMixin(attributeProviderDefs),
    IdsEventsMixin,
    IdsKeyboardMixin,
    IdsThemeMixin
  ) {
  constructor() {
    super();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      attributes.COLOR_VARIANT,
      attributes.ORIENTATION,
      attributes.VALUE
    ];
  }

  template() {
    return '<slot></slot>';
  }

  connectedCallback() {
    super.connectedCallback?.();
    this.setAttribute('role', 'tablist');

    if (!this.hasAttribute(attributes.COLOR_VARIANT)) {
      this.#checkAndSetColorVariant();
    }

    this.onEvent('tabselect', this, (e) => {
      if (e.target.value !== this.value) {
        this.setAttribute(attributes.VALUE, e.target.value);
      }
    });

    // set initial selection state
    this.#updateSelectionState();
  }

  disconnectedCallback() {
    super.disconnectedCallback?.();
    this.#tabObserver.disconnect();
  }

  /**
   * Binds associated callbacks and cleans
   * old handlers when template refreshes
   */
  rendered() {
    this.#updateCallbacks();
  }

  /**
   * @param {'horizontal' | 'vertical'} value The direction the tabs will be laid out in.
   */
  set orientation(value) {
    switch (value) {
    case 'vertical': {
      this.setAttribute(attributes.ORIENTATION, 'vertical');

      for (let i = 0; i < this.children.length; i++) {
        this.children[i].setAttribute('orientation', 'vertical');
      }
      break;
    }
    case 'horizontal':
    default: {
      this.setAttribute(attributes.ORIENTATION, 'horizontal');

      for (let i = 0; i < this.children.length; i++) {
        this.children[i].setAttribute('orientation', 'horizontal');
      }
      break;
    }
    }
  }

  /**
   * @returns {string} The direction the tabs will be laid out in.
   */
  get orientation() {
    return this.getAttribute(attributes.ORIENTATION);
  }

  /**
   * @param {string} value A value which represents a currently selected tab
   */
  set value(value) {
    if (this.getAttribute(attributes.VALUE) !== value) {
      this.setAttribute(attributes.VALUE, value);
    }

    this.#updateSelectionState();

    this.triggerEvent('change', this, {
      bubbles: false,
      detail: { elem: this, value }
    });
  }

  /**
   * @returns {string} The value representing a currently selected tab
   */
  get value() {
    return this.getAttribute(attributes.VALUE);
  }

  /**
   * Returns the value provided for a tab at a specified
   * index; if it does not exist, then return zero-based index
   *
   * @param {number} index 0-based tab index
   * @returns {string | number} value or index
   */
  getTabIndexValue(index) {
    return this.children?.[index]?.getAttribute(attributes.VALUE) || index;
  }

  /**
   * lets us quickly reference the active element
   * for current index selected with arrow left/right
   * mapping
   *
   * @type {Map<HTMLElement, number>}
   * @private
   */
  #tabElIndexMap = new Map();

  /**
   * Used to detach event listeners properly
   * @type {Set<string>}
   * @private
   */
  #tabValueSet = new Set();

  /** observes changes in tabs */
  #tabObserver = new MutationObserver((mutations) => {
    for (const m of mutations) {
      switch (m.type) {
      case 'childList': {
        // be sure to only this component's
        // children in case IdsTab / IdsTab => IdsText
        // implementation is changed; also to ignore
        // presentational components

        if (m.target instanceof IdsTabs) {
          this.#updateCallbacks();
          this.#updateSelectionState();
        }
        break;
      }
      case 'attributes': {
        const value = m.target.getAttribute(m.attributeName);

        if (m.target instanceof IdsTab) {
          if (value === m.oldValue) {
            return;
          }

          // for sub-tab value changes, we need
          // to rebind callbacks as the click events
          // are indexed by tab values (in case of value
          // swaps/etc)

          if (m.attributeName === 'value') {
            if (m.target.selected && this.value !== value) {
              this.value = value;
            } else {
              this.#updateCallbacks();
            }
          }

          if (m.attributeName === 'selected') {
            if (Boolean(m.target.selected) && this.value !== m.target.value) {
              this.value = m.target.value;
            }
          }
        }
        break;
      }
      default: {
        break;
      }
      }

      if (m.type === 'childList') {
        this.#updateCallbacks();
        this.#updateSelectionState();
      }
    }
  });

  /**
   * checks if we are in a header tab and adjusts color-variant
   * accordingly
   */
  #checkAndSetColorVariant() {
    let isHeaderDescendent = false;
    let currentElement = this.host || this.parentNode;

    while (!isHeaderDescendent && currentElement) {
      if (currentElement instanceof IdsHeader) {
        isHeaderDescendent = true;
        break;
      }

      // consider the body the ceiling of where to reach here
      if (currentElement.tagName === 'BODY') {
        break;
      }

      currentElement = currentElement.host || currentElement.parentNode;
    }

    if (isHeaderDescendent) {
      this.setAttribute(attributes.COLOR_VARIANT, 'alternate');
    }
  }

  /** @returns {number} Currently focused tab index, or -1 */
  getFocusedTabIndex() {
    if (!(document.activeElement instanceof IdsTab)) {
      return -1;
    }

    if (this.#tabElIndexMap.has(document.activeElement)) {
      return this.#tabElIndexMap.get(document.activeElement);
    }

    return -1;
  }

  /**
   * When a child value or this component value changes,
   * called to rebind onclick callbacks to each child
   */
  #updateCallbacks() {
    // map tab el refs to their indexes

    this.#tabElIndexMap.clear();

    for (let i = 0; i < this.children.length; i++) {
      this.#tabElIndexMap.set(this.children[i], i);
    }

    // clear tab values tracked

    for (const tabValue of this.#tabValueSet) {
      this.offEvent(`click.${tabValue}`);
      this.#tabValueSet.delete(tabValue);
    }

    // scan through children and add
    // click handlers

    for (let i = 0; i < this.children.length; i++) {
      const tabValue = this.getTabIndexValue(i);
      const eventNs = `click.${tabValue}`;
      this.#tabValueSet.add(eventNs);
      this.onEvent(
        eventNs,
        this.children[i],
        () => {
          if (this.value !== tabValue) {
            this.value = tabValue;
          }
          this.focus();
        }
      );
    }

    // add key listeners and consider
    // orientation for assignments

    if (this.orientation !== 'vertical') {
      this.listen('ArrowLeft', this, () => {
        const focusedTabIndex = this.getFocusedTabIndex();

        if (focusedTabIndex > 0) {
          this.children[focusedTabIndex - 1].focus();
        }
      });

      this.listen('ArrowRight', this, () => {
        const focusedTabIndex = this.getFocusedTabIndex();

        if (focusedTabIndex + 1 < this.children.length) {
          this.children[focusedTabIndex + 1].focus();
        }
      });
    } else {
      this.listen('ArrowUp', this, () => {
        const focusedTabIndex = this.getFocusedTabIndex();

        if (focusedTabIndex > 0) {
          this.children[focusedTabIndex - 1].focus();
        }
      });

      this.listen('ArrowDown', this, () => {
        const focusedTabIndex = this.getFocusedTabIndex();

        if (focusedTabIndex + 1 < this.children.length) {
          this.children[focusedTabIndex + 1].focus();
        }
      });
    }

    this.listen('Home', this, () => {
      this.children[0].focus();
    });

    this.listen('End', this, () => {
      this.children[this.children.length - 1].focus();
    });

    this.listen('Enter', this, () => {
      const focusedTabIndex = this.getFocusedTabIndex();

      if (focusedTabIndex >= 0 && focusedTabIndex < this.children.length) {
        this.setAttribute(attributes.VALUE, this.getTabIndexValue(focusedTabIndex));
      }
    });
  }

  /**
   * Sets the ids-tab selection states
   * based on the current value
   */
  #updateSelectionState() {
    if (!this.children.length) {
      return;
    }

    // determine which child tab value was set,
    // then highlight the item

    let hadTabSelection = false;

    for (let i = 0; i < this.children.length; i++) {
      const tabValue = this.children[i].getAttribute(attributes.VALUE);
      const isTabSelected = Boolean(this.value === tabValue);

      if (this.children[i].selected !== isTabSelected) {
        this.children[i].selected = isTabSelected;
      }

      if (!hadTabSelection && Boolean(this.children[i].selected)) {
        hadTabSelection = true;
      }
    }

    // if no selection found, flag the first child;
    // this will possibly send a callback up to context for
    // other listeners and trigger a value change

    if (!hadTabSelection) {
      window.requestAnimationFrame(() => {
        this.children[0].selected = true;
        this.triggerEvent('tabselect', this.children[0], { bubbles: true });
      });
    }
  }

  /**
   * @param {'alternate'|undefined} variant A theming variant to the ids-tabs which
   * also applies to each ids-tab
   */
  set colorVariant(variant) {
    switch (variant) {
    case 'alternate': {
      this.setAttribute(attributes.COLOR_VARIANT, 'alternate');
      break;
    }
    default: {
      this.removeAttribute(attributes.COLOR_VARIANT);
      break;
    }
    }
  }

  /**
   * @returns {'alternate'|undefined} A theming variant for the ids-tabs which also
   * applies to each ids-tab
   */
  get colorVariant() {
    return this.getAttribute(attributes.COLOR_VARIANT);
  }
}

export default IdsTabs;
