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
    this.#attachEventHandlers();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#detachEventHandlers();
  }

  template(): string {
    return `<div class="ids-segmented-control">
      <slot></slot>
    </div>`;
  }

  /**
   * Attaches event handlers for managing the toggle button states.
   */
  #attachEventHandlers(): void {
    this.onEvent('click', this.container, (event: Event) => this.handleToggleClick(event));
  }

  /**
   * Handles the toggle button click event.
   * @param {Event} event the click event
   */
  handleToggleClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (target.tagName.toLowerCase() === 'ids-toggle-button') {
      this.updateToggleState(target);
    }
  }

  /**
   * Updates the state of the toggle buttons, activating the clicked one and resetting others.
   * @param {HTMLElement} clickedButton the button that was clicked
   */
  updateToggleState(clickedButton: HTMLElement): void {
    const buttons = this.querySelectorAll('ids-toggle-button');
    buttons.forEach((button: any) => {
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
  #detachEventHandlers(): void {
    this.offEvent('click', this.container);
  }
}
