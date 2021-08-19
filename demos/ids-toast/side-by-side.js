/* global $ */
import IdsToast from '../../src/components/ids-toast';

// Initialize Web Component
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#btn-toast-wc')?.addEventListener('click', () => {
    const toastId = 'test-toast-wc';
    let toast = document.querySelector(`#${toastId}`);
    if (!toast) {
      toast = document.createElement('ids-toast');
      toast.setAttribute('id', toastId);
      document.body.appendChild(toast);
    }
    toast.show({
      title: 'Application Offline',
      message: 'This is a Toast message.(wc)'
    });
  });
});

// Initialize the 4.x
$('body').initialize();
$('#btn-toast-4x').on('click', () => {
  $('body').toast({
    title: 'Application Offline',
    message: 'This is a Toast message.(4.x)'
  });
});
