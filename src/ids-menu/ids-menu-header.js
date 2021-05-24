import {
  IdsElement,
  customElement,
  scss,
  mix,
  props
} from '../ids-base';

import styles from './ids-menu-header.scss';

// Import Mixins
import {
  IdsEventsMixin,
  IdsThemeMixin
} from '../ids-mixins';

/**
 * IDS Menu Header Component
 * @type {IdsMenuHeader}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @part header - the menu header element
 */
@customElement('ids-menu-header')
@scss(styles)
class IdsMenuHeader extends mix(IdsElement).with(IdsEventsMixin, IdsThemeMixin) {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
  }

  static get properties() {
    return [props.MODE, props.VERSION];
  }

  template() {
    return `<div class="ids-menu-header" part="header"><slot></slot></div>`;
  }
}

export default IdsMenuHeader;
