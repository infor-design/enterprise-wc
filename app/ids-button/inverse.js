import IdsButton from '../../src/ids-button/ids-button';

document.addEventListener('DOMContentLoaded', () => {
  // Switch the theme switcher button to inverse
  const switcher = document.querySelector('ids-theme-switcher');
  switcher.inverse = true;
});
