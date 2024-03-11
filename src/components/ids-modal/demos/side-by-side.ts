// Supporting Components
import '../ids-modal';
import '../ids-modal-button';
import '../../ids-button/ids-button';

document.addEventListener('DOMContentLoaded', () => {
  const triggerId = '#modal-trigger-btn';
  const triggerBtn: any = document.querySelector(triggerId);
  const modal: any = document.querySelector('ids-modal');
  const modalCloseBtn = modal.querySelector('ids-modal-button');

  // Links the Modal to its trigger button (sets up click/focus events)
  modal.target = triggerBtn;
  modal.triggerType = 'click';

  // Disable the trigger button when showing the Modal.
  modal.addEventListener('beforeshow', () => {
    triggerBtn.disabled = true;
    return true;
  });

  // Close the modal when its inner button is clicked.
  modalCloseBtn.addEventListener('click', () => {
    modal.hide();
  });

  // After the modal is done hiding, re-enable its trigger button.
  modal.addEventListener('hide', () => {
    triggerBtn.disabled = false;
  });
});

// Initialize the 4.x
$('body').initialize();
const modals: any = {
  'add-context': {
    title: 'Add Context',
    id: 'my-id',
    content: $('#modal-add-context')
  }
};

const setModal = function modalContent(opt: any) {
  /* eslint-disable no-param-reassign */
  opt = $.extend({
    buttons: [{
      text: 'Cancel',
      //  id: 'modal-button-1',
      click(e: Event, modal: any) {
        modal.close();
      }
    }, {
      text: 'Save',
      //  id: 'modal-button-2',
      click(e: Event, modal: any) {
        modal.close();
      },
      validate: false,
      isDefault: true
    }]
  }, opt);
  /* eslint-disable no-param-reassign */

  $('body').modal(opt);
};

$('#add-context').on('click', function addContext(this: any) {
  $(this).focus();
  setModal(modals[this.id]);
});
