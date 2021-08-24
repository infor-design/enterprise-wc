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

import IdsTabContent from './ids-tab-content';
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
  }]
};

/**
 * IDS TabContext Component
 * @type {IdsTabContext}
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
    this.provideAttributes();

    this.onEvent('tabselect', this, (e) => {
      if (this.getAttribute(attributes.VALUE) !== e.target.value) {
        this.setAttribute(attributes.VALUE, e.target.value);
      }
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback?.();
  }

  /**
   * the value representing a currently selected tab
   * @type {string}
   */
  set value(value) {
    if (this.getAttribute(attributes.VALUE) !== value) {
      this.setAttribute(attributes.VALUE, value);
    }
  }

  get value() {
    return this.getAttribute(attributes.VALUE);
  }
}
