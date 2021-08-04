import IdsButton from '../../src/ids-button/ids-button';

document.addEventListener('DOMContentLoaded', () => {
  // Switch the theme switcher button to alternate
  const switcher = document.querySelector('ids-theme-switcher');
  switcher.colorVariant = 'alternate';
});
