document.addEventListener('DOMContentLoaded', () => {
  // Phone Number Input - standard pattern mask
  const phoneInput = document.querySelector('#mask-phone-number');
  phoneInput.mask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  // Date Input - use `date` string to pre-configure the internal Date Mask
  const dateInput = document.querySelector('#mask-date');
  dateInput.mask = 'date';
  dateInput.maskOptions = {
    format: 'M/d/yyyy HH:mm a'
  };

  // Number Input - use `number` string to pre-configure the internal Number Mask
  const numberInput = document.querySelector('#mask-number');
  numberInput.mask = 'number';
  numberInput.maskOptions = {
    allowDecimal: true,
    allowNegative: true,
    allowThousandsSeparator: true,
    decimalLimit: 2,
    integerLimit: 7
  };
});
