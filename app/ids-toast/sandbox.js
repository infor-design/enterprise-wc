// IdsToast Sandbox
import './index';
import '../../src/ids-radio/ids-radio';

document.addEventListener('DOMContentLoaded', () => {
  const idsContainer = document.querySelector('ids-container');

  // Position
  // 'bottom-end', 'bottom-start', 'top-end', 'top-start' (default: 'top-end')
  const radioPosition = document.querySelector('#radio-toast-position');
  const btnPosition = document.querySelector('#btn-toast-position');
  btnPosition?.addEventListener('click', () => {
    const position = radioPosition.value;
    const toastId = 'test-toast-position';
    let toast = document.querySelector(`#${toastId}`);
    if (!toast) {
      toast = document.createElement('ids-toast');
      toast.setAttribute('id', toastId);
      toast.position = position;
      idsContainer?.appendChild(toast);
    }
    toast.show({
      title: 'Application Offline',
      message: 'This is a Toast message.'
    });
  });

  // Draggable
  const btnDraggable = document.querySelector('#btn-toast-draggable');
  btnDraggable?.addEventListener('click', () => {
    const toastId = 'test-toast-draggable';
    let toast = document.querySelector(`#${toastId}`);
    if (!toast) {
      toast = document.createElement('ids-toast');
      toast.setAttribute('id', toastId);
      toast.draggable = true;
      idsContainer?.appendChild(toast);
    }
    toast.show({
      title: 'Application Offline',
      message: 'This is a Toast message.'
    });
  });

  // Save position
  // apply only when draggable set to true
  const btnSavePosition = document.querySelector('#btn-toast-save-position');
  btnSavePosition?.addEventListener('click', () => {
    const toastId = 'test-toast-save-position';
    /*
     * uniqueId: Use to clear the saved position from storage
     * if not will use internal auto generated id
     */
    const uniqueId = 'some-uniqueid';
    let toast = document.querySelector(`#${toastId}`);
    if (!toast) {
      toast = document.createElement('ids-toast');
      toast.setAttribute('id', toastId);
      toast.localStorage = {};
      toast.uniqueId = uniqueId;
      toast.savePosition = true;
      toast.draggable = true;
      idsContainer?.appendChild(toast);
    }
    toast.show({
      title: 'Application Offline',
      message: 'This is a Toast message.'
    });
  });

  // Clear saved position from local storage
  const btnClearSavedPosition = document.querySelector('#btn-toast-clear-saved-position');
  btnClearSavedPosition?.addEventListener('click', () => {
    /*
     * uniqueId: Used with toast while saveing the position to storage
     */
    const uniqueId = 'some-uniqueid';
    const toast = document.createElement('ids-toast');
    toast.clearPosition(uniqueId);
  });

  // Clear (all) saved position toast related from local storage
  const btnClearAllSavedPosition = document.querySelector('#btn-toast-clear-all-saved-position');
  btnClearAllSavedPosition?.addEventListener('click', () => {
    const toast = document.createElement('ids-toast');
    toast.clearPositionAll();
  });

  // Destroy from dom, after all messages complete with this toast id
  const btnDestroyOnComplete = document.querySelector('#btn-toast-destroy-on-complete');
  btnDestroyOnComplete?.addEventListener('click', () => {
    const toastId = 'test-toast-destroy-on-complete';
    let toast = document.querySelector(`#${toastId}`);
    if (!toast) {
      toast = document.createElement('ids-toast');
      toast.setAttribute('id', toastId);
      toast.destroyOnComplete = false;
      idsContainer?.appendChild(toast);
    }
    toast.show({
      title: 'Application Offline',
      message: 'This is a Toast message.'
    });
  });

  // Allow link
  const btnAllowLink = document.querySelector('#btn-toast-allow-link');
  btnAllowLink?.addEventListener('click', () => {
    const toastId = 'test-toast-allow-link';
    let toast = document.querySelector(`#${toastId}`);
    if (!toast) {
      toast = document.createElement('ids-toast');
      toast.setAttribute('id', toastId);
      idsContainer?.appendChild(toast);
    }
    toast.show({
      title: 'Application Offline',
      message: 'Link in message: <ids-hyperlink href="http://www.example.com" target="_blank">Google</ids-hyperlink>',
      allowLink: true
    });
  });

  // Timeout
  const btnTimeout = document.querySelector('#btn-toast-timeout');
  btnTimeout?.addEventListener('click', () => {
    const toastId = 'test-toast-timeout';
    let toast = document.querySelector(`#${toastId}`);
    if (!toast) {
      toast = document.createElement('ids-toast');
      toast.setAttribute('id', toastId);
      idsContainer?.appendChild(toast);
    }
    toast.show({
      title: 'Application Offline',
      message: 'This is a Toast message.',
      timeout: 2000
    });
  });

  // Close button custom label text
  const btnCloseButtonLabel = document.querySelector('#btn-toast-close-button-label');
  btnCloseButtonLabel?.addEventListener('click', () => {
    const toastId = 'test-toast-close-button-label';
    let toast = document.querySelector(`#${toastId}`);
    if (!toast) {
      toast = document.createElement('ids-toast');
      toast.setAttribute('id', toastId);
      idsContainer?.appendChild(toast);
    }
    toast.show({
      title: 'Application Offline',
      message: 'This is a Toast message.',
      closeButtonLabel: 'Click here to close'
    });
  });

  // Progress bar (hidden)
  const btnProgressBar = document.querySelector('#btn-toast-progress-bar');
  btnProgressBar?.addEventListener('click', () => {
    const toastId = 'test-toast-progress-bar';
    let toast = document.querySelector(`#${toastId}`);
    if (!toast) {
      toast = document.createElement('ids-toast');
      toast.setAttribute('id', toastId);
      idsContainer?.appendChild(toast);
    }
    toast.show({
      title: 'Application Offline',
      message: 'This is a Toast message.',
      progressBar: false
    });
  });

  // Audible only
  const btnAudible = document.querySelector('#btn-toast-audible');
  btnAudible?.addEventListener('click', () => {
    const toastId = 'test-toast-audible';
    let toast = document.querySelector(`#${toastId}`);
    if (!toast) {
      toast = document.createElement('ids-toast');
      toast.setAttribute('id', toastId);
      idsContainer?.appendChild(toast);
    }
    toast.show({
      title: 'Application Offline',
      message: 'This is a Toast message.',
      audible: true
    });
  });

  // Toast message by markup
  const btnMarkup = document.querySelector('#btn-toast-markup');
  const toastMarkup = document.querySelector('#toast-markup');
  btnMarkup?.addEventListener('click', () => {
    toastMarkup.show();
  });
});
