import IdsText from '../../src/components/ids-text/ids-text';

document.addEventListener('DOMContentLoaded', () => {
  // Switch the theme switcher button to "alternate" color variant
  const switcher = document.querySelector('ids-theme-switcher');
  switcher.colorVariant = 'alternate';
});
