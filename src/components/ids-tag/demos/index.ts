import '../ids-tag';

// Add an event listener to test clickable links
const tag = document.querySelector('#ids-clickable-tag');
tag?.addEventListener('click', (e) => {
  console.info('Click Fired', e);
});
