import IdsLayoutGrid from '../../src/ids-layout-grid/ids-layout-grid';
import IdsText from '../../src/ids-text/ids-text';
import IdsFieldset from '../../src/ids-fieldset/ids-fieldset';
import IdsInput from '../../src/ids-input/ids-input';
import IdsButton from '../../src/ids-button/ids-button';
import IdsCheckbox from '../../src/ids-checkbox/ids-checkbox';

//Initialize the 4.x
$('body').initialize();
$('body').on('initialized', function () {
  var container = [{
    data: [{
      name: {
        text: 'Available Credit'
      },
      completed: {
        text: 'Spent',
        value: 50000,
        format: '$,.0f'
      },
      remaining: {
        text: 'Pending',
        value: 10000,
        format: '$,.0f'
      },
      total: {
        value: 95000,
        format: '$,.0f'
      },
    }]
  }];

  $('#container-1').chart({
    dataset: container,
    type: 'completion-target',
  }).data('chart');
});