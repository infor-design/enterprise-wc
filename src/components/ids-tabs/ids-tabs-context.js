import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import IdsTabContent from './ids-tab-content';
import styles from './ids-tabs.scss';

/**
 * list of entries for attributes provided by
 * the ids-tabs-context and how they map,
 * as well as which are listened on for updates
 * in the children
 */
const attributeProviderDefs = {
  attributesProvided: [{
    attribute: attributes.VALUE,
    component: IdsTabContent,
    targetAttribute: attributes.ACTIVE,
    valueTransformer: ({ value, element }) => element.getAttribute(attributes.VALUE) === value
  }],
  attributesListenedFor: [],
  exitTags: ['IDS-TABS', 'IDS-TAB-CONTENT', 'IDS-TABS-CONTEXT'],
  maxDepth: 8
};

/**
 * IDS Tabs Context Component
 * @type {IdsTabsContext}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @mixes IdsKeyboardMixin
 * @part container - the container of all tabs
 */
@customElement('ids-tabs-context')
@scss(styles)
class IdsTabsContext extends mix(IdsElement).with(
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

    this.onEvent('tabselect', this, (e) => {
      e.stopPropagation();
      if (this.getAttribute(attributes.VALUE) !== e.target.value) {
        this.setAttribute(attributes.VALUE, e.target.value);
      }
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback?.();
  }

  /** @param {string} value The value representing a currently selected tab */
  set value(value) {
    if (this.getAttribute(attributes.VALUE) !== value) {
      this.setAttribute(attributes.VALUE, value);
    }
  }

  get value() {
    return this.getAttribute(attributes.VALUE);
  }
}

export default IdsTabsContext;
