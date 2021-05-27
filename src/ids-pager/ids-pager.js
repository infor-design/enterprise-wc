import {
  IdsElement,
  customElement,
  props,
  scss,
  mix,
  stringUtils
} from '../ids-base';
import styles from './ids-pager.scss';

/**
 * IDS Pager Component
 * @type {IdsPager}
 * @inherits IdsElement
 */
@customElement('ids-pager')
@scss(styles)
class IdsPager extends mix(IdsElement) {
  constructor() {
    super();
  }

  template() {
    return '<div><slot></slot></div>';
  }
}
