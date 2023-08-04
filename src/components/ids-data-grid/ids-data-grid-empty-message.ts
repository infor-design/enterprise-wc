import '../ids-empty-message/ids-empty-message';
import type IdsEmptyMessage from '../ids-empty-message/ids-empty-message';
import type IdsText from '../ids-text/ids-text';
import type IdsVirtualScroll from '../ids-virtual-scroll/ids-virtual-scroll';
import type IdsDataGrid from './ids-data-grid';

/**
 * Empty message elements interface.
 */
export interface IdsDataGridEmptyMessageElements {
  /* Empty message element */
  em?: IdsEmptyMessage;
  /* Description element for empty message */
  emDesc?: IdsText;
  /* Is this use slotted element for empty message */
  emIsSlotted?: boolean;
  /* Label element for empty message */
  emLabel?: IdsText;
  /* Virtual scroll element */
  vs?: IdsVirtualScroll
}

/**
 * Empty message defaults.
 * @private
 * @param {IdsDataGrid} this The data grid object.
 * @returns {object} The default values
 */
function emptyMessageDefaults(this: IdsDataGrid) {
  return {
    description: this.localeAPI?.translate('NoDataFilter') || 'No data available, make a new filter selection to see more results.',
    icon: 'empty-no-data-new',
    label: this.localeAPI?.translate('NoData') || 'No data available'
  };
}

/**
 * Empty message markup content.
 * @private
 * @param {IdsDataGrid} this The data grid object.
 * @returns {string} The template
 */
function emptyMessageContent(this: IdsDataGrid): string {
  const { description, icon, label } = emptyMessageDefaults.apply(this);
  const em = {
    description: this.emptyMessageDescription || description,
    icon: this.emptyMessageIcon || icon,
    label: this.emptyMessageLabel || label,
  };
  return this.suppressEmptyMessage ? '' : `<ids-empty-message icon="${em.icon}" hidden>
    <ids-text type="h2" font-size="20" label="true" slot="label">${em.label}</ids-text>
    <ids-text label="true" slot="description" hidden>${em.description}</ids-text>
  </ids-empty-message>`;
}

/**
 * Empty message template markup.
 * @param {IdsDataGrid} this The data grid object.
 * @returns {string} The template
 */
export function emptyMessageTemplate(this: IdsDataGrid): string {
  return `<slot name="empty-message">${emptyMessageContent.apply(this)}</slot>`;
}

/**
 * Set empty message elements.
 * @param {IdsDataGrid} this The data grid object.
 * @returns {void}
 */
export function setEmptyMessageElements(this: IdsDataGrid): void {
  const slotted = this.querySelector('ids-empty-message') as IdsEmptyMessage;
  const em = slotted || this.shadowRoot?.querySelector('ids-empty-message');

  this.emptyMessageElements = {
    em,
    emDesc: em?.querySelector('[slot="description"]') as IdsText,
    emIsSlotted: !!slotted,
    emLabel: em?.querySelector('[slot="label"]') as IdsText,
    vs: this.shadowRoot?.querySelector('ids-virtual-scroll') as IdsVirtualScroll
  };
}

/**
 * Reset empty message elements.
 * @param {IdsDataGrid} this The data grid object.
 * @returns {void}
 */
export function resetEmptyMessageElements(this: IdsDataGrid): void {
  this.emptyMessageElements = undefined;
}

/**
 * Show the empty message.
 * @param {IdsDataGrid} this The data grid object.
 * @returns {void}
 */
export function showEmptyMessage(this: IdsDataGrid): void {
  if (this.suppressEmptyMessage) return;

  // Set elements
  if (this.initialized && !this.emptyMessageElements) setEmptyMessageElements.apply(this);
  const { em, emDesc, vs } = this.emptyMessageElements || {};

  // Empty message
  em?.removeAttribute('hidden');

  // Filtered (show/hide description element)
  const isFiltered = (this.datasource as any).filtered;
  if (isFiltered) emDesc?.removeAttribute('hidden');
  else emDesc?.setAttribute('hidden', '');

  // Virtual scroll
  if (this.virtualScroll) {
    vs?.setAttribute('hidden', '');
    this.container?.style.setProperty('height', '');
  }

  this.wrapper?.classList.add('has-empty-message');
}

/**
 * Hide the empty message.
 * @param {IdsDataGrid} this The data grid object.
 * @returns {void}
 */
export function hideEmptyMessage(this: IdsDataGrid): void {
  if (this.initialized && !this.emptyMessageElements) setEmptyMessageElements.apply(this);
  const { em, emDesc, vs } = this.emptyMessageElements || {};

  em?.setAttribute('hidden', '');
  emDesc?.setAttribute('hidden', '');
  vs?.removeAttribute('hidden');
  this.wrapper?.classList.remove('has-empty-message');
}

/**
 * Toggle the empty message.
 * @param {IdsDataGrid} this The data grid object.
 * @param {boolean | number} hide If true, will hide empty message.
 * @returns {void}
 */
export function IdsDataGridToggleEmptyMessage(this: IdsDataGrid, hide?: boolean | number): void {
  hide = hide ?? this.data?.length;
  if (hide || this.suppressEmptyMessage) hideEmptyMessage.apply(this);
  else showEmptyMessage.apply(this);
}

/**
 * Set empty message.
 * @param {IdsDataGrid} this The data grid object.
 * @returns {void}
 */
export function setEmptyMessage(this: IdsDataGrid): void {
  const d = emptyMessageDefaults.apply(this);
  setEmptyMessageElements.apply(this);
  const {
    em,
    emDesc,
    emIsSlotted,
    emLabel
  } = this.emptyMessageElements as IdsDataGridEmptyMessageElements;
  const description = emDesc?.textContent?.trim();
  const icon = em?.icon;
  const label = emLabel?.textContent?.trim();

  // Description
  if (emDesc && description !== this.emptyMessageDescription) {
    if (emIsSlotted && this.emptyMessageDescription) {
      emDesc.innerHTML = this.emptyMessageDescription;
    } else if (!emIsSlotted) {
      emDesc.innerHTML = this.emptyMessageDescription || d.description;
    }
  }

  // Icon
  if (em?.icon && icon !== this.emptyMessageIcon) {
    if (emIsSlotted && this.emptyMessageIcon) {
      em.icon = this.emptyMessageIcon;
    } else if (!emIsSlotted) {
      em.icon = this.emptyMessageIcon || d.icon;
    }
  }

  // Label
  if (emLabel && label !== this.emptyMessageLabel) {
    if (emIsSlotted && this.emptyMessageLabel) {
      emLabel.innerHTML = this.emptyMessageLabel;
    } else if (!emIsSlotted) {
      emLabel.innerHTML = this.emptyMessageLabel || d.label;
    }
  }

  // Reset elements
  resetEmptyMessageElements.apply(this);
  this.toggleEmptyMessage();
}
