// Supporting components
import '../ids-dropdown';
import '../ids-dropdown-list';

import type IdsContainer from '../../ids-container/ids-container';
import type IdsDropdown from '../ids-dropdown';
import type IdsDropdownList from '../ids-dropdown-list';

document.addEventListener('DOMContentLoaded', () => {
  const demoIdsContainer = document.querySelector<IdsContainer>('ids-container')!;
  const dropdownEl = document.querySelector<IdsDropdown>('#dropdown-1')!;

  const getFieldIdFromBtnId = (btnEl: any) => btnEl.getAttribute('id')?.replace('-button', '-field') || '';

  // Creates a new IdsDropdownList
  const createPopup = (fieldId: string, btnId: string) => {
    const pickerHTML = `<ids-dropdown-list
          target="#${fieldId}"
          trigger-elem="#${btnId}"
          trigger-type="custom"></ids-dropdown-list>`;
    demoIdsContainer.insertAdjacentHTML('beforeend', pickerHTML);

    const picker = document.querySelector<IdsDropdownList>('ids-dropdown-list')!;
    return picker;
  };

  // Assigns the correct properties/attributes to the standalone list that correctly
  // binds it to each trigger field
  const configurePopup = (btnEl: any) => {
    const btnId = btnEl.getAttribute('id');
    const fieldId = btnId.replace('-button', '-field');
    const field = document.querySelector<IdsDropdown>(`#${fieldId}`)!;

    let picker = document.querySelector<IdsDropdownList>('ids-dropdown-list')!;
    let currentTarget: IdsDropdown;

    if (picker) {
      if (picker.popup) picker.popup.animated = false;
      currentTarget = picker.target as IdsDropdown;
      picker.target = `#${fieldId}`;
      picker.triggerElem = `#${btnId}`;
      if (field.value) picker.value = field.value;
    } else {
      picker = createPopup(fieldId, btnId);
      currentTarget = picker.target as IdsDropdown;
      picker.target = `#${fieldId}`;
      picker.triggerElem = `#${btnId}`;
      if (field.value) picker.value = field.value;

      // Dropdown List's `hide` event can cause the field to become focused
      picker.onEvent('hide', picker, (e: CustomEvent) => {
        e.stopPropagation();
        if (e.detail.doFocus) {
          picker.target?.focus();
        }
      });

      // Dropdown List's`show` event will be used to capture the value from
      // its assigned trigger field
      picker.onEvent('show', picker, (e: CustomEvent) => {
        e.stopPropagation();
        picker.value = currentTarget?.value;
      });
    }
  };

  configurePopup(dropdownEl);

  // Handle selections
  dropdownEl.onEvent('selected', dropdownEl, async (e: CustomEvent) => {
    const target = (e.target as any); // trigger field
    if (target) {
      const picker = document.querySelector<IdsDropdownList>('ids-dropdown-list')!;
      const fieldId = getFieldIdFromBtnId(target);

      console.info('"selected" event triggered: ', e.detail.value, ` -- Value will be passed to field "${fieldId}"`);
      target.value = picker.value;
      await picker.hide(true);
    }
  });

  // Wire up click event to open/close the menu
  dropdownEl.onEvent('click', dropdownEl, async (e: CustomEvent) => {
    const target = (e.target as any); // trigger field
    if (target) {
      const picker = document.querySelector<IdsDropdownList>('ids-dropdown-list')!;
      const popup = picker.popup;
      if (popup) {
        if (!popup.visible) await dropdownEl.open();
        else dropdownEl.close();
      }
    }
  });
});
