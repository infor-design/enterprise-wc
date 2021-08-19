/* global $ */

import IdsCard from '../../src/components/ids-card/ids-card';

// Initialize the 4.x
$('body').initialize();
$('.btn-actions').on('selected', (e, args) => {
  console.log(e, args); // eslint-disable-line no-console
});
