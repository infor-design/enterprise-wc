import { customElement, scss } from '../../core/ids-decorators';

import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsKeyboardMixin from '../../mixins/ids-keyboard-mixin/ids-keyboard-mixin';
import IdsElement from '../../core/ids-element';

import styles from './ids-segmented-control.scss';

const Base = IdsKeyboardMixin(
  IdsLocaleMixin(
    IdsEventsMixin(
      IdsElement
    )
  )
);

@customElement('ids-segmented-control')
@scss(styles)
export default class IdsSegementedControl extends Base {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    this.#addSegmentedClass();
    this.#attachEventHandlers();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#detachEventHandlers();
  }

  template(): string {
    return `<div class="ids-segmented-control" part="container">
      <slot></slot>
    </div>`;
  }

  /**
   * Adds the '.ids-toggle-button-segmented' class to each ids-toggle-button.
   */
  #addSegmentedClass() {
    const buttons = this.querySelectorAll('ids-toggle-button');
    buttons.forEach((button: any) => {
      button.classList.add('ids-toggle-button-segmented');
    });
  }

  /**
   * Attaches event handlers for managing the toggle button states.
   */
  #attachEventHandlers() {
    this.onEvent('click', this.container, (event: Event) => this.handleToggleClick(event));
  }

  /**
   * Get the toggle buttons
   * @returns {HTMLElement} the toggle buttons
   */
  get toggleButtons() {
    return this.querySelectorAll('ids-toggle-button');
  }

  /**
   * Handles the toggle button click event.
   * @param {Event} event the click event
   */
  handleToggleClick(event: Event) {
    const target = event.target as HTMLElement;
    if (target.tagName.toLowerCase() === 'ids-toggle-button') {
      this.updateToggleState(target);
    }
  }

  /**
   * Updates the state of the toggle buttons, activating the clicked one and resetting others.
   * @param {HTMLElement} clickedButton the button that was clicked
   */
  updateToggleState(clickedButton: HTMLElement) {
    const buttons = this.toggleButtons;
    buttons.forEach((button: HTMLElement | any) => {
      if (button === clickedButton) {
        button.pressed = true;
      } else {
        button.pressed = false;
      }
    });
  }

  /**
   * Remove event handlers
   */
  #detachEventHandlers() {
    this.offEvent('click', this.container);
  }
}
