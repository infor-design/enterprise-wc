import {
  IdsElement,
  customElement,
  props,
  scss,
  mix
} from '../ids-base/ids-element';
import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import { stringToBool, buildClassAttrib } from '../ids-base/ids-string-utils';
import IdsText from '../ids-text/ids-text';
import styles from './ids-tab.scss';

/**
 * IDS Tab Component
 *
 * @type {IdsTab}
 * @inherits IdsElement
 * @part container - the tab container itself
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
    return [props.VALUE, props.SELECTED, props.ORIENTATION, props.COUNT];
  }

  /**
   * Create the Template for the contents
   * @returns {string} the template to render
   */
  template() {
    const innerContent = this.hasAttribute('count') ? /* TODO */(
      `
      <ids-text
        overflow="ellipsis"
        size="22"
        color="unset"
        ${this.selected ? 'font-weight="bold"' : ''}
      >
      </ids-text>
      <ids-text
        overflow="ellipsis"
        size="22"
        color="unset"
        ${this.selected ? 'font-weight="bold"' : ''}
      >
        <slot></slot>
      </ids-text>`
    ) : (
      `<ids-text
      overflow="ellipsis"
      size="22"
      color="unset"
      ${this.selected ? 'font-weight="bold"' : ''}
    >
      <slot></slot>
    </ids-text>`
    );

    return (
      `<div ${
        buildClassAttrib(
          'ids-tab',
          this.selected,
          this.orientation,
          this.count
        ) }
        tabindex="0"
        part="container"
      >${innerContent}
      </div>`
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
   * @param {string} value the count
   */
  set count(value) {
    if (value === '') {
      this.removeAttribute(props.COUNT);
      this.container.classList.remove('count');
      return;
    }

    if (Number.isNaN(Number(value))) {
      this.removeAttribute(props.COUNT);
      throw new Error('ids-tab: invalid number supplied to "count" property');
    }

    this.setAttribute(props.COUNT, value);
  }

  /**
   * Set the orientation of how tabs will be laid out
   * @param {'horizontal' | 'vertical'} value orientation
   */
  set orientation(value) {
    switch (value) {
    case 'vertical': {
      this.setAttribute(props.ORIENTATION, 'vertical');
      this.container.classList.add('vertical');
      break;
    }
    case 'horizontal':
    default: {
      this.setAttribute(props.ORIENTATION, 'horizontal');
      this.container.classList.remove('vertical');
      break;
    }
    }
  }

  get orientation() {
    return this.getAttribute(props.ORIENTATION);
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
