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
export default class IdsPager extends IdsElement {
  constructor() {
    super();
  }

  template() {
    return (
      `<div class="ids-pager">
        <div class="left-content">
          <slot name="left"></slot>
        </div>
        <div class="main-content">
          <slot></slot>
        </div>
        <div class="right-content">
          <slot name="right"></slot>
        </div>
      </div>`
    );
  }
}
