import IdsButton from '../../src/components/ids-button';

document.addEventListener('DOMContentLoaded', () => {
  // Switch the theme switcher button to alternate
  const switcher = document.querySelector('ids-theme-switcher');
  switcher.colorVariant = 'alternate';
});
