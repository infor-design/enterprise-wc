import IdsLoader from '../../src/ids-loader/ids-loader';

//Initialize the 4.x
$('body').initialize();
$(function() {
  $('#submit').click(function(e) {
    $('#busy-form').trigger('start.busyindicator');
  });
});