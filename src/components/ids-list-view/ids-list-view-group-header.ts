import { attributes } from '../../core/ids-attributes';
import { customElement, scss } from '../../core/ids-decorators';
import IdsElement from '../../core/ids-element';
import styles from './ids-list-view-group-header.scss';

/**
 * IDS List View Group Header Component
 * @inherits IdsElement
 */
@customElement('ids-list-view-group-header')
@scss(styles)
export default class IdsListViewGroupHeader extends IdsElement {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
  }

  static get attributes(): Array<string> {
    return [
      ...super.attributes,
      attributes.HEIGHT
    ];
  }

  /**
   * @returns {string} The components template
   */
  template(): string {
    return `<div role="presentation" class="ids-list-view-group-header"><slot></slot></div>`;
  }

  /**
   * Change the height of the header
   */
  set height(val: string) {
    this.setAttribute(attributes.HEIGHT, val.toString());
  }

  get height(): string {
    return this.getAttribute(attributes.HEIGHT) || '32px';
  }
}
