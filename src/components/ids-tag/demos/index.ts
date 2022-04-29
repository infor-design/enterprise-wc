// Add an event listener to test clickable links
import IdsTag from '../ids-tag';

const tag = document.querySelector('#ids-clickable-tag');
tag?.addEventListener('click', (e) => {
  console.info('Click Fired', e);
});
