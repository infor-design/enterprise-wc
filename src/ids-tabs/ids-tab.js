import {
  IdsElement,
  customElement,
  props,
  scss,
  mix
} from '../ids-base/ids-element';
import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import { stringToBool } from '../ids-base/ids-string-utils';
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
    return [props.VALUE, props.SELECTED];
  }

  /**
   * Create the Template for the contents
   * @returns {string} the template to render
   */
  template() {
    return (
      `<div class="ids-tab" role="tab" tabindex="0">
        <ids-text
          overflow="ellipsis"
          size="22"
          color="unset"
        >
          <slot></slot>
        </ids-text>
      </div>`
    );
  }

  /**
   * @param {string} value value which becomes selected by tabs component
   */
  set selected(value) {
    console.log('selected ->', value);
    this.setAttribute(props.SELECTED, stringToBool(value));

    if (!value) {
      this.container.classList.remove('selected');
    }

    if (value && !this.container.classList.contains('selected')) {
      this.container.classList.add('selected');
    }

    this.render();
  }

  get selected() {
    return this.getAttribute(props.SELECTED);
  }

  /**
   * @param {string} value value which becomes selected by tabs component
   */
  set value(value) {
    this.setAttribute(props.VALUE, value);
  }

  get value() {
    return this.getAttribute(props.VALUE);
  }
}

export default IdsTab;
