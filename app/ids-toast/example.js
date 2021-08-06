// IdsToast Example

document.addEventListener('DOMContentLoaded', () => {
  const idsContainer = document.querySelector('ids-container');
  const btnToastDemo = document.querySelector('#btn-toast-demo');

  // Show toast message
  btnToastDemo?.addEventListener('click', () => {
    const toastId = 'test-demo-toast';
    let toast = document.querySelector(`#${toastId}`);
    if (!toast) {
      toast = document.createElement('ids-toast');
      toast.setAttribute('id', toastId);
      idsContainer?.appendChild(toast);
    }
    toast.show({
      title: 'Application Offline',
      message: 'This is a Toast message.'
    });
  });
});
