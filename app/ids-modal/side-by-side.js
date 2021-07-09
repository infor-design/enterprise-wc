import IdsModal from '../../src/ids-modal/ids-modal';

// Supporting Components
import IdsButton from '../../src/ids-button/ids-button';

document.addEventListener('DOMContentLoaded', () => {
  const triggerId = '#modal-trigger-btn';
  const triggerBtn = document.querySelector(triggerId);
  const modal = document.querySelector('ids-modal');
  const modalCloseBtn = modal.querySelector('ids-button');

  // Links the Modal to its trigger button (sets up click/focus events)
  modal.target = triggerBtn;

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

//Initialize the 4.x
$('body').initialize();
var modals = {
  'add-context': {
    'title': 'Add Context',
    'id': 'my-id',
    'content': $('#modal-add-context')
  }
},

setModal = function (opt) {
  opt = $.extend({
    buttons: [{
      text: 'Cancel',
    //  id: 'modal-button-1',
      click: function(e, modal) {
        modal.close();
      }
    }, {
      text: 'Save',
    //  id: 'modal-button-2',
      click: function(e, modal) {
        modal.close();
      },
      validate: false,
      isDefault: true
    }]
  }, opt);

  $('body').modal(opt);
};

$('#add-context').on('click', function () {
  $(this).focus();
  setModal(modals[this.id]);
});