// IdsToast Sandbox
import './index';
import '../../src/components/ids-checkbox/ids-checkbox';
import '../../src/components/ids-radio/ids-radio';

document.addEventListener('DOMContentLoaded', () => {
  const idsContainer = document.querySelector('ids-container');

  /*
   * Variant Toast
   * show toast message with variant settings
   */
  const isChecked = (sel) => document.querySelector(sel)?.checked === 'true';
  const btnToastVariant = document.querySelector('#btn-toast-variant');

  btnToastVariant?.addEventListener('click', () => {
    const draggable = isChecked('#cb-toast-draggable');
    const destroyOnComplete = isChecked('#cb-toast-destroy-on-complete');
    const position = document.querySelector('#radio-toast-position').value;

    const allowLink = isChecked('#cb-toast-allow-link');
    const audible = isChecked('#cb-toast-audible');
    const closeButtonLabel = isChecked('#cb-toast-close-button-label') ? 'Click here to close' : null;
    const progressBar = isChecked('#cb-toast-progress-bar');
    const timeout = isChecked('#cb-toast-timeout') ? 2000 : null;

    const title = 'Application Offline';
    const message = !allowLink
      ? 'This is a Toast message.'
      : 'Link in message: <ids-hyperlink href="http://www.example.com" target="_blank">Google</ids-hyperlink>';

    const toastId = 'test-toast-variant';
    let toast = document.querySelector(`#${toastId}`);
    if (!toast) {
      toast = document.createElement('ids-toast');
      toast.setAttribute('id', toastId);
      idsContainer?.appendChild(toast);
    }

    toast.draggable = draggable;
    toast.destroyOnComplete = destroyOnComplete;
    toast.position = position;

    toast.show({
      title,
      message,
      allowLink,
      audible,
      closeButtonLabel,
      progressBar,
      timeout
    });
  });

  /*
   * Save position
   * apply only when draggable set to true
   *
   * uniqueId: Use to clear the saved position from storage
   * if not will use internal auto generated id
   */
  const uniqueId1 = 'some-uniqueid-1';
  const uniqueId2 = 'some-uniqueid-2';

  const setClearButtons = (sel, toast) => {
    const buttons = {
      clearAll: document.querySelector('#btn-toast-clear-position-all'),
      btnClear1: document.querySelector('#btn-toast-clear-position-1'),
      btnClear2: document.querySelector('#btn-toast-clear-position-2'),
    };
    if (buttons.btnClear1 && buttons.btnClear2 && buttons.clearAll && toast) {
      const btn = buttons[`btnClear${sel}`];
      const btnAlt = buttons[`btnClear${sel !== 1 ? 1 : 2}`];
      buttons.clearAll.disabled = true;
      btn.disabled = true;
      toast.addEventListener('remove-container', () => {
        btn.disabled = false;
        if (!btnAlt.disabled) {
          buttons.clearAll.disabled = false;
        }
      });
    }
  };
  const handleSavePosition = (sel) => {
    const toastId = `test-toast-save-position-${sel}`;
    let toast = document.querySelector(`#${toastId}`);
    if (!toast) {
      toast = document.createElement('ids-toast');
      toast.setAttribute('id', toastId);
      toast.uniqueId = sel === 1 ? uniqueId1 : uniqueId2;
      toast.savePosition = true;
      toast.draggable = true;
      idsContainer?.appendChild(toast);
    }
    toast.show({
      title: `Application Offline (${sel})`,
      message: 'This is a Toast message.'
    });

    // Set clear buttons disable/enable, so it not in action while toast active
    setClearButtons(sel, toast);
  };
  const btnSavePosition1 = document.querySelector('#btn-toast-save-position-1');
  const btnSavePosition2 = document.querySelector('#btn-toast-save-position-2');
  btnSavePosition1?.addEventListener('click', () => {
    handleSavePosition(1);
  });
  btnSavePosition2?.addEventListener('click', () => {
    handleSavePosition(2);
  });

  /*
   * Clear position
   * uniqueId: Used with toast while saveing the position to storage
   */
  const btnClear1 = document.querySelector('#btn-toast-clear-position-1');
  const btnClear2 = document.querySelector('#btn-toast-clear-position-2');
  const btnClearAll = document.querySelector('#btn-toast-clear-position-all');
  btnClear1?.addEventListener('click', () => {
    const toast = document.createElement('ids-toast');
    toast.clearPosition(uniqueId1);
  });
  btnClear2?.addEventListener('click', () => {
    const toast = document.createElement('ids-toast');
    toast.clearPosition(uniqueId2);
  });
  btnClearAll?.addEventListener('click', () => {
    const toast = document.createElement('ids-toast');
    toast.clearPositionAll();
  });

  /*
   * Toast message by markup
   */
  const btnMarkup = document.querySelector('#btn-toast-markup');
  const toastMarkup = document.querySelector('#toast-markup');
  btnMarkup?.addEventListener('click', () => {
    toastMarkup.show();
  });
});
