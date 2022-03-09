import IdsCard from '../ids-card';

// Initialize the 4.x
$('body').initialize();
$('.btn-actions').on('selected', (e, args) => {
  console.info(e, args);
});
