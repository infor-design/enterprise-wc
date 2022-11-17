import '../ids-date-picker-popup';
import '../ids-month-year-picklist';
import '../ids-date-picker';
import '../../ids-button/ids-button';
import '../../ids-modal-button/ids-modal-button';
import '../../ids-trigger-field/ids-trigger-field';
import '../../ids-trigger-field/ids-trigger-button';

document.addEventListener('DOMContentLoaded', () => {
  const field = document.querySelector<any>('ids-trigger-field')!;
  const picker = document.querySelector<any>('ids-date-picker-popup')!;
  if (picker.popup) {
    picker.popup.arrowTarget = '#composed-date-picker-button';
  }

  // Displays the selected day when picked from the Date Picker Popup's MonthView
  // const btn = document.querySelector<any>('#composed-date-picker-button')!;
  field.onEvent('dayselected', field, (e: CustomEvent) => {
    const target = (e.target as any);
    if (target) {
      console.info('"dayselected" event triggered', e.detail.date);
      field.value = picker.value;
    }
  });

  // Example for populating the legend
  picker.legend = [
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
  ];
});
