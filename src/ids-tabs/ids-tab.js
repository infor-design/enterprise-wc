import {
  IdsElement,
  customElement,
  props,
  scss,
  mix
} from '../ids-base/ids-element';
import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import IdsText from '../ids-text/ids-text';
import styles from './ids-tabs.scss';

/**
 * IDS Tab Component
 *
 * @type {IdsTab}
 * @inherits IdsElement
 */
@customElement('ids-tab')
@scss(styles)
class IdsTab extends mix(IdsElement).with(IdsEventsMixin) {
  constructor() {
    super();
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return [props.VALUE];
  }

  /**
   * Create the Template for the contents
   * @returns {string} the template to render
   */
  template() {
    return (
      `<div class="ids-tab">
        <ids-text
          overflow="ellipsis"
          size=18
          color="unset"
        >
          <slot></slot>
        </ids-text>
      </div>`
    );
  }

  /**
   * Binds associated callbacks and cleans
   * old handlers when template refreshes
   */
  rendered = () => {
    /* istanbul ignore next */
    if (!this.shouldUpdateCallbacks) {
      return;
    }

    // stop observing changes before updating DOM
    this.stepObserver.disconnect();
    this.resizeObserver.disconnect();

    // set up observer for resize which prevents overlapping labels
    this.resizeObserver.observe(this.container);

    // set up observer for monitoring if a child element changed
    this.stepObserver.observe(this, {
      childList: true,
      attributes: true,
      subtree: true
    });

    this.shouldUpdateCallbacks = false;
  };

  /**
   * Set the orientation of how tabs will be laid out
   * @param {'horizontal' | 'vertical'} value orientation
   */
  set orientation(value) {
    switch (value) {
    case 'vertical': {
      this.setAttribute('orientation', 'vertical');
      break;
    }
    case 'horizontal':
    default: {
      this.setAttribute('orientation', 'horizontal');
      break;
    }
    }
  }
}

export default IdsTab;
