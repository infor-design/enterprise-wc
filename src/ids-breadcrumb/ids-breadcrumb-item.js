import {
  IdsElement,
  customElement,
  scss,
  mix,
  props
} from '../ids-base/ids-element';

// Import Mixins
import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import { IdsThemeMixin } from '../ids-base/ids-theme-mixin';
import '../ids-hyperlink/ids-hyperlink';
import '../ids-text/ids-text';

import styles from './ids-breadcrumb-item.scss';

/**
 * @type {IdsBreadcrumbItem}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @part breadcrumbItem
 */
@customElement('ids-breadcrumb-item')
@scss(styles)
class IdsBreadcrumbItem extends mix(IdsElement).with(IdsEventsMixin, IdsThemeMixin) {
  constructor() {
    super();
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
   static get properties() {
    return ['crumb-type'];
  }

  set crumbType(value) {
    this.setAttribute('crumb-type', value);
  }

  get crumbType() {
    return this.getAttribute('crumb-type');
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    const props = Array.from(this.attributes).map((attr) => attr.name==='crumb-type' ? '' : attr.name+'="'+attr.value+'"').join(' ');
    console.log(props);
    return `
      <li class="ids-breadcrumb-item">
        ${this.crumbType === 'link' ? `<ids-hyperlink ${props}>` : `<ids-text ${props} display="inline">`}
        <slot></slot>
        ${this.crumbType === 'link' ? '</ids-hyperlink>' : '</ids-text>'}
      </li>`;
  }
}

export default IdsBreadcrumbItem;
