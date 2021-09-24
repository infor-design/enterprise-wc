import {
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

  connectedCallback() {}

  template() {
    return `<slot></slot>`;
  }
}

export default IdsHierarchy;
