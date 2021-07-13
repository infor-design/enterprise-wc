/* global $ */

import IdsLoader from '../../src/ids-loader/ids-loader';

// Initialize the 4.x
$('body').initialize();
$(() => {
  $('#submit').click((e) => { // eslint-disable-line no-unused-vars
    $('#busy-form').trigger('start.busyindicator');
  });
});
