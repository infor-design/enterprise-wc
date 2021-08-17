/* global $ */

import IdsSpinbox from '../../src/ids-spinbox';

// Initialize the 4.x
$('body').initialize();
$('#regular-spinbox').spinbox({
  attributes: [
    { name: 'id', value: 'spinbox-id-1' },
    { name: 'data-automation-id', value: 'spinbox-automation-id-1' }
  ]
});
