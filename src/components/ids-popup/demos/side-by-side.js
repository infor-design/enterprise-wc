// Supporting Components
import IdsPopup from '../ids-popup';
import IdsButton from '../../ids-button/ids-button';

import css from '../../../assets/css/ids-popup/index.css';

const cssLink = `<link href="${css}" rel="stylesheet">`;
document.querySelector('head').insertAdjacentHTML('afterbegin', cssLink);

document.addEventListener('DOMContentLoaded', () => {
  const triggerId = '#popup-trigger-btn';
  const triggerBtn = document.querySelector(triggerId);
  const popup = document.querySelector('ids-popup');

  // Toggle the Popup
  triggerBtn.addEventListener('click', () => {
    // popup.visible = !popup.visible;
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
