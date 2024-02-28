import '../ids-time-picker-popup';
import '../../ids-button/ids-button';
import '../../ids-modal/ids-modal-button';
import '../../ids-trigger-field/ids-trigger-field';
import '../../ids-trigger-field/ids-trigger-button';

import type IdsTriggerField from '../../ids-trigger-field/ids-trigger-field';

const fieldDefs = [
  {
    id: 'time-picker-current-time-field',
    format: 'hh:mm a',
    useCurrentTime: 'time'
  },
  {
    id: 'time-picker-all-dropdowns-field',
    format: 'hh:mm:ss a',
    minuteInterval: '15',
    secondInterval: '10'
  },
  {
    id: 'time-picker-24-field',
    format: 'HH:mm'
  }
];

document.addEventListener('DOMContentLoaded', () => {
  const demoIdsContainer = document.querySelector<any>('ids-container')!;
  const triggerFieldContainer = document.querySelector<any>('#trigger-field-container')!;

  const getFieldIdFromBtnId = (btnEl: any) => btnEl.getAttribute('id')?.replace('-button', '-field') || '';

  // Updates an existing IdsTimePickerPopup
  const updatePopup = (popupEl: any, data: any) => {
    if (!popupEl || !data) return;
    const booleanProps: string[] = [];
    const otherProps = ['format', 'minuteInterval', 'useCurrentTime', 'secondInterval'];

    booleanProps.forEach((prop) => {
      if (data[prop]) popupEl[prop] = data[prop];
      else popupEl[prop] = false;
    });

    otherProps.forEach((prop) => {
      if (data[prop]) popupEl[prop] = data[prop];
      else popupEl[prop] = null;
    });
  };

  // Creates a new IdsTimePickerPopup
  const createPopup = (fieldId: string, btnId: string, data: any) => {
    const pickerHTML = `<ids-time-picker-popup
          format="${data.format}"
          target="#${fieldId}"
          trigger-elem="#${btnId}"
          trigger-type="custom"
          ${data.useCurrentTime ? 'use-current-time="time"' : ''}></ids-time-picker-popup>`;
    demoIdsContainer.insertAdjacentHTML('beforeend', pickerHTML);

    const picker = document.querySelector<any>('ids-time-picker-popup')!;
    if (picker.popup) {
      picker.popup.align = 'bottom, left';
      picker.popup.arrow = 'bottom';
    }

    // Fix onOutsideClick to consider clicking on trigger buttons
    picker.onOutsideClick = (e: Event) => {
      const target = (e.target as HTMLElement);
      if (target && target.tagName !== 'IDS-TRIGGER-BUTTON' && !picker.contains(target)) {
        picker.hide();
      }
    };

    return picker;
  };

  // Assigns the correct properties/attributes to the standalone picker that correctly
  // binds it to each trigger field
  const configurePopup = (btnEl: any) => {
    const btnId = btnEl.getAttribute('id');
    const fieldId = btnId.replace('-button', '-field');
    const field = document.querySelector<IdsTriggerField>(`#${fieldId}`)!;

    const data = fieldDefs.find((entry) => entry.id === fieldId);
    let picker = document.querySelector<any>('ids-time-picker-popup')!;
    let currentTarget;

    if (data) {
      if (picker) {
        if (picker.popup) {
          picker.popup.align = 'bottom, left';
          picker.popup.arrow = 'bottom';
          picker.popup.arrowTarget = `#${btnId}`;
        }
        currentTarget = picker.target;
        picker.target = `#${fieldId}`;
        picker.triggerElem = `#${btnId}`;
        if (field.value) picker.value = field.value;
        updatePopup(picker, data);
      } else {
        picker = createPopup(fieldId, btnId, data);
        if (field.value) picker.value = field.value;

        // Date Picker Popup's `hide` event can cause the field to become focused
        picker.addEventListener('hide', (e: CustomEvent) => {
          e.stopPropagation();
          if (e.detail.doFocus) {
            picker.target?.focus();
          }
        });

        // Date Picker Popup's `show` event will be used to capture the value from
        // its assigned trigger field
        picker.addEventListener('show', (e: CustomEvent) => {
          e.stopPropagation();
          picker.value = picker.target?.value;
        });
      }

      if (picker.popup) {
        picker.popup.arrow = 'bottom';
        picker.popup.arrowTarget = `#${btnId}`;
        picker.popup.align = 'bottom, left';
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
  triggerFieldContainer.addEventListener('click', (e: MouseEvent) => {
    const target = (e.target as any);
    if (target) {
      if (target.tagName === 'IDS-TRIGGER-BUTTON') {
        configurePopup(target);
      }
    }
  });

  // Displays the selected day when picked from the Date Picker Popup's MonthView
  // const btn = document.querySelector<any>('#composed-date-picker-button')!;
  triggerFieldContainer.addEventListener('timeselected', (e: CustomEvent) => {
    const target = (e.target as any); // trigger field
    if (target) {
      const picker = document.querySelector<any>('ids-time-picker-popup')!;
      const fieldId = getFieldIdFromBtnId(target);
      if (target.tagName === 'IDS-TRIGGER-BUTTON') {
        const field = document.querySelector<any>(`#${fieldId}`);
        console.info('"timeselected" event triggered', e.detail.value, `. Value will be passed to field "${fieldId}"`);
        field.value = picker.value;
      }
      if (target.tagName === 'IDS-TRIGGER-FIELD') {
        console.info('"timeselected" event triggered', e.detail.value, `. Value will be passed to field "${fieldId}"`);
        target.value = e.detail.value;
      }
    }
  });
});
