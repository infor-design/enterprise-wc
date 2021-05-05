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

const highlighterHtml = `<div class="highlighter"></div>`;
const highlighterTemplate = document.createElement('template');
highlighterTemplate.innerHTML = highlighterHtml;

/**
 * IDS Tab Component
 *
 * @type {IdsTab}
 * @inherits IdsElement
 */
@customElement('ids-tab')
@scss(styles)
class IdsTab extends mix(IdsElement).with(IdsEventsMixin) {
  id;

  constructor() {
    super();

    this.rendered = this.rendered.bind(this);
    this.setTextContentForBoldFix = this.setTextContentForBoldFix.bind(this);
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return [props.VALUE, props.SELECTED, props.TAB_ID];
  }

  /**
   * Create the Template for the contents
   * @returns {string} the template to render
   */
  template() {
    return (
      `<button
        class="ids-tab${this.selected ? ' selected ' : ''}"
        role="tab"
        aria-selected="${Boolean(this.selected)}"
        tabindex="${this.selected ? '0' : '-1'}"
        id=${this.getAttribute(props.TAB_ID)}
      >
        <ids-text
          overflow="ellipsis"
          size="22"
          color="unset"
          ${this.selected ? 'font-weight="bold"' : ''}
        >
          <slot></slot>
        </ids-text>
        ${this.selected ? highlighterHtml : ''}
      </button>`
    );
  }

  /**
   * Refresh component's bindings
   * after a render
   */
  rendered() {
    this.offEvent('slotchange');

    // When any of this item's slots change,
    // refresh the text content so that
    // ids-text::part(text):after can access
    // this for bold sizing fix

    this.onEvent('slotchange', this.container, () => {
      this.setTextContentForBoldFix();
    });

    this.setTextContentForBoldFix();
  }

  /**
   * @param {string} value value which becomes selected by tabs component
   */
  set selected(value) {
    const isValueTruthy = stringToBool(value);

    if (!isValueTruthy) {
      this.container.classList.remove(props.SELECTED);
      this.removeAttribute('selected');
      this.container?.children?.[0]?.removeAttribute?.('font-weight');

      // remove highlighter
      if (this.container?.children?.[1]) {
        this.container.removeChild(this.container.children[1]);
      }
    }

    if (isValueTruthy) {
      this.container.classList.add(props.SELECTED);
      this.setAttribute('selected', true);
      this.container?.children?.[0]?.setAttribute?.('font-weight', 'bold');

      // append highlighter
      if (!this.container?.children?.[1]) {
        this.container.appendChild(highlighterTemplate.content.cloneNode(true));
      }
    }

    this.container.setAttribute?.('tabindex', isValueTruthy ? '0' : '-1');
    this.container.setAttribute?.('aria-selected', isValueTruthy);
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

  /**
   * sets the CSS var "text-content" to track text
   * for fixing the shudder when content is selected/
   * bold text is set. Used by ids-text::part(text):after
   */
  setTextContentForBoldFix = () => {
    const slot = this.shadowRoot.querySelector('slot');

    if (slot?.assignedNodes?.()?.[0]) {
      const textContent = slot?.assignedNodes?.()?.[0].textContent;
      this.container.style.setProperty('--text-content', `"${textContent}"`);
    }
  };

  focus() {
    this.container.focus();
  }

  set tabId(value) {
    this.setAttribute(props.TAB_ID, value);
    this.container.id = this.getAttribute(props.TAB_ID);
  }

  get tabId() {
    return this.getAttribute(props.TAB_ID);
  }
}

export default IdsTab;
