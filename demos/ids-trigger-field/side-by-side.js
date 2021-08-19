/* global $ */

import IdsTriggerField from '../../src/components/ids-trigger-field/ids-trigger-field';

// Initialize the 4.x
$('body').initialize();
$('body').on('initialized', () => {
  $('#date-field-normal')
    .datepicker({
      attributes: [
        { name: 'id', value: 'custom-id' },
        { name: 'data-automation-id', value: 'custom-automation-id' }
      ]
    })
    .on('change', () => {
      console.log('Change Event Fired'); // eslint-disable-line no-console
    });
});
