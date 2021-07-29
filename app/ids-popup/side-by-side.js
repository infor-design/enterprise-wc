/* global $ */

import IdsPopup from '../../src/ids-popup/ids-popup';

// Supporting Components
import IdsButton from '../../src/ids-button/ids-button';

import './example.scss';

document.addEventListener('DOMContentLoaded', () => {
  const triggerId = '#popup-trigger-btn';
  const triggerBtn = document.querySelector(triggerId);
  const popup = document.querySelector('ids-popup');

  // Toggle the Popup
  triggerBtn.addEventListener('click', () => {
    popup.visible = !popup.visible;
  });
});

// Initialize the 4.x
$('body').initialize();
const POPOVER_OPTIONS = {
  attributes: [{
    name: 'data-automation-id',
    value: 'my-popover-automation-id'
  },
  {
    name: 'id',
    value: 'my-popover-id'
  }],
  closebutton: true,
  content: $('#popover-contents'),
  extraClass: 'alternate',
  placement: 'right',
  popover: true,
  offset: {
    y: 10
  },
  trigger: 'click'
};

$('#popover-trigger').popover(POPOVER_OPTIONS);
