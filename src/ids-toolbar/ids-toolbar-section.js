import { IdsElement, scss, customElement } from '../ids-base/ids-element';
import { props } from '../ids-base/ids-constants';
// @ts-ignore
import styles from './ids-toolbar.scss';

const TOOLBAR_SECTION_PROPS = [];

/**
 * IDS Toolbar Section Component
 */
@customElement('ids-toolbar-section')
@scss(styles)
class IdsToolbarSection extends IdsElement {
  constructor() {
    super();
  }

  static get properties() {
    return TOOLBAR_SECTION_PROPS;
  }

  template() {
    return `<div class="ids-toolbar-section">
      <slot></slot>
    </div>`;
  }
}

export default IdsToolbarSection;
