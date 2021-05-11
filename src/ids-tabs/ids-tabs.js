import {
  IdsElement,
  customElement,
  props,
  scss,
  mix
} from '../ids-base/ids-element';
import {
  IdsKeyboardMixin,
  IdsEventsMixin,
  IdsThemeMixin,
  IdsStringUtils
} from '../ids-base';
import IdsTab from './ids-tab';
import styles from './ids-tabs.scss';

const { buildClassAttrib } = IdsStringUtils;

/**
 * IDS Tabs Component
 * @type {IdsTabs}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @mixes IdsKeyboardMixin
 *
 * @part container - the container of all tabs
 */
@customElement('ids-tabs')
@scss(styles)
class IdsTabs extends mix(IdsElement).with(IdsEventsMixin, IdsKeyboardMixin, IdsThemeMixin) {
  /**
   * lets us quickly reference the active element
   * for current index selected with arrow left/right
   * mapping
   */
  tabElIndexMap = new Map();

  /** used to detach event listeners properly */
  tabValueSet = new Set();

  /** observes changes in tabs */
  #tabObserver = new MutationObserver((mutations) => {
    for (const { type } of mutations) {
      if (type === 'childList') {
        this.updateCallbacks();
      }
    }
  });

  constructor() {
    super();
    this.rendered = this.rendered.bind(this);
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
      `<div
        ${ buildClassAttrib('ids-tabs', this.orientation) }
        part="container"
      >
        <slot></slot>
      </div>`
    );
  }

  getFocusedTabIndex() {
    if (!(document.activeElement instanceof IdsTab)) {
      return -1;
    }

    if (this.tabElIndexMap.has(document.activeElement)) {
      return this.tabElIndexMap.get(document.activeElement);
    }

    return -1;
  }

  connectedCallback() {
    this.setAttribute('role', 'tablist');

    this.#tabObserver.disconnect();
    // set up observer for monitoring if a child
    // element changed
    this.#tabObserver.observe(this, {
      childList: true,
      attributes: true,
      subtree: true
    });
  }

  updateCallbacks() {
    // map tab el refs to their indexes

    this.tabElIndexMap.clear();

    for (let i = 0; i < this.children.length; i++) {
      this.tabElIndexMap.set(this.children[i], i);
    }

    // clear tab values tracked

    for (const tabValue of this.tabValueSet) {
      this.offEvent(`click.${tabValue}`);
      this.tabValueSet.delete(tabValue);
    }

    // scan through children and add
    // click handlers

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

    // add key listeners and consider
    // orientation for assignments

    if (this.orientation !== 'vertical') {
      this.listen('ArrowLeft', this.container, () => {
        const focusedTabIndex = this.getFocusedTabIndex();

        if (focusedTabIndex > 0) {
          this.children[focusedTabIndex - 1].focus();
        }
      });

      this.listen('ArrowRight', this.container, () => {
        const focusedTabIndex = this.getFocusedTabIndex();

        if (focusedTabIndex + 1 < this.children.length) {
          this.children[focusedTabIndex + 1].focus();
        }
      });
    } else {
      this.listen('ArrowUp', this.container, () => {
        const focusedTabIndex = this.getFocusedTabIndex();

        if (focusedTabIndex > 0) {
          this.children[focusedTabIndex - 1].focus();
        }
      });

      this.listen('ArrowDown', this.container, () => {
        const focusedTabIndex = this.getFocusedTabIndex();

        if (focusedTabIndex + 1 < this.children.length) {
          this.children[focusedTabIndex + 1].focus();
        }
      });
    }

    this.listen('Tab', this, (e) => {
      e.preventDefault?.();
      if (e.shiftKey) {
        const focusedTabIndex = this.getFocusedTabIndex();

        if (focusedTabIndex > 0) {
          this.children[focusedTabIndex - 1].focus();
        }
        return;
      }

      const focusedTabIndex = this.getFocusedTabIndex();

      if (focusedTabIndex + 1 < this.children.length) {
        this.children[focusedTabIndex + 1].focus();
      }
    });

    this.listen('Home', this.container, () => {
      this.children[0].focus();
    });

    this.listen('End', this.container, () => {
      this.children[this.children.length - 1].focus();
    });

    this.listen('Enter', this.container, () => {
      const focusedTabIndex = this.getFocusedTabIndex();

      if (focusedTabIndex >= 0 && focusedTabIndex < this.children.length) {
        this.setAttribute(props.VALUE, this.getTabIndexValue(focusedTabIndex));
      }
    });

    // scan through children to detect if we have
    // all or not-all 'count'-assigned content

    if (this.children.length) {
      const hasTabCounts = Boolean(this?.children[0].hasAttribute('count'));

      for (let i = 1; i < this.children.length; i++) {
        if (Boolean(this.children[i].hasAttribute('count')) !== hasTabCounts) {
          throw new Error(
            'ids-tabs: '
            + 'either all or no ids-tab elements should have "count" attrib set'
          );
        }
      }
    }
  }

  /**
   * Set the orientation of how tabs will be laid out
   * @param {'horizontal' | 'vertical'} value orientation
   */
  set orientation(value) {
    switch (value) {
    case 'vertical': {
      this.setAttribute(props.ORIENTATION, 'vertical');
      this.container.classList.add('vertical');

      for (let i = 0; i < this.children.length; i++) {
        this.children[i].setAttribute('orientation', 'vertical');
      }
      break;
    }
    case 'horizontal':
    default: {
      this.setAttribute(props.ORIENTATION, 'horizontal');
      this.container.classList.remove('vertical');

      for (let i = 0; i < this.children.length; i++) {
        this.children[i].setAttribute('orientation', 'horizontal');
      }
      break;
    }
    }
  }

  /**
   * Binds associated callbacks and cleans
   * old handlers when template refreshes
   */
  rendered() {
    this.updateCallbacks();
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
}

export default IdsTabs;
