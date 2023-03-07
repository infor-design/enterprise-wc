import '../ids-button';
import '../../ids-loading-indicator/ids-loading-indicator';

const button: any = document.querySelector('ids-button');

button?.addEventListener('click', () => {
  button.showLoadingIndicator = !button.showLoadingIndicator;
});
