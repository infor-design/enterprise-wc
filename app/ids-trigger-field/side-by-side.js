import IdsTriggerField from '../../src/ids-trigger-field/ids-trigger-field';

//Initialize the 4.x
$('body').initialize();
$('body').on('initialized', function() {
  $('#date-field-normal')
    .datepicker({
      attributes: [
        { name: 'id', value: 'custom-id' },
        { name: 'data-automation-id', value: 'custom-automation-id' }
    ]})
    .on('change', function () {
      console.log('Change Event Fired')
    });
});