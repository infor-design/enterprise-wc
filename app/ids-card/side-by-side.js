import IdsCard from '../../src/ids-card/ids-card';

//Initialize the 4.x
$('body').initialize();
$('.btn-actions').on('selected', function (e, args) {
  console.log(e, args);
});