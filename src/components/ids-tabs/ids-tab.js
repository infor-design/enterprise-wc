import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import IdsText from '../ids-text/ids-text';
import { stringToBool, buildClassAttrib } from '../../utils/ids-string-utils/ids-string-utils';
import Base from './ids-tabs-base';
import styles from './ids-tab.scss';

// Import Mixins
import {
  IdsColorVariantMixin,
  IdsEventsMixin,
  IdsOrientationMixin,
} from '../../mixins';


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
<<<<<<< HEAD
export default class IdsTab extends Base {
  /** store the previous "selected" value to prevent double firing events */
  #prevSelected = false;

=======
class IdsTab extends mix(IdsElement).with(IdsColorVariantMixin, IdsEventsMixin, IdsOrientationMixin) {
>>>>>>> main
  constructor() {
    super();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array<string>} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.COUNT,
      attributes.SELECTED,
      attributes.VALUE
    ];
  }

  /**
   * Inherited from `IdsColorVariantMixin`
   * @returns {Array<string>} List of available color variants for this component
   */
  colorVariants = ['alternate'];

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
    super.connectedCallback?.();

    this.setAttribute('role', 'tab');
    this.setAttribute('aria-selected', `${Boolean(this.selected)}`);
    this.setAttribute('tabindex', stringToBool(this.selected) ? '0' : '-1');
    this.setAttribute('aria-label', this.#getReadableAriaLabel());
    this.selected = this.hasAttribute(attributes.SELECTED);

    this.#attachEventHandlers();
  }

  #attachEventHandlers() {
    this.onEvent('click', this, () => {
      if (!this.selected) {
        this.selected = true;
      }
      this.focus();
    });

    this.onEvent('focus', this, () => {
      this.focus();
    });
  }

  /**
   * @param {boolean} isSelected Whether or not this tab is selected.
   */
  set selected(isSelected) {
    const newValue = stringToBool(isSelected);
    if (!newValue) {
      this.removeAttribute(attributes.SELECTED);
      this.container.classList.remove('selected');
      this.container?.children?.[0]?.removeAttribute?.('font-weight');
      this.setAttribute('tabindex', '-1');
    } else {
      this.setAttribute(attributes.SELECTED, '');
      this.container?.children?.[0]?.setAttribute?.('font-weight', 'bold');
      this.container.classList.add('selected');
      this.setAttribute('tabindex', '0');

      // reqAnimFrame needed to fire for context to read reliably due to onEvent binding
      window.requestAnimationFrame(() => {
        this.triggerEvent('tabselect', this, { bubbles: true });
      });
    }
    this.setAttribute('aria-selected', `${newValue}`);
  }

  /**
   * @returns {boolean} isSelected Whether or not this tab is selected.
   */
  get selected() {
    return this.hasAttribute(attributes.SELECTED);
  }

  /** @param {string} value The value which becomes selected by ids-tabs component */
  set value(value) {
    if (value !== this.getAttribute(attributes.VALUE)) {
      this.setAttribute(attributes.VALUE, value);
    }

    this.triggerEvent('tabvaluechange', this, {
      bubbles: true,
      detail: { value: `${value}` }
    });
  }

  /** @returns {string} value The value which becomes selected by ids-tabs component */
  get value() {
    return this.getAttribute(attributes.VALUE);
  }

  /** @returns {string} value The number of items represented in the tab (may or may not apply) */
  get count() {
    return this.getAttribute(attributes.COUNT);
  }

  /**
   * @param {string} value The number of items represented in the tab (may or may not apply)
   */
  set count(value) {
    if (value === '') {
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
   * sets aria readable label by
   * grabbing all ids-text nodes in order
   * they appear in the DOM
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

    if (slotNode && idsText) {
      idsText.container.setAttribute('data-text', `"${slotNode.textContent}"`);
    }
  }

  focus() {
    this.container.focus();
  }
}
