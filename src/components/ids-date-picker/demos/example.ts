import '../ids-date-picker';

// Example for populating the legend
const datePickerLegend: any = document.querySelector('#e2e-datepicker-legend');

if (datePickerLegend) {
  datePickerLegend.legend = [
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
}
