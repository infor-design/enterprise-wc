// Supporting components
import '../ids-error-page';

document.addEventListener('DOMContentLoaded', () => {
  const errorPage: any = document.querySelector('ids-error-page');

  errorPage.popup.animated = false;

  errorPage.addEventListener('action-button', () => {
    errorPage.popup.animated = true;
    errorPage.visible = false;
  });
});
