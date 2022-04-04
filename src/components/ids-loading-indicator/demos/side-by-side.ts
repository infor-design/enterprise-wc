import '../ids-loading-indicator';

// Initialize the 4.x
$('body').initialize();
$(() => {
  $('#submit').click(() => {
    $('#busy-form').trigger('start.busyindicator');
  });
});
