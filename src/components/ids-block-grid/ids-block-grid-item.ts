import '../ids-checkbox/ids-checkbox';
import { customElement, scss } from '../../core/ids-decorators';
import IdsElement from '../../core/ids-element';
import IdsThemeMixin from '../../mixins/ids-theme-mixin/ids-theme-mixin';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsSelectionMixin from '../../mixins/ids-selection-mixin/ids-selection-mixin';
import IdsKeyboardMixin from '../../mixins/ids-keyboard-mixin/ids-keyboard-mixin';

import styles from './ids-block-grid-item.scss';
import { attributes } from '../../core/ids-attributes';
import type IdsCard from '../ids-card/ids-card';
import type IdsHyperlink from '../ids-hyperlink/ids-hyperlink';
import type IdsCheckbox from '../ids-checkbox/ids-checkbox';

const Base = IdsKeyboardMixin(
  IdsThemeMixin(
    IdsEventsMixin(
      IdsSelectionMixin(
        IdsElement
      )
    )
  )
);

/**
 * IDS Block Grid Item Component
 * @type {IdsBlockgridItem}
 * @mixes IdsKeyboardMixin
 * @mixes IdsSelectionMixin
 * @mixes IdsEventsMixin
 * @inherits IdsElement
 */
@customElement('ids-block-grid-item')
@scss(styles)
export default class IdsBlockgridItem extends Base {
  checkboxHasFocus = false;

  constructor(settings: any = {}) {
    super();
    this.state = {
      checkboxHasFocus: false,
    };

    if (settings.selection) {
      this.selection = settings.selection;
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this
      .#handleEvents()
      .#attachKeyboardListeners();
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

    const checkbox = this.container?.querySelector<IdsCheckbox>('ids-checkbox');
    this.onEvent('click.checkbox', checkbox, (e: any) => {
      e.stopPropagation();
      e.preventDefault();

      if (this.selection === 'single') {
        this.#handleSingleSelectionChange(e);
      } else {
        this.#handleMultiMixedSelectionChange(e);
      }
    });

    this.onEvent('focus.blockitem', this, () => {
      this.querySelector<IdsCard>('ids-card')?.container?.querySelector<IdsHyperlink>('ids-hyperlink')?.container?.focus();
    });

    return this;
  }

  /**
   * Establish Internal Keyboard shortcuts
   * @private
   * @returns {object} This API object for chaining
   */
  #attachKeyboardListeners() {
    this.listen(['Tab'], this, (e: any) => {
      if (!this.checkboxHasFocus && this.selection === 'mixed') {
        e.preventDefault();
        e.stopPropagation();
        this.checkboxHasFocus = true;
        this.container?.querySelector<IdsCheckbox>('ids-checkbox')?.container?.classList.add('has-focus');
      } else {
        if (this.nextElementSibling && !e.shiftKey) {
          e.preventDefault();
          e.stopPropagation();
          (this.nextElementSibling as IdsBlockgridItem)?.container?.focus();
        } else if (this.previousElementSibling && e.shiftKey) {
          e.preventDefault();
          e.stopPropagation();
          (this.previousElementSibling as IdsBlockgridItem)?.container?.focus();
        }

        this.checkboxHasFocus = false;
        this.container?.querySelector<IdsCheckbox>('ids-checkbox')?.container?.classList.remove('has-focus');
      }
    });

    this.listen([' '], this, () => {
      if (this.checkboxHasFocus && this.selection === 'mixed') {
        this.container?.querySelector<IdsCheckbox>('ids-checkbox')?.dispatchEvent(new Event('click'));
      } else {
        this.dispatchEvent(new Event('click'));
      }
    });

    return this;
  }

  /**
   * Handle single/multiple selection change
   * @private
   * @param {object} e Actual event
   */
  #handleSelectionChange(e: any) {
    this.container?.focus();
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
   * @param {object} e Actual event
   */
  #handleSingleSelectionChange(e: any) {
    if (this.selected === 'true') {
      this.setAttribute(attributes.SELECTED, 'false');
      this.container?.querySelector<IdsCheckbox>('ids-checkbox')?.setAttribute(attributes.CHECKED, 'false');
    } else {
      const blockElements = this.parentElement?.querySelectorAll<IdsBlockgridItem>('ids-block-grid-item[selection="single"]');
      [...blockElements ?? []].forEach((elem) => {
        elem.container?.querySelector('ids-checkbox')?.setAttribute(attributes.CHECKED, 'false');
        elem.setAttribute(attributes.SELECTED, 'false');
      });
      this.setAttribute(attributes.SELECTED, 'true');
      this.container?.querySelector<IdsCheckbox>('ids-checkbox')?.setAttribute(attributes.CHECKED, 'true');
    }

    const eventData = {
      detail: {
        elem: this,
        nativeEvent: e,
        selected: this.selected,
        selection: this.selection,
      }
    };

    this.triggerEvent('selectionchanged', this, eventData);
  }

  /**
   * Change multiple selection for block item
   * @private
   * @param {object} e Actual event
   */
  #handleMultiMixedSelectionChange(e: any) {
    this.container?.querySelector<IdsCheckbox>('ids-checkbox')?.setAttribute(attributes.CHECKED, String(this.selected !== 'true'));
    this.setAttribute(attributes.SELECTED, String(this.selected !== 'true'));

    const eventData = {
      detail: {
        elem: this,
        nativeEvent: e,
        selected: this.selected,
        selection: this.selection,
      }
    };

    this.triggerEvent('selectionchanged', this, eventData);
  }

  /**
   * Change single selection for block item
   * @private
   */
  #handlePreSelectionChange() {
    if (this.preselected === 'true') {
      this.setAttribute(attributes.PRE_SELECTED, 'false');
    } else {
      const blockElements = this.parentElement?.querySelectorAll<IdsBlockgridItem>('ids-block-grid-item[selection="mixed"]');
      [...blockElements ?? []].forEach((elem) => {
        elem.setAttribute(attributes.PRE_SELECTED, 'false');
      });
      this.setAttribute(attributes.PRE_SELECTED, 'true');
    }
  }
}
