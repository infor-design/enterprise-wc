import { customElement, scss } from '../../core/ids-decorators';
import { attributes, htmlAttributes } from '../../core/ids-attributes';
import { stringToBool, buildClassAttrib } from '../../utils/ids-string-utils/ids-string-utils';

import Base from './ids-tab-base';
import '../ids-text/ids-text';

import styles from './ids-tab.scss';

type IdsTabOnActionCallback = (isSelected: boolean) => void;

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
export default class IdsTab extends Base {
  /**
   * @param {IdsTabOnActionCallback} onAction a user-defined callback function that can be applied to a Tab
   */
  onAction?: IdsTabOnActionCallback;

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
      attributes.ACTIONABLE,
      attributes.COUNT,
      attributes.DISABLED,
      attributes.SELECTED,
      attributes.VALUE
    ];
  }

  /**
   * Inherited from `IdsColorVariantMixin`
   * @returns {Array<string>} List of available color variants for this component
   */
  colorVariants = ['alternate', 'module'];

  /**
   * Create the Template for the contents
   * @returns {string} the template to render
   */
  template(): string {
    const hasIcon = this.querySelector('ids-icon');
    const hasCount = this.hasAttribute(attributes.COUNT);
    const cssClassAttr = buildClassAttrib(
      'ids-tab',
      this.selected,
      this.orientation,
      this.count
    );
    const selectedAttr = this.selected ? ' font-weight="bold"' : '';

    let innerContent = '<slot></slot>';
    if (!hasIcon && !hasCount) {
      innerContent = `<ids-text overflow="ellipsis" size="22"${selectedAttr}>
        <slot></slot>
      </ids-text>`;
    } else if (hasCount) {
      innerContent = `<ids-text overflow="ellipsis" font-size="28"${selectedAttr}>
        ${this.getAttribute(attributes.COUNT)}
      </ids-text>
      <ids-text overflow="ellipsis" size="22">
        <slot></slot>
      </ids-text>`;
    }

    return `<div ${cssClassAttr} tabindex="-1" part="container">${innerContent}</div>`;
  }

  connectedCallback() {
    super.connectedCallback?.();

    this.setAttribute(htmlAttributes.ROLE, 'tab');
    this.setAttribute(htmlAttributes.ARIA_SELECTED, `${Boolean(this.selected)}`);
    this.setAttribute(htmlAttributes.TABINDEX, stringToBool(this.selected) ? '0' : '-1');
    this.setAttribute(htmlAttributes.ARIA_LABEL, this.#getReadableAriaLabel());
  }

  /**
   * Refresh component's bindings after render
   */
  rendered() {
    this.offEvent('slotchange');

    // When any of this item's slots change,
    // refresh the text content so that
    // ids-text::part(text):after can access
    // this for bold sizing fix

    this.onEvent('slotchange', this.container, () => {
      this.#setDataTextForBoldFix();
      this.setAttribute(htmlAttributes.ARIA_LABEL, this.#getReadableAriaLabel());
    });

    this.#setDataTextForBoldFix();
    this.selected = this.hasAttribute(attributes.SELECTED);
  }

  /**
   * @param {boolean} isActionable true if this Tab should be displayed as an "action" (small, low padding, no flex)
   */
  set actionable(isActionable: boolean | string) {
    if (stringToBool(isActionable)) {
      this.setAttribute(attributes.ACTIONABLE, '');
      this.container.classList.add(attributes.ACTIONABLE);
    } else {
      this.removeAttribute(attributes.ACTIONABLE);
      this.container.classList.remove(attributes.ACTIONABLE);
    }
  }

  /**
   * @returns {boolean} true if this Tab should be displayed as an "action"
   */
  get actionable(): boolean {
    return this.hasAttribute(attributes.ACTIONABLE);
  }

  /**
   * @param {boolean | string} isDisabled true if the tab should become disabled
   */
  set disabled(isDisabled: boolean | string) {
    const newValue = stringToBool(isDisabled);
    if (newValue) {
      this.setAttribute(attributes.DISABLED, '');
      this.container.classList.add(attributes.DISABLED);
    } else {
      this.removeAttribute(attributes.DISABLED);
      this.container.classList.remove(attributes.DISABLED);
    }
  }

  /**
   * @returns {boolean} true if this tab is disabled
   */
  get disabled(): boolean {
    return this.hasAttribute(attributes.DISABLED);
  }

  /**
   * @param {boolean} isSelected Whether or not this tab is selected.
   */
  set selected(isSelected: boolean) {
    const currentValue = this.selected;
    const newValue = stringToBool(isSelected);
    if (currentValue !== newValue) {
      if (!newValue) {
        this.removeAttribute(attributes.SELECTED);
        this.container.classList.remove(attributes.SELECTED);
        this.container?.children?.[0]?.removeAttribute?.(attributes.FONT_WEIGHT);
        this.setAttribute(htmlAttributes.TABINDEX, '-1');
        this.container.setAttribute(htmlAttributes.TABINDEX, '-1');
      } else {
        this.setAttribute(attributes.SELECTED, '');
        this.container?.children?.[0]?.setAttribute?.(attributes.FONT_WEIGHT, 'bold');
        this.container.classList.add(attributes.SELECTED);
        this.setAttribute(htmlAttributes.TABINDEX, '0');
        this.container.setAttribute(htmlAttributes.TABINDEX, '0');
        this.#select(newValue);
      }
      this.setAttribute(htmlAttributes.ARIA_SELECTED, `${newValue}`);
    }
  }

  /**
   * @returns {boolean} isSelected Whether or not this tab is selected.
   */
  get selected(): boolean {
    return this.hasAttribute(attributes.SELECTED);
  }

  /**
   * Triggers the `tabselect` event
   * @param {boolean} isSelected true if the tab has been selected
   */
  #select(isSelected: boolean): void {
    if (this.actionable) return;
    this.triggerEvent('tabselect', this, {
      bubbles: true,
      detail: {
        selected: isSelected
      }
    });
  }

  /** @param {string} value The value which becomes selected by ids-tabs component */
  set value(value: string) {
    if (value !== this.getAttribute(attributes.VALUE)) {
      this.setAttribute(attributes.VALUE, value);
    }
    this.#valueChange(value);
  }

  /** @returns {string} value The value which becomes selected by ids-tabs component */
  get value(): string {
    return this.getAttribute(attributes.VALUE);
  }

  /**
   * @param {string} value The value which becomes selected by ids-tabs component
   */
  #valueChange(value: string) {
    this.triggerEvent('tabvaluechange', this, {
      bubbles: true,
      detail: { value: `${value}` }
    });
  }

  /** @returns {string} value The number of items represented in the tab (may or may not apply) */
  get count(): string {
    return this.getAttribute(attributes.COUNT);
  }

  /**
   * @param {string} value The number of items represented in the tab (may or may not apply)
   */
  set count(value: string) {
    if (value === '') {
      if (this.hasAttribute(attributes.COUNT)) {
        this.removeAttribute(attributes.COUNT);
      }
      this.container.classList.remove(attributes.COUNT);
      return;
    }

    if (Number.isNaN(Number(value))) {
      return;
    }

    this.container.classList.add(attributes.COUNT);

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
  #getReadableAriaLabel(): string {
    // eslint-disable-next-line no-unsafe-optional-chaining
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
    const slotNode = idsText?.querySelector('slot')?.assignedNodes?.()?.[0];

    if (slotNode && idsText) {
      idsText.container.setAttribute('data-text', `"${slotNode.textContent.trim()}"`);
    }
  };

  focus() {
    if (!this.disabled) {
      this.container.focus();
    }
  }
}
