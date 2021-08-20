/* global $ */

import IdsLoadingIndicator from '../../src/components/ids-loading-indicator';

// Initialize the 4.x
$('body').initialize();
$(() => {
  $('#submit').click((e) => { // eslint-disable-line no-unused-vars
    $('#busy-form').trigger('start.busyindicator');
  });
});
