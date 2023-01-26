// Supporting components
import '../ids-dropdown';
import '../ids-dropdown-list';

import type IdsDropdown from '../ids-dropdown';
import type IdsDropdownList from '../ids-dropdown-list';

const fieldDefs = [
  {
    id: 'dropdown-1',
  },
];

document.addEventListener('DOMContentLoaded', () => {
  const demoIdsContainer = document.querySelector<any>('ids-container')!;
  const dropdownEl = document.querySelector<any>('#dropdown-1')!;

  const getFieldIdFromBtnId = (btnEl: any) => btnEl.getAttribute('id')?.replace('-button', '-field') || '';

  // Updates an existing IdsDatePickerPopup
  /*
  const updatePopup = (popupEl: any, data: any) => {
    if (!popupEl || !data) return;
    const booleanProps = [];
    const otherProps = [];

    booleanProps.forEach((prop) => {
      if (data[prop]) popupEl[prop] = data[prop];
      else popupEl[prop] = false;
    });

    otherProps.forEach((prop) => {
      if (data[prop]) popupEl[prop] = data[prop];
      else popupEl[prop] = null;
    });
  };
  */

  // Creates a new IdsDatePickerPopup
  const createPopup = (fieldId: string, btnId: string, data: any) => {
    const pickerHTML = `<ids-dropdown-list
          target="#${fieldId}"
          trigger-elem="#${btnId}"
          trigger-type="custom"></ids-dropdown-list>`;
    demoIdsContainer.insertAdjacentHTML('beforeend', pickerHTML);

    const picker = document.querySelector<IdsDropdownList>('ids-dropdown-list')!;

    // Fix onOutsideClick to consider clicking on trigger buttons
    picker.onOutsideClick = (e: Event) => {
      const target = (e.target as HTMLElement);
      if (target && target.tagName !== 'IDS-TRIGGER-BUTTON' && !picker.contains(target)) {
        picker.hide();
      }
    };

    // if (data.legend) picker.legend = data.legend;
    // if (data.rangeSettings) picker.rangeSettings = data.rangeSettings;

    return picker;
  };

  // Assigns the correct properties/attributes to the standalone picker that correctly
  // binds it to each trigger field
  const configurePopup = (btnEl: any) => {
    const btnId = btnEl.getAttribute('id');
    const fieldId = btnId.replace('-button', '-field');
    const field = document.querySelector<IdsDropdown>(`#${fieldId}`)!;

    const data = fieldDefs.find((entry) => entry.id === fieldId);
    let picker = document.querySelector<IdsDropdownList>('ids-dropdown-list')!;
    let currentTarget: IdsDropdown;

    if (data) {
      if (picker) {
        if (picker.popup) picker.popup.animated = false;
        currentTarget = picker.target as IdsDropdown;
        picker.target = `#${fieldId}`;
        picker.triggerElem = `#${btnId}`;
        if (field.value) picker.value = field.value;
        // updatePopup(picker, data);
      } else {
        picker = createPopup(fieldId, btnId, data);
        currentTarget = picker.target as IdsDropdown;

        // Date Picker Popup's `hide` event can cause the field to become focused
        picker.onEvent('hide', picker, (e: CustomEvent) => {
          e.stopPropagation();
          if (e.detail.doFocus) {
            picker.target?.focus();
          }
        });

        // Date Picker Popup's `show` event will be used to capture the value from
        // its assigned trigger field
        picker.onEvent('show', picker, (e: CustomEvent) => {
          e.stopPropagation();
          picker.value = currentTarget?.value;
        });
      }

      if (picker.popup) {
        picker.popup.arrowTarget = `#${btnId}`;
        picker.popup.animated = true;

        if (!picker.popup.visible) {
          picker.show();
        } else if (picker.target !== currentTarget) {
          picker.popup.place();
          picker.popup.placeArrow();
        } else {
          picker.hide();
        }
      }
    }
  };

  // Clicking the trigger button re-assigns the Popup bindings
  dropdownEl.addEventListener('click', (e: MouseEvent) => {
    const target = (e.target as any);
    if (target) {
      configurePopup(target);
    }
  });

  // Handle selections
  dropdownEl.addEventListener('selected', (e: CustomEvent) => {
    const target = (e.target as any); // trigger field
    if (target) {
      const picker = document.querySelector<IdsDropdownList>('ids-dropdown-list')!;
      const fieldId = getFieldIdFromBtnId(target);

      console.info('"selected" event triggered: ', e.detail.value, ` -- Value will be passed to field "${fieldId}"`);
      target.value = picker.value;
      picker.hide();
    }
  });
});
