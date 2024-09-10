import { attributes } from '../../core/ids-attributes';
import { customElement, scss } from '../../core/ids-decorators';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsKeyboardMixin from '../../mixins/ids-keyboard-mixin/ids-keyboard-mixin';
import IdsHeader from '../ids-header/ids-header';

import '../ids-toolbar/ids-toolbar';
import '../ids-popup-menu/ids-popup-menu';
import '../ids-menu/ids-menu';
import '../ids-menu/ids-menu-group';
import '../ids-menu/ids-menu-item';
import '../ids-menu-button/ids-menu-button';

import styles from './ids-masthead.scss';
import type IdsToolbarSection from '../ids-toolbar/ids-toolbar-section';
import type IdsToolbarMoreActions from '../ids-toolbar/ids-toolbar-more-actions';
import type IdsButton from '../ids-button/ids-button';
import type IdsMenuButton from '../ids-menu-button/ids-menu-button';

const Base = IdsKeyboardMixin(
  IdsEventsMixin(
    IdsHeader
  )
);

/**
 * IDS Masthead Component
 * @type {IdsMasthead}
 * @inherits IdsHeader
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 */
@customElement('ids-masthead')
@scss(styles)
export default class IdsMasthead extends Base {
  constructor() {
    super();
  }

  /**
   * Get a list of element dependencies for this component
   * @returns {object} of elements
   */
  get elements() {
    return {
      logo: this.container?.querySelector('#logo-wrapper'),
      title: this.container?.querySelector('#title'),
      sections: {
        start: this.container?.querySelector<IdsToolbarSection>('ids-toolbar-section#start'),
        center: this.container?.querySelector<IdsToolbarSection>('ids-toolbar-section#center'),
        end: this.container?.querySelector<IdsToolbarSection>('ids-toolbar-section#end'),
        more: this.container?.querySelector<IdsToolbarMoreActions>('ids-toolbar-more-actions#more'),
      },
    };
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.ICON,
      attributes.TITLE,
    ];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template(): string {
    return `
      <slot></slot>
    `;
  }

  /**
   * Invoked each time the custom element is appended into a document-connected element.
   */
  connectedCallback() {
    super.connectedCallback();
    this.#restyleButtons();
  }

  /**
   * Helper method to give nested buttons transparent backgrounds
   * @private
   * @returns {void}
   */
  #restyleButtons() {
    const { sections } = this.elements;

    const buttons = [
      sections.more?.button,
      ...this.querySelectorAll<IdsButton | IdsMenuButton>('ids-button, ids-menu-button'),
    ];

    buttons.forEach((button) => {
      if (button) {
        button.colorVariant = 'alternate';
        button.iconAlign = 'start';
        button.type = 'button';
        button.classList.add('ids-button-masthead');

        const buttonParentSlot = button.closest('[slot]');
        const buttonText = button.querySelector<HTMLElement>('span, ids-text');
        const hasAudible = buttonText?.classList.contains('audible');
        const hasAudibleOff = buttonText?.classList.contains('audible-off');

        if (hasAudible) {
          if (buttonParentSlot?.slot === 'more') {
            buttonText?.classList.remove('audible');
            buttonText?.classList.add('audible-off');
            buttonText?.style.setProperty('padding', '0 4px');
          }
        }
        if (hasAudibleOff) {
          if (buttonParentSlot?.slot !== 'more') {
            buttonText?.classList.remove('audible-off');
            buttonText?.classList.add('audible');
            buttonText?.style.setProperty('padding', '');
          }
        }
      }
    });
  }
}
