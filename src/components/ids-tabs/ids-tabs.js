import {
  IdsElement,
  customElement,
  attributes,
  scss,
  mix,
} from '../../core/ids-element';

// Import Utils
import { IdsStringUtils } from '../../utils';

import {
  IdsKeyboardMixin,
  IdsEventsMixin,
  IdsThemeMixin
} from '../../mixins';

import IdsTab from './ids-tab';
import styles from './ids-tabs.scss';

/**
 * IDS Tabs Component
 * @type {IdsTabs}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @mixes IdsKeyboardMixin
 * @part container - the container of all tabs
 */
@customElement('ids-tabs')
@scss(styles)
export default class IdsTabs extends mix(IdsElement).with(
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
    return [attributes.ORIENTATION, attributes.VALUE];
  }

  /**
   * Create the Template to render
   *
   * @returns {string} the template to render
   */
  template() {
    return (
      `<div
        ${ IdsStringUtils.buildClassAttrib('ids-tabs', this.orientation) }
        part="container"
      >
        <slot></slot>
      </div>`
    );
  }

  connectedCallback() {
    super.connectedCallback?.();
    this.setAttribute('role', 'tablist');

    // set up observer for monitoring if a child
    // element changed

    this.#tabObserver.observe(this, {
      childList: true,
      attributes: true,
      attributeOldValue: true,
      attributeFilter: ['selected', 'value'],
      subtree: true
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
   * Set the orientation of how tabs will be laid out
   *
   * @param {'horizontal' | 'vertical'} value orientation
   */
  set orientation(value) {
    switch (value) {
    case 'vertical': {
      this.setAttribute(attributes.ORIENTATION, 'vertical');
      this.container.classList.add('vertical');

      for (let i = 0; i < this.children.length; i++) {
        this.children[i].setAttribute('orientation', 'vertical');
      }
      break;
    }
    case 'horizontal':
    default: {
      this.setAttribute(attributes.ORIENTATION, 'horizontal');
      this.container.classList.remove('vertical');

      for (let i = 0; i < this.children.length; i++) {
        this.children[i].setAttribute('orientation', 'horizontal');
      }
      break;
    }
    }
  }

  get orientation() {
    return this.getAttribute(attributes.ORIENTATION);
  }

  /**
   * the value representing a currently selected tab
   * @type {string}
   */
  set value(value) {
    if (this.getAttribute(attributes.VALUE) === value) {
      return;
    }

    this.setAttribute(attributes.VALUE, value);
    this.#updateSelectionState();

    // make sure we send them the click
    // on the next paint and any overall
    // selection updates in siblings are
    // made properly

    this.triggerEvent('change', this, {
      bubbles: false,
      detail: { elem: this, value }
    });
  }

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
   * used to detach event listeners properly
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

        /* istanbul ignore next */
        if (m.target instanceof IdsTabs) {
          /* istanbul ignore next */
          this.#updateCallbacks();
          /* istanbul ignore next */
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

          /* istanbul ignore next */
          if (m.attributeName === 'value') {
            if (m.target.selected && this.value !== value) {
              this.value = value;
            } else {
              this.#updateCallbacks();
            }
          }

          /* istanbul ignore next */
          if (m.attributeName === 'selected') {
            /* istanbul ignore next */
            if (Boolean(m.target.selected) && this.value !== m.target.value) {
              this.value = m.target.value;
            }
          }
        }

        /* istanbul ignore else */
        if (m.target instanceof IdsTab || m.target instanceof IdsTabs) {
          if (value !== m.oldValue && m.attributeName === 'value') {
            this.#updateSelectionState();
          }
        }
        break;
      }
      /* istanbul ignore next */
      default: {
        break;
      }
      }

      /* istanbul ignore next */
      if (m.type === 'childList') {
        this.#updateCallbacks();
        this.#updateSelectionState();
      }
    }
  });

  /* istanbul ignore next */
  /**
   * @returns {number} currently focused tab index, or -1
   */
  getFocusedTabIndex() {
    if (!(document.activeElement instanceof IdsTab)) {
      return -1;
    }

    if (this.#tabElIndexMap.has(document.activeElement)) {
      return this.#tabElIndexMap.get(document.activeElement);
    }

    return -1;
  }

  /* istanbul ignore next */
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
        /* istanbul ignore next */
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
      /* istanbul ignore next */
      this.listen('ArrowLeft', this.container, () => {
        const focusedTabIndex = this.getFocusedTabIndex();

        if (focusedTabIndex > 0) {
          this.children[focusedTabIndex - 1].focus();
        }
      });

      /* istanbul ignore next */
      this.listen('ArrowRight', this.container, () => {
        const focusedTabIndex = this.getFocusedTabIndex();

        if (focusedTabIndex + 1 < this.children.length) {
          this.children[focusedTabIndex + 1].focus();
        }
      });
    } else {
      /* istanbul ignore next */
      this.listen('ArrowUp', this.container, () => {
        const focusedTabIndex = this.getFocusedTabIndex();

        if (focusedTabIndex > 0) {
          this.children[focusedTabIndex - 1].focus();
        }
      });

      /* istanbul ignore next */
      this.listen('ArrowDown', this.container, () => {
        const focusedTabIndex = this.getFocusedTabIndex();

        if (focusedTabIndex + 1 < this.children.length) {
          this.children[focusedTabIndex + 1].focus();
        }
      });
    }

    /* istanbul ignore next */
    this.listen('Home', this.container, () => {
      this.children[0].focus();
    });

    /* istanbul ignore next */
    this.listen('End', this.container, () => {
      this.children[this.children.length - 1].focus();
    });

    /* istanbul ignore next */
    this.listen('Enter', this.container, () => {
      const focusedTabIndex = this.getFocusedTabIndex();

      if (focusedTabIndex >= 0 && focusedTabIndex < this.children.length) {
        this.setAttribute(attributes.VALUE, this.getTabIndexValue(focusedTabIndex));
      }
    });
  }

  /**
   * sets the ids-tab selection states
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

      if (Boolean(this.children[i].selected) !== isTabSelected) {
        this.children[i].selected = isTabSelected;
      }

      if (!hadTabSelection && Boolean(this.children[i].selected)) {
        hadTabSelection = true;
      }
    }
  }
}
