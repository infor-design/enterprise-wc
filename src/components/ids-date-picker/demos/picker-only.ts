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
      { name: 'Weekends', color: 'amber-60', dayOfWeek: [0, 6] },
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
      { name: 'Full Days', color: 'azure-30', dates: ['1/24/2022', '1/25/2022'] },
    ],
    useCurrentTime: true
  },
  {
    id: 'date-picker-cancel-clear-field',
    format: 'M/d/yyyy',
    showCancel: true,
    showClear: true
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

  // Assigns the correct properties/attributes to the standalone picker that correctly
  // binds it to each trigger field
  const createPopup = (btnEl: any) => {
    const btnId = btnEl.getAttribute('id');
    const fieldId = btnId.replace('-button', '-field');
    const data = fieldDefs.find((entry) => entry.id === fieldId);
    if (data) {
      const pickerHTML = `<ids-date-picker-popup
        format="${data.format}"
        target="#${fieldId}"
        trigger-elem="#${btnId}"
        trigger-type="immediate"
        ${data.showCancel ? 'show-cancel="true"' : ''}
        ${data.showClear ? 'show-clear="true"' : ''}
        ${data.showPicklistWeek ? 'show-picklist-week="true"' : ''}
        ${data.useCurrentTime ? 'use-current-time="time"' : ''}></ids-date-picker-popup>`;

      demoIdsContainer.insertAdjacentHTML('beforeend', pickerHTML);
      const picker = document.querySelector<any>('ids-date-picker-popup')!;
      if (picker) {
        if (picker.popup) picker.popup.arrowTarget = `#${btnId}`;

        if (data.legend) picker.legend = data.legend;
        else picker.legend = null;
      }
    }
  };

  // Clicking the trigger button re-assigns the Popup bindings
  triggerFieldContainer.addEventListener('click', (e: MouseEvent) => {
    const target = (e.target as any);
    if (target) {
      if (target.tagName === 'IDS-TRIGGER-BUTTON') {
        createPopup(target);
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
