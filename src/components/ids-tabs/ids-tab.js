import {
  IdsElement,
  customElement,
  attributes,
  scss,
  mix,
} from '../../core/ids-element';

// Import Mixins
import { IdsEventsMixin } from '../../mixins';

// Import Dependencies
import IdsText from '../ids-text';

// Import Styles
import styles from './ids-tab.scss';

// Import Utils
import { IdsStringUtils } from '../../utils';

const { stringToBool, buildClassAttrib } = IdsStringUtils;

/**
 * IDS Tab Component
 * @type {IdsTab}
 * @inherits IdsElement
 * @part container - the tab container itself
 * @mixes IdsEventsMixin
 * @private
 */
@customElement('ids-tab')
@scss(styles)
class IdsTab extends mix(IdsElement).with(IdsEventsMixin) {
  constructor() {
    super();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      attributes.COUNT,
      attributes.ORIENTATION,
      attributes.SELECTED,
      attributes.VALUE
    ];
  }

  /**
   * Create the Template for the contents
   * @returns {string} the template to render
   */
  template() {
    const innerContent = this.hasAttribute('count') ? (
      `<ids-text
        overflow="ellipsis"
        font-size="28"
        color="unset"
        ${this.selected ? 'font-weight="bold"' : ''}
      >${this.getAttribute(attributes.COUNT)}
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
        tabindex="-1"
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
      this.#setDataTextForBoldFix();
      this.setAttribute('aria-label', this.#getReadableAriaLabel());
    });

    this.#setDataTextForBoldFix();
  }

  connectedCallback() {
    this.setAttribute('role', 'tab');
    this.setAttribute('aria-selected', `${Boolean(this.selected)}`);
    this.setAttribute('tabindex', stringToBool(this.selected) ? '0' : '-1');

    this.setAttribute('aria-label', this.#getReadableAriaLabel());
    this.onEvent('click', this, () => {
      // @TODO
    });
  }

  /**
   * @param {string} isSelected value which becomes selected by tabs component
   */
  set selected(isSelected) {
    const isValueTruthy = stringToBool(isSelected);

    /* istanbul ignore if */
    if (!isValueTruthy) {
      this.container.classList.remove(attributes.SELECTED);
      this.removeAttribute('selected');
      this.container?.children?.[0]?.removeAttribute?.('font-weight');
      this.setAttribute('tabindex', '-1');
    } else {
      this.container.classList.add(attributes.SELECTED);
      this.setAttribute('selected', true);
      this.container?.children?.[0]?.setAttribute?.('font-weight', 'bold');
      this.setAttribute('tabindex', '0');
    }

    this.setAttribute('aria-selected', `${Boolean(this.selected)}`);
  }

  get selected() {
    return this.getAttribute(attributes.SELECTED);
  }

  /**
   * @param {string} value value which becomes selected by tabs component
   */
  set value(value) {
    /* istanbul ignore next */
    if (value !== this.getAttribute(attributes.VALUE)) {
      /* istanbul ignore next */
      this.setAttribute(attributes.VALUE, value);
    }
  }

  get value() {
    return this.getAttribute(attributes.VALUE);
  }

  get count() {
    return this.getAttribute(attributes.COUNT);
  }

  /**
   * @param {string} value the count
   */
  set count(value) {
    if (value === '') {
      /* istanbul ignore else */
      if (this.hasAttribute(attributes.COUNT)) {
        this.removeAttribute(attributes.COUNT);
      }
      this.container.classList.remove('count');
      return;
    }

    if (Number.isNaN(Number(value))) {
      return;
    }

    this.container.classList.add('count');

    if (this.getAttribute(attributes.COUNT) !== value) {
      this.setAttribute(attributes.COUNT, value);
    }
  }

  /**
   * Set the orientation of how tabs will be laid out
   * @param {'horizontal' | 'vertical'} value orientation
   */
  set orientation(value) {
    switch (value) {
    case 'vertical': {
      this.setAttribute(attributes.ORIENTATION, 'vertical');
      this.container.classList.add('vertical');
      break;
    }
    case 'horizontal':
    default: {
      this.setAttribute(attributes.ORIENTATION, 'horizontal');
      this.container.classList.remove('vertical');
      break;
    }
    }
  }

  get orientation() {
    return this.getAttribute(attributes.ORIENTATION);
  }

  /**
   * sets aria readable label by
   * grabbing all ids-text nodes in order
   * they appear in the DOM
   *
   * @returns {string} aria-label content
   */
  #getReadableAriaLabel() {
    const idsTextEls = [...this.container?.querySelectorAll('ids-text')];

    return idsTextEls.map((textEl) => {
      const slotNode = textEl.querySelector('slot')?.assignedNodes?.()?.[0];
      return slotNode?.textContent || textEl.textContent;
    }).join(' ');
  }

  /**
   * Sets the data-text of nested ids-text to it's slot
   * text content. Fixes issue with bold moving around
   * when we edit content.
   */
  #setDataTextForBoldFix = () => {
    const idsText = this.container?.querySelector('ids-text');
    const slotNode = idsText.querySelector('slot')?.assignedNodes?.()?.[0];

    if (slotNode) {
      idsText.container.setAttribute('data-text', `"${slotNode.textContent}"`);
    }
  };

  /* istanbul ignore next */
  focus() {
    this.container.focus();
  }
}

export default IdsTab;
