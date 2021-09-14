import {
  IdsElement,
  customElement,
  mix,
  scss,
  attributes
} from '../../core';

// Import Mixins
import {
  IdsThemeMixin,
  IdsTooltipMixin
} from '../../mixins';

// Import Styles
import styles from './ids-list-box-option.scss';

/**
 * IDS List Box Option Component
 * @type {IdsListBoxOption}
 * @inherits IdsElement
 * @mixes IdsThemeMixin
 * @mixes IdsTooltipMixin
 * @part option - the option element
 */
@customElement('ids-list-box-option')
@scss(styles)
class IdsListBoxOption extends mix(IdsElement).with(IdsThemeMixin, IdsTooltipMixin) {
  constructor() {
    super();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.TOOLTIP
    ];
  }

  connectedCallback() {
    this.setAttribute('role', 'option');
    this.setAttribute('tabindex', '-1');
    super.connectedCallback();
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    return `<slot></slot>`;
  }
}

export default IdsListBoxOption;
