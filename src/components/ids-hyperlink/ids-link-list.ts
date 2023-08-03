import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import IdsElement from '../../core/ids-element';
import styles from './ids-link-list.scss';

/**
 * IDS Link List Component
 * @type {IdsLinkList}
 * @inherits IdsElement
 */
@customElement('ids-link-list')
@scss(styles)
export default class IdsLinkList extends IdsElement {
  constructor() {
    super();
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.querySelectorAll('ids-hyperlink').forEach((elem) => {
      elem.setAttribute('role', 'listitem');
    });
  }

  static get attributes() {
    return [
      ...super.attributes,
      attributes.TITLE
    ];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template(): string {
    return `<ids-text font-size="20">${this.title}</ids-text>
      <div role="list" class="ids-link-list">
        <slot></slot>
      </div>
    `;
  }
}
