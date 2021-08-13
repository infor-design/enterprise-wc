import {
  IdsElement,
  customElement,
  attributes,
  scss,
  mix
} from '../ids-base/ids-element';

import { IdsAttributeProviderMixin } from '../ids-mixins';

import IdsTab from './ids-tab';
import IdsTabs from './ids-tabs';
import styles from './ids-tabs.scss';

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
export default class IdsTabContext extends mix(IdsElement).with(IdsAttributeProviderMixin) {
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

  get providedAttributes() {
    return {
      [attributes.VALUE]: [{
        component: IdsTabs
      }]
    };
  }

  template() {
    return '<slot></slot>';
  }

  connectedCallback() {
    super.connectedCallback?.();
    this.container = this;
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
