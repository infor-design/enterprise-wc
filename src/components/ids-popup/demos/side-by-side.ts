// Supporting Components
import '../ids-popup';
import '../../ids-button/ids-button';

import css from '../../../assets/css/ids-popup/index.css';

const cssLink = `<link href="${css}" rel="stylesheet">`;
const head = document.querySelector('head');
if (head) {
  head.insertAdjacentHTML('afterbegin', cssLink);
}

document.addEventListener('DOMContentLoaded', () => {
  const triggerId = '#popup-trigger-btn';
  const triggerBtn = document.querySelector(triggerId);
  const popup: any = document.querySelector('ids-popup');
  popup.arrow = 'right';

  // Toggle the Popup
  triggerBtn?.addEventListener('click', () => {
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
  placement: 'right',
  popover: true,
  offset: {
    y: 10
  },
  trigger: 'click'
};

$('#popover-trigger').popover(POPOVER_OPTIONS);
