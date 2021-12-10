import {
  IdsElement,
  customElement,
  scss,
  mix,
  attributes
} from '../../core/ids-element';

import {
  IdsEventsMixin,
  IdsKeyboardMixin,
  IdsThemeMixin
} from '../../mixins';

import styles from './ids-error-page.scss';

/**
 * IDS Error Page Component
 * @type {IdsErrorPage}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 * @mixes IdsThemeMixin
 */
@customElement('ids-error-page')
@scss(styles)
class IdsErrorPage extends mix(IdsElement).with(
    IdsEventsMixin,
    IdsKeyboardMixin,
    IdsThemeMixin
  ) {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback?.();
  }

  static get attributes() {
    return [
      ...super.attributes,
      attributes.MESSAGE,
      attributes.ICON,
      attributes.TITLE
    ];
  }

  template() {
    return `<div>IDS Error Page</div>`;
  }
}

export default IdsErrorPage;
