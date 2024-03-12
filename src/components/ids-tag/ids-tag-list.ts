import { customElement, scss } from '../../core/ids-decorators';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsElement from '../../core/ids-element';
import styles from './ids-tag-list.scss';

/**
 * IDS Tag List Component
 * @type {IdsTagList}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @part tag - the tag element
 * @part icon - the icon element
 */
@customElement('ids-tag-list')
@scss(styles)
export default class IdsTagList extends IdsEventsMixin(IdsElement) {
  constructor() {
    super();
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template(): string {
    return '<slot></slot>';
  }
}
