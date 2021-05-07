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
    return [props.VALUE, props.SELECTED];
  }

  /**
   * Create the Template for the contents
   * @returns {string} the template to render
   */
  template() {
    return (
      `<li
        class="ids-tab${this.selected ? ' selected ' : ''}"
        tabindex="0"
      >
        <ids-text
          overflow="ellipsis"
          size="22"
          color="unset"
          ${this.selected ? 'font-weight="bold"' : ''}
        >
          <slot></slot>
        </ids-text>
      </li>`
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

  connectedCallback() {
    this.setAttribute('role', 'tab');
    this.setAttribute('aria-selected', `${Boolean(this.selected)}`);
    this.setAttribute('tabindex', stringToBool(this.selected) ? '0' : '-1');
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
      this.setAttribute('tabindex', '-1');
    }

    if (isValueTruthy) {
      this.container.classList.add(props.SELECTED);
      this.setAttribute('selected', true);
      this.container?.children?.[0]?.setAttribute?.('font-weight', 'bold');
      this.setAttribute('tabindex', '0');
    }

    this.setAttribute('aria-selected', `${Boolean(this.selected)}`);
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
}

export default IdsTab;
