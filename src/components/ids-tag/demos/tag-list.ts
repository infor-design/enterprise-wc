import '../ids-tag-list';

// Add an event listener to test clickable links
const tagList = document.querySelector('ids-tag-list');

tagList?.addEventListener('beforetagremove', (e) => {
  console.info('beforetagremove fired', e);
});
tagList?.addEventListener('aftertagremove', (e) => {
  console.info('aftertagremove fired', e);
});
