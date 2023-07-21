import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsElement from '../../core/ids-element';
import IdsCheckbox from '../ids-checkbox/ids-checkbox';
import '../ids-swappable/ids-swappable';
import '../ids-swappable/ids-swappable-item';
import styles from './ids-list-view-item.scss';

const Base = IdsEventsMixin(
  IdsElement
);

/**
 * IDS List View Item Component
 * @type {IdsListViewItem}
 * @inherits IdsElement
 */
@customElement('ids-list-view-item')
@scss(styles)
export default class IdsListViewItem extends Base {
  #parentListView: HTMLElement | null = null;

  /**
   * Get the parent IdsListView that contains this list-view-item
   * @returns {HTMLElement | null} this list-item's parent slot
   */
  get parentListView(): HTMLElement | null {
    if (!this.#parentListView) {
      this.#parentListView = this.closest('ids-list-view') ?? (this.getRootNode() as any)?.host;
    }
    return this.#parentListView;
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.ACTIVE,
      attributes.CHECKBOX,
      attributes.DISABLED,
      attributes.SELECTED,
      attributes.ROW_INDEX,
    ];
  }

  /**
   * Invoked each time the custom element is appended into a document-connected element.
   */
  connectedCallback() {
    super.connectedCallback();

    if (this.rowIndex < 0) {
      (this.parentListView as any)?.redrawLazy?.();
    }

    this.#attachEventListeners();
  }

  /**
   * Invoked each time the custom element is removed from a document-connected element.
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    if (document.body.contains(this.parentListView)) {
      this.removeAttribute?.('slot');
      (this.parentListView as any)?.disconnectedCallback?.();
    }
  }

  #attachEventListeners() {
    this.tabIndex = 0;
    this.offEvent('focus', this);
    this.onEvent('focus', this, () => {
      // @see https://stackoverflow.com/questions/32417235/how-to-make-a-custom-web-component-focusable
      this.tabIndex = -1;
      this.#checkboxElement()?.focus?.();
    });
    this.offEvent('blur', this);
    this.onEvent('blur', this, () => {
      // @see https://stackoverflow.com/questions/32417235/how-to-make-a-custom-web-component-focusable
      this.tabIndex = 0;
    });

    this.offEvent('click.ids-list-view-item', this.container);
    this.onEvent('click.ids-list-view-item', this.container, () => {
      this.#updateSelected(!this.selected);
    });

    const checkbox = this.#checkboxElement();
    this.offEvent('click.ids-list-view-item.checkbox', checkbox?.input);
    this.onEvent('click.ids-list-view-item.checkbox', checkbox?.input, () => {
      this.#updateCheckbox(!this.checked);
    });

    this.offEvent('change.ids-list-view-item', checkbox);
    this.onEvent('change.ids-list-view-item', checkbox, (evt: CustomEvent) => {
      this.#updateCheckbox(Boolean(evt.detail?.checked ?? false));
    });
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template(): string {
    return `
      <div class="ids-list-view-item">
        ${this.templateCheckbox()}
        <div class="list-item-content">
          <slot></slot>
        </div>
      </div>
    `;
  }

  /**
   * Checkbox template contents
   * @returns {string} The checkbox template
   */
  templateCheckbox(): string {
    if (!this.checkbox) return ``;

    return `
      <ids-checkbox
        class="list-item-checkbox"
        label="cb-item-${this.rowIndex}"
        label-state="hidden"
        ${this.checked ? 'checked' : ''}
        ${this.disabled ? 'disabled' : ''}
        >
      </ids-checkbox>
    `;
  }

  /**
   * Set the row index. This index can be used to lazy-load data from IdsListView.data.
   * @param {number} value the index
   */
  set rowIndex(value: number) {
    if (value !== null && value >= 0) {
      this.setAttribute(attributes.ROW_INDEX, String(value));
    } else {
      this.removeAttribute(attributes.ROW_INDEX);
    }
  }

  /**
   * Get the row index. This index can be used to lazy-load data from IdsListView.data.
   * @returns {number} this list-view-item's row-index in parent IdsListView
   */
  get rowIndex(): number { return Number(this.getAttribute(attributes.ROW_INDEX) ?? -1); }

  /**
   * Wrapper function that adds interface to match dataset interface.
   * @returns {number} this list-view-item's row-index in parent IdsListView
   */
  get index(): number { return this.rowIndex; }

  /**
   * Wrapper function that adds interface to match dataset interface.
   * @returns {boolean} true/false
   */
  get itemActivated(): boolean { return this.active; }

  /**
   * Get the list-item active state.
   * @returns {boolean} true/false
   */
  get active(): boolean { return this.hasAttribute(attributes.ACTIVE); }

  /**
   * Set the list-item active state.
   * @param {boolean} value true/false
   */
  set active(value: boolean) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.ACTIVE, 'true');
    } else {
      this.removeAttribute(attributes.ACTIVE);
    }
  }

  /**
   * Set if list-view-item should show checkbox.
   * @param {boolean} value true/false
   */
  set checkbox(value: boolean) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.CHECKBOX, 'true');
      if (!this.#checkboxElement()) {
        const templateCheckbox = document.createElement('template');
        templateCheckbox.innerHTML = this.templateCheckbox();
        this.container?.prepend(templateCheckbox.content.cloneNode(true));
      }
    } else {
      this.removeAttribute(attributes.CHECKBOX);
      this.#checkboxElement()?.remove();
    }
  }

  /**
   * True if checkbox is enabled on list-view-item
   * @returns {boolean} true/false
   */
  get checkbox(): boolean {
    if (this.hasAttribute(attributes.CHECKBOX)) {
      return true;
    }

    let showCheckbox = false;
    if (this.parentListView) {
      const parentListView = this.parentListView as any;
      const selectable = parentListView.selectable;
      // const isMixed = selectable === 'mixed';
      const isMultiple = selectable === 'multiple';
      const isSingle = selectable === 'single';
      const hideCheckbox = isMultiple && parentListView.hideCheckboxes;
      showCheckbox = selectable && (!isSingle && !hideCheckbox);
    }
    return showCheckbox;
  }

  /**
   * Return the ids-checkbox element
   * @returns {IdsCheckbox} the checkbox element
   */
  #checkboxElement(): IdsCheckbox | null {
    return this.container?.querySelector<IdsCheckbox>('ids-checkbox') ?? null;
  }

  /**
   * Set the list-item checked state.
   * @param {boolean} value true/false
   */
  set checked(value: boolean) {
    const checkbox = this.#checkboxElement();
    if (stringToBool(value)) {
      this.setAttribute(attributes.CHECKED, 'true');
      if (checkbox) checkbox.checked = true;
    } else {
      this.removeAttribute(attributes.CHECKED);
      if (checkbox) checkbox.checked = false;
    }
  }

  /**
   * Get the list-item checked state.
   * @returns {boolean} true/false
   */
  get checked(): boolean { return this.hasAttribute(attributes.CHECKED); }

  /**
   * Set the list-item disabled state.
   * @param {boolean} value true/false
   */
  set disabled(value: boolean) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.DISABLED, 'true');
    } else {
      this.removeAttribute(attributes.DISABLED);
    }
  }

  /**
   * Get the list-item disabled state.
   * @returns {boolean} true/false
   */
  get disabled(): boolean { return this.hasAttribute(attributes.DISABLED); }

  /**
   * Wrapper function that adds interface to match dataset interface.
   * @returns {boolean} true/false
   */
  get itemSelected(): boolean { return this.selected; }

  /**
   * Get the list-item selected state.
   * @returns {boolean} true/false
   */
  get selected(): boolean { return this.hasAttribute(attributes.SELECTED); }

  /**
   * Set the list-item selected state.
   * @param {boolean} value true/false
   */
  set selected(value: boolean) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.SELECTED, 'true');
    } else {
      this.removeAttribute(attributes.SELECTED);
    }
  }

  /**
   * Get the list-item selectable state.
   * @returns {boolean} true/false
   */
  get selectable(): boolean {
    if (this.hasAttribute(attributes.SELECTABLE)) {
      return true;
    }

    if (this.parentListView) {
      const parentListView = this.parentListView as any;
      return !!parentListView.selectable;
    }

    return false;
  }

  /**
   * Set the list-item selectable state.
   * @param {boolean} value true/false
   */
  set selectable(value: boolean) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.SELECTABLE, 'true');
    } else {
      this.removeAttribute(attributes.SELECTABLE);
    }
  }

  #siblings(selected = false): IdsListViewItem[] {
    const parentListView = this.parentListView as any;
    const selector = selected ? 'ids-list-view-item[selected]' : 'ids-list-view-item';
    if (parentListView?.contains(this)) {
      return [...parentListView.querySelectorAll(selector)];
    }
    if (parentListView?.shadowRoot?.contains?.(this)) {
      return [...parentListView.shadowRoot.querySelectorAll(selector)];
    }
    return [];
  }

  get siblings(): IdsListViewItem[] { return this.#siblings(); }

  get siblingsSelected(): IdsListViewItem[] { return this.#siblings(Boolean('selected')); }

  #updateSelected(selected: boolean) {
    if (this.selected === selected) return;

    const parentListView = this.parentListView as any;
    const selectable = parentListView?.selectable ?? false;

    if (!selectable) {
      return;
    }
    if (selectable === 'mixed') {
      this.selected = selected;
      return;
    }
    if (selectable === 'multiple') {
      this.selected = selected;
      this.checked = selected;
      return;
    }
    if (selectable === 'single') {
      this.siblingsSelected.forEach((item) => { item.selected = false; });
      this.selected = selected;
    }
  }

  #updateCheckbox(checked: boolean) {
    if (checked === this.checked) return;
    this.checked = checked;

    const parentListView = this.parentListView as any;
    const selectable = parentListView?.selectable ?? false;

    if (selectable === 'multiple') {
      this.selected = checked;
    }
  }
}
