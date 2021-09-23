import * as html from 'html-parse-stringify';
import {
  attributes,
  customElement,
  IdsElement,
  mix,
  scss
} from '../../core';

// Import Utils
import { IdsStringUtils } from '../../utils';

// Import Mixins
import {
  IdsEventsMixin
} from '../../mixins';

// Import Styles
import styles from './ids-hierarchy.scss';

/**
 * IDS Hierarchy Component
 * @type {IdsHierarchy}
 * @inherits IdsElement
 * @mixes IdsElement
 */
@customElement('ids-hierarchy')
@scss(styles)
class IdsHierarchy extends mix(IdsElement).with(IdsEventsMixin) {
  constructor() {
    super();
  }

  connectedCallback() {
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      'items'
    ];
  }

  template() {
    return `
      <ul>
        <li>
          <div>Leaf<div>
        </li>
      </ul>
    `;
  }

  set items(value) {
    this.setAttribute('items', value);
  }

  get items() {
    return this.getAttribute('items');
  }

  // renderHierarchy(item) {
  //   return `
  //     <ul class="ids-hierarchy">
  //       ${item}
  //     </ul>
  //   `;
  // }

  // renderItems(items) {
  //   return items.map((item) => item);
  // }

  /* Hierarchy Type Properties: []
     Elements:
        Hierachy container: ids-hierarchy
        Hierarchy Item: ids-hierarchy-item
          image placeholder
          details
            heading, subheading, micro
          arrow Trigger icon button
     States: selected, expanded, collapsed
  */
}

export default IdsHierarchy;
