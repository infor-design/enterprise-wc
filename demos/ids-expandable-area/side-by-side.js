/* global $ */

import IdsExpandableArea from '../../src/components/ids-expandable-area/ids-expandable-area';

// Supporting components
import IdsLayoutGrid from '../../src/components/ids-layout-grid/ids-layout-grid';
import IdsLayoutGridCell from '../../src/components/ids-layout-grid/ids-layout-grid-cell';
import IdsText from '../../src/components/ids-text/ids-text';
import IdsInput from '../../src/components/ids-input/ids-input';
import IdsToggleButton from '../../src/components/ids-toggle-button/ids-toggle-button';
import IdsIcon from '../../src/components/ids-icon/ids-icon';
import IdsHyperlink from '../../src/components/ids-hyperlink/ids-hyperlink';

document.addEventListener('DOMContentLoaded', () => {
  // Add an event listener to test clickable links
  document.querySelectorAll('ids-toggle-button').forEach((idsButton) => {
    idsButton.addEventListener('click', (e) => {
      e.target.toggle();
    });
  });
});

// Initialize the 4.x
$('body').initialize();
$('body').on('initialized', () => {
  $('#expandable-area-1').expandablearea({
    attributes: [{
      name: 'id',
      value: 'expandablearea-id-1'
    },
    {
      name: 'data-automation-id',
      value: 'expandablearea-automation-id-1'
    }
    ]
  });

  $('#expandable-area-2').expandablearea({
    attributes: [{
      name: 'id',
      value: 'expandablearea-id-2'
    },
    {
      name: 'data-automation-id',
      value: 'expandablearea-automation-id-2'
    }
    ]
  });

  $('#expandable-area-3').expandablearea({
    attributes: [{
      name: 'id',
      value: 'expandablearea-id-3'
    },
    {
      name: 'data-automation-id',
      value: 'expandablearea-automation-id-3'
    }
    ]
  });

  $('#expandable-area-4').expandablearea({
    attributes: [{
      name: 'id',
      value: 'expandablearea-id-4'
    },
    {
      name: 'data-automation-id',
      value: 'expandablearea-automation-id-4'
    }
    ]
  });
});
