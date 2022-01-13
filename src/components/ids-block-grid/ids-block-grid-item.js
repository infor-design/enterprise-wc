import IdsCheckbox from '../ids-checkbox/ids-checkbox';
import { customElement, scss } from '../../core/ids-decorators';
import Base from './ids-block-grid-item-base';
import styles from './ids-block-grid-item.scss';
import { attributes } from '../../core/ids-attributes';

/**
 * IDS Block Grid Item Component
 * @type {IdsBlockgridItem}
 * @mixes IdsKeyboardMixin
 * @mixes IdsSelectionMixin
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @inherits IdsElement
 */
@customElement('ids-block-grid-item')
@scss(styles)
export default class IdsBlockgridItem extends Base {
  constructor() {
    super();
    this.state = {
      checkboxHasFocus: false,
    };
  }

  connectedCallback() {
    this
      .#handleEvents()
      .#attachKeyboardListeners();
    super.connectedCallback();
  }

  template() {
    return `
      <div class="ids-block-grid-item-container" tabindex="0">
        <div class="ids-block-grid-item-checkbox">
          <ids-checkbox></ids-checkbox>
        </div>
        <slot></slot>
      </div>
    `;
  }

  /**
   * Establish Internal Event Handlers
   * @private
   * @returns {object} The object for chaining.
   */
  #handleEvents() {
    this.onEvent('click', this, this.#handleSelectionChange);

    if (this.selection === 'multiple' || this.selection === 'mixed') {
      const idsCheckboxElem = this.container.querySelector('ids-checkbox');
      idsCheckboxElem.onEvent('click', idsCheckboxElem, (e) => {
        e.stopPropagation();
        e.preventDefault();
        this.#handleMultiMixedSelectionChange(e);
      });
    }

    return this;
  }

  /**
   * Establish Internal Keyboard shortcuts
   * @private
   * @returns {object} This API object for chaining
   */
  #attachKeyboardListeners() {
    this.listen(['Tab'], this, (e) => {
      if (!this.checkboxHasFocus && this.selection === 'mixed') {
        e.preventDefault();
        e.stopPropagation();
        this.checkboxHasFocus = true;
        this.container.querySelector('ids-checkbox').container.classList.add('has-focus');
      } else {
        if (this.nextElementSibling) {
          e.preventDefault();
          e.stopPropagation();
          this.nextElementSibling.container.focus();
        }

        this.checkboxHasFocus = false;
        this.container.querySelector('ids-checkbox').container.classList.remove('has-focus');
      }
    });

    this.listen([' '], this, () => {
      if (this.checkboxHasFocus && this.selection === 'mixed') {
        this.container.querySelector('ids-checkbox').dispatchEvent(new Event('click'));
      } else {
        this.dispatchEvent(new Event('click'));
      }
    });

    return this;
  }

  /**
   * Handle single/multiple selection change
   * @private
   * @param  {object} e Actual event
   */
  #handleSelectionChange(e) {
    this.container.focus();
    if (this.selection === 'single') {
      this.#handleSingleSelectionChange(e);
    } else if (this.selection === 'multiple') {
      this.#handleMultiMixedSelectionChange(e);
    } else {
      this.#handlePreSelectionChange();
    }
  }

  /**
   * Change single selection for block item
   * @private
   * @param  {object} e Actual event
   */
  #handleSingleSelectionChange(e) {
    if (this.selected === 'true') {
      this.setAttribute(attributes.SELECTED, false);
      this.container.querySelector('ids-checkbox').setAttribute(attributes.CHECKED, false);
    } else {
      const blockElements = this.parentElement.querySelectorAll('ids-block-grid-item[selection="single"]');
      [...blockElements].forEach((elem) => {
        elem.container.querySelector('ids-checkbox').setAttribute(attributes.CHECKED, false);
        elem.setAttribute(attributes.SELECTED, false);
      });
      this.setAttribute(attributes.SELECTED, true);
      this.container.querySelector('ids-checkbox').setAttribute(attributes.CHECKED, true);
    }

    this.triggerEvent('selectionchanged', this, {
      detail: {
        elem: this,
        nativeEvent: e,
        selected: this.selected,
        selection: this.selection,
      }
    });
  }

  /**
   * Change multiple selection for block item
   * @private
   * @param  {object} e Actual event
   */
  #handleMultiMixedSelectionChange(e) {
    this.container.querySelector('ids-checkbox').setAttribute(attributes.CHECKED, this.selected !== 'true');
    this.setAttribute(attributes.SELECTED, this.selected !== 'true');

    this.triggerEvent('selectionchanged', this, {
      detail: {
        elem: this,
        nativeEvent: e,
        selected: this.selected,
        selection: this.selection,
      }
    });
  }

  /**
   * Change single selection for block item
   * @private
   */
  #handlePreSelectionChange() {
    if (this.preSelected === 'true') {
      this.setAttribute(attributes.PRE_SELECTED, false);
    } else {
      const blockElements = this.parentElement.querySelectorAll('ids-block-grid-item[selection="mixed"]');
      [...blockElements].forEach((elem) => {
        elem.setAttribute(attributes.PRE_SELECTED, false);
      });
      this.setAttribute(attributes.PRE_SELECTED, true);
    }
  }
}
