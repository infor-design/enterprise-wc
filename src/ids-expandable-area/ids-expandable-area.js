import {
  IdsElement,
  customElement,
  mixin,
  scss
} from '../ids-base/ids-element';
import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import { IdsKeyboardMixin } from '../ids-base/ids-keyboard-mixin';
import { IdsExampleMixin } from '../ids-base/ids-example-mixin';
import styles from './ids-expandable-area.scss';
import { props } from '../ids-base/ids-constants';

/**
 * IDS Tag Component
 */
@customElement('ids-expandable-area')
@scss(styles)
@mixin(IdsEventsMixin)
@mixin(IdsExampleMixin)
class IdsExpandableArea extends IdsElement {
  constructor() {
    super();
    this.state = {};
    this.expander = this.shadowRoot.querySelector('.ids-expandable-area-expander');
    this.pane = this.shadowRoot.querySelector('.ids-expandable-area-pane');
    this.setAttribute('role', 'region');
    this.switchState();
    this.handleEvents();
  }

  connectedCallBack() {}

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return [
      props.OPEN
    ];
  }

  /**
   * Inner template contents
   * @private
   * @returns {string} The template
   */
  template() {
    return `
      <div class="ids-expandable-area">
        <slot name="header"></slot>
        <div class="ids-expandable-area-pane" hidden>
          <slot name="pane"></slot>
        </div>
        <a class="ids-expandable-area-expander" href="#0" role="button" aria-expanded="false">
          <slot name="expander"></slot>
        </a>
      </div>
    `;
  }

  static get observedAttributes() {
    return [props.OPEN]
  }

  attributeChangedCallback(name) {
    if (name === props.OPEN) {
      this.switchState();
    }
  }

  switchState() {
    this.state.expanded = this.getAttribute(props.OPEN) === 'true' || false;
    this.expander.setAttribute('aria-expanded', this.state.expanded);
    this.pane.hidden = !this.state.expanded;
  }

  handleEvents() {
    this.eventHandlers.addEventListener('click', this.expander, (e) => {
      this.setAttribute(props.OPEN, this.getAttribute(props.OPEN) === 'true' ? 'false' : 'true')
    });
  }
}

export default IdsExpandableArea;
