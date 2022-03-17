import '../ids-tag';
// import '../../ids-container/ids-container'; //TODO: remove when we have a better way to import components

// Add an event listener to test clickable links
const tag = document.querySelector('#ids-clickable-tag');
tag?.addEventListener('click', (e) => {
  console.info('Click Fired', e);
});
