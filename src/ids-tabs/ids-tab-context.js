import {
  IdsElement,
  customElement,
  attributes,
  scss,
  mix
} from '../ids-base/ids-element';

import {
  IdsAttributeProviderMixin,
  IdsEventsMixin
} from '../ids-mixins';

import IdsTab from './ids-tab';
import IdsTabContent from './ids-tab-content';
import IdsTabs from './ids-tabs';
import styles from './ids-tabs.scss';

/**
 * list of entries for attributes provided by
 * the ids-tab-context and how they map,
 * as well as which are listened on for updates
 * in the children
 */
const attributeProviderDefs = {
  attributesProvided: [{
    attribute: attributes.VALUE,
    component: IdsTabContent,
    valueXformer: ({ value, element }) => element.getAttribute(attributes.VALUE) === value,
    targetAttribute: attributes.ACTIVE
  }, {
    component: IdsTab,
    attribute: attributes.VALUE,
    targetAttribute: attributes.SELECTED,
    valueXformer: ({ value, element }) => (
      element.getAttribute(attributes.VALUE) === value
    )
  }, {
    component: IdsTabs,
    attribute: attributes.VALUE
  }, {
    component: IdsTabs,
    attribute: attributes.ORIENTATION
  }, {
    component: IdsTab,
    attribute: attributes.ORIENTATION,
  }],
  attributesListenedFor: [{
    component: IdsTabs,
    attribute: attributes.ORIENTATION,
  }, {
    component: IdsTab,
    attribute: attributes.SELECTED
  }, {
    component: IdsTab,
    attribute: attributes.VALUE
  }, {
    component: IdsTabs,
    attribute: attributes.VALUE
  }]
};

/**
 * IDS TabContext Component
 * @type {IdsTabs}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @mixes IdsKeyboardMixin
 * @part container - the container of all tabs
 */
@customElement('ids-tab-context')
@scss(styles)
export default class IdsTabContext extends mix(IdsElement).with(
    IdsEventsMixin,
    IdsAttributeProviderMixin(attributeProviderDefs)
  ) {
  constructor() {
    super();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [attributes.VALUE];
  }

  template() {
    return '<slot></slot>';
  }

  connectedCallback() {
    super.connectedCallback?.();

    // scan for first tab's VALUE if one was not set
    // yet for the sake of assigning it to the ids-tab-context

    /*
    if (!this.hasAttribute(attributes.VALUE)) {
      const value = this.#findFirstValueAssigned();
      if (value) {
        this.value = value;
      }
    }
    */

    this.provideAttributes();
  }

  /**
   * recursively scan for first element to assign value
   * @param {HTMLElement} el element being scanned
   */
  #findFirstValueAssigned(el) {
    let tabInstance = null;

    if (el instanceof IdsTabs) {
      if (el.hasAttribute(attributes.VALUE)) {
        return el.getAttribute(attributes.VALUE);
      }

      if (el.hasAttribute(attributes.VALUE)) {
        return el.children?.[0].getAttribute();
      }
    } else {
      const nodesToScan = [
        ...el.children,
        ...(el.shadowRoot?.children || [])
      ];

      for (const cEl of nodesToScan) {
        let value = this.#findFirstValueAssigned(cEl);
        if (value) {
          return value;
        }
      }
    }

    // @TODO: finish this function
    return undefined;
  }

  disconnectedCallback() {
    super.disconnectedCallback?.();
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
      break;
    }
    case 'horizontal':
    default: {
      this.setAttribute(attributes.ORIENTATION, 'horizontal');
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

      if (Boolean(this.children[i].selected) !== isTabSelected) {
        this.children[i].selected = isTabSelected;
      }

      if (!hadTabSelection && Boolean(this.children[i].selected)) {
        hadTabSelection = true;
      }
    }
  }
}
