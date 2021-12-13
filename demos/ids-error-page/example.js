document.addEventListener('DOMContentLoaded', () => {
  const errorPage = document.querySelector('ids-error-page');

  errorPage.addEventListener('action-button', () => {
    console.log('action button clicked');
  });
});
