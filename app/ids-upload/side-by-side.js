import IdsText from '../../src/ids-upload/ids-upload';

//Initialize the 4.x
$('body').initialize();
$('#fileupload').fileupload({
  attributes: [
    {
      name: 'id',
      value: 'fileupload'
    },
    {
      name: 'data-automation-id',
      value: 'fileupload-automation-id'
    }
  ]
});

$('#fileupload-readonly').fileupload({
  attributes: [
    {
      name: 'id',
      value: 'fileupload-readonly'
    },
    {
      name: 'data-automation-id',
      value: 'fileupload-readonly-automation-id'
    }
  ]
});

$('#fileupload-disabled').fileupload({
  attributes: [
    {
      name: 'id',
      value: 'fileupload-disabled'
    },
    {
      name: 'data-automation-id',
      value: 'fileupload-disabled-automation-id'
    }
  ]
});
