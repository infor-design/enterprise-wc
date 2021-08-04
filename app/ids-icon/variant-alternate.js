import IdsIcon from '../../src/ids-icon/ids-icon';

document.addEventListener('DOMContentLoaded', () => {
  // Switch the theme switcher button to alternate
  const switcher = document.querySelector('ids-theme-switcher');
  switcher.colorVariant = 'alternate';
});
