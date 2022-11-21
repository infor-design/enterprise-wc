import '../ids-date-picker-popup';
import '../ids-month-year-picklist';
import '../ids-date-picker';
import '../../ids-button/ids-button';
import '../../ids-modal-button/ids-modal-button';
import '../../ids-trigger-field/ids-trigger-field';
import '../../ids-trigger-field/ids-trigger-button';

const fieldDefs = [
  {
    id: 'date-time-picker-current-time-field',
    format: 'M/d/yyyy hh:mm a',
    legend: [
      {
        name: 'Public Holiday',
        color: 'emerald-60',
        dates: ['12/31/2021', '12/24/2021', '1/1/2022'],
      },
      {
        name: 'Weekends',
        color: 'amber-60',
        dayOfWeek: [0, 6]
      },
      {
        name: 'Other',
        color: 'ruby-30',
        dates: ['1/8/2022', '1/9/2022', '1/23/2022'],
      },
      {
        name: 'Half Days',
        color: 'amethyst-60',
        dates: ['1/21/2022', '1/22/2022'],
      },
      {
        name: 'Full Days',
        color: 'azure-30',
        dates: ['1/24/2022', '1/25/2022']
      },
    ],
    showPicklistMonth: true,
    showPicklistYear: true,
    useCurrentTime: 'time'
  },
  {
    id: 'date-picker-cancel-clear-field',
    format: 'M/d/yyyy',
    showCancel: true,
    showClear: true,
    showPicklistMonth: true,
    showPicklistYear: true
  },
  {
    id: 'date-picker-week-number-field',
    format: 'M/d/yyyy',
    showPicklistWeek: true
  }
];

document.addEventListener('DOMContentLoaded', () => {
  const demoIdsContainer = document.querySelector<any>('ids-container')!;
  const triggerFieldContainer = document.querySelector<any>('#trigger-field-container')!;

  const getFieldIdFromBtnId = (btnEl: any) => btnEl.getAttribute('id')?.replace('-button', '-field') || '';

  // Updates an existing IdsDatePickerPopup
  const updatePopup = (popupEl: any, data: any) => {
    if (!popupEl || !data) return;
    const booleanProps = ['showCancel', 'showClear', 'showPicklistWeek', 'showPicklistYear', 'showPicklistMonth'];
    const stringProps = ['format', 'legend', 'useCurrentTime'];

    booleanProps.forEach((prop) => {
      if (data[prop]) popupEl[prop] = data[prop];
      else popupEl[prop] = false;
    });

    stringProps.forEach((prop) => {
      if (data[prop]) popupEl[prop] = data[prop];
      else popupEl[prop] = null;
    });
  };

  // Creates a new IdsDatePickerPopup
  const createPopup = (fieldId: string, btnId: string, data: any) => {
    const pickerHTML = `<ids-date-picker-popup
          format="${data.format}"
          target="#${fieldId}"
          trigger-elem="#${btnId}"
          trigger-type="custom"
          ${data.showCancel ? 'show-cancel="true"' : ''}
          ${data.showClear ? 'show-clear="true"' : ''}
          ${data.showPicklistMonth ? 'show-picklist-month="true"' : ''}
          ${data.showPicklistWeek ? 'show-picklist-week="true"' : ''}
          ${data.showPicklistYear ? 'show-picklist-year="true"' : ''}
          ${data.useCurrentTime ? 'use-current-time="time"' : ''}></ids-date-picker-popup>`;
    demoIdsContainer.insertAdjacentHTML('beforeend', pickerHTML);

    const picker = document.querySelector<any>('ids-date-picker-popup')!;

    // Fix onOutsideClick to consider clicking on trigger buttons
    picker.onOutsideClick = (e: Event) => {
      const target = (e.target as HTMLElement);
      if (target && target.tagName !== 'IDS-TRIGGER-BUTTON' && !picker.contains(target)) {
        picker.hide();
      }
    };

    if (data.legend) picker.legend = data.legend;

    return picker;
  };

  // Assigns the correct properties/attributes to the standalone picker that correctly
  // binds it to each trigger field
  const configurePopup = (btnEl: any) => {
    const btnId = btnEl.getAttribute('id');
    const fieldId = btnId.replace('-button', '-field');
    const data = fieldDefs.find((entry) => entry.id === fieldId);
    let picker = document.querySelector<any>('ids-date-picker-popup')!;

    if (data) {
      if (picker) {
        if (picker.popup) picker.popup.animated = false;
        picker.target = `#${fieldId}`;
        picker.triggerElem = `#${btnId}`;
        updatePopup(picker, data);
      } else {
        picker = createPopup(fieldId, btnId, data);
      }

      if (picker.popup) {
        picker.popup.arrowTarget = `#${btnId}`;
        picker.popup.animated = true;
        if (!picker.popup.visible) {
          picker.popup.place();
          picker.show();
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
  triggerFieldContainer.addEventListener('dayselected', (e: CustomEvent) => {
    const target = (e.target as any); // trigger field
    if (target) {
      const picker = document.querySelector<any>('ids-date-picker-popup')!;
      const fieldId = getFieldIdFromBtnId(target);
      if (target.tagName === 'IDS-TRIGGER-BUTTON') {
        const field = document.querySelector<any>(`#${fieldId}`);
        console.info('"dayselected" event triggered', e.detail.date, `. Value will be passed to field "${fieldId}"`);
        field.value = picker.value;
      }
      if (target.tagName === 'IDS-TRIGGER-FIELD') {
        console.info('"dayselected" event triggered', e.detail.date, `. Value will be passed to field "${fieldId}"`);
        target.value = picker.value;
      }
    }
  });
});
