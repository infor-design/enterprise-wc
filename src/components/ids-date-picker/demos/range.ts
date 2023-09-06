import IdsGlobal from '../../ids-global/ids-global';
import '../ids-date-picker';

(async function init() {
// Set Locale and wait for it to load
  const locale = IdsGlobal.getLocale();
  await locale?.setLocale('en-US');
  const rangePickerSettings: any = document.querySelector('#e2e-datepicker-settings-value');
  const rangePickerForward: any = document.querySelector('#e2e-datepicker-forward');
  const rangePickerBackward: any = document.querySelector('#e2e-datepicker-backward');
  const rangePickerMax: any = document.querySelector('#e2e-datepicker-max');
  const rangePickerMin: any = document.querySelector('#e2e-datepicker-min');
  const rangePickerNotIncluded: any = document.querySelector('#e2e-datepicker-not-included');
  const rangePickerIncluded: any = document.querySelector('#e2e-datepicker-included');
  const rangePickerLegend: any = document.querySelector('#e2e-datepicker-range-legend');
  const rangePickerWeek: any = document.querySelector('#e2e-datepicker-week');

  // Example to set start/end of the range via component settings
  if (rangePickerSettings) {
    rangePickerSettings.rangeSettings = {
      start: '2/5/2018',
      end: '2/28/2018'
    };

    rangePickerSettings.addEventListener('dayselected', (e: any) => {
      console.info('Range Selected', e.detail.rangeStart, e.detail.rangeEnd);
    });
  }

  // Example range selection forward
  if (rangePickerForward) {
    rangePickerForward.rangeSettings = {
      selectForward: true
    };
  }

  // Example range selection backward
  if (rangePickerBackward) {
    rangePickerBackward.rangeSettings = {
      selectBackward: true
    };
  }

  // Example range max days
  if (rangePickerMax) {
    rangePickerMax.rangeSettings = {
      maxDays: 2
    };
  }

  // Example range min days
  if (rangePickerMin) {
    rangePickerMin.rangeSettings = {
      minDays: 5
    };
  }

  // Example week picker
  if (rangePickerWeek) {
    rangePickerWeek.rangeSettings = {
      selectWeek: true
    };
  }

  // Example range disabled not included
  if (rangePickerNotIncluded) {
    rangePickerNotIncluded.rangeSettings = {
      start: '2/5/2018',
      end: '2/28/2018'
    };
    rangePickerNotIncluded.disableSettings = {
      dates: ['2/7/2018', '2/9/2018', '2/10/2018', '2/11/2018']
    };
  }

  // Example range disabled included
  if (rangePickerIncluded) {
    rangePickerIncluded.rangeSettings = {
      start: '2/5/2018',
      end: '2/28/2018',
      includeDisabled: true
    };
    rangePickerIncluded.disableSettings = {
      dates: ['2/7/2018', '2/9/2018', '2/10/2018', '2/11/2018']
    };
  }

  // Example range with disabled and legend
  if (rangePickerLegend) {
    rangePickerLegend.rangeSettings = {
      start: '2/5/2018',
      end: '2/28/2018'
    };
    rangePickerLegend.disableSettings = {
      dates: ['2/7/2018', '2/9/2018', '2/10/2018', '2/11/2018']
    };
    rangePickerLegend.legend = [
      { name: 'Weekends', color: 'amber-60', dayOfWeek: [0, 6] },
      {
        name: 'Other',
        color: 'ruby-30',
        dates: ['2/8/2018', '2/9/2018', '2/23/2018'],
      },
      {
        name: 'Half Days',
        color: 'amethyst-60',
        dates: ['2/21/2018', '1/22/2018'],
      },
      { name: 'Full Days', color: 'azure-30', dates: ['2/24/2018', '2/25/2018'] },
    ];
  }
}());
