document.querySelector('#search-field-1')?.addEventListener('focus', (e) => {
  console.info(`Focus Changed to ${e.target}`);
});

document.querySelector('#search-field-1')?.addEventListener('change', (e) => {
  console.info(`Change Event Fired on ${e.target}`);
});
