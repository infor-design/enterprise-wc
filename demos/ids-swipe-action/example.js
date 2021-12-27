import IdsCard from '../../src/components/ids-card/ids-card';
import IdsMenuButton from '../../src/components/ids-menu-button/ids-menu-button';

// Setup normal click events on the actions
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#action-left-reveal').addEventListener('click', () => {
    document.querySelector('#output').textContent = 'Left Action (Reveal Mode) was chosen';
  });
  document.querySelector('#action-right-reveal').addEventListener('click', () => {
    document.querySelector('#output').textContent = 'Right Action (Reveal Mode) was chosen';
  });
  document.querySelector('#action-right-reveal-one').addEventListener('click', () => {
    document.querySelector('#output').textContent = 'Right Action (Reveal / One Action Mode) was chosen';
  });
  document.querySelector('#action-left-continuous').addEventListener('click', () => {
    document.querySelector('#output').textContent = 'Left Action (Continuous Mode) was chosen';
  });
  document.querySelector('#action-right-continuous').addEventListener('click', () => {
    document.querySelector('#output').textContent = 'Right Action (Continuous Mode) was chosen';
  });
});
