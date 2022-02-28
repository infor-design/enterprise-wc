import IdsTriggerField from '../ids-trigger-field';

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
      console.info('Change Event Fired');
    });
});
