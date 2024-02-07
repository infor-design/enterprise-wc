import '../ids-date-picker';
import type IdsDatePicker from '../ids-date-picker';
import '../ids-date-picker-popup';

// Example for populating the legend
const datePickerLegend: IdsDatePicker = document.querySelector<IdsDatePicker>('#e2e-datepicker-legend')!;
datePickerLegend.legend = [
  {
    name: 'Public Holiday',
    color: 'green-60',
    dates: ['12/31/2021', '12/24/2021', '1/1/2022'],
  },
  { name: 'Weekends', color: 'orange-60', dayOfWeek: [0, 6] },
  {
    name: 'Other',
    color: 'red-30',
    dates: ['1/8/2022', '1/9/2022', '1/23/2022'],
  },
  {
    name: 'Half Days',
    color: 'purple-60',
    dates: ['1/21/2022', '1/22/2022'],
  },
  { name: 'Full Days', color: 'blue-30', dates: ['1/24/2022', '1/25/2022'] },
];
