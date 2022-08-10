document.addEventListener('DOMContentLoaded', () => {
  // Phone Number Input - standard pattern mask
  const phoneInput: any = document.querySelector('#mask-phone-number');
  if (!phoneInput) return;
  phoneInput.mask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  // Date Input - use `date` string to pre-configure the internal Date Mask
  const dateInput: any = document.querySelector('#mask-date');
  dateInput.mask = 'date';
  dateInput.maskOptions = {
    format: 'M/d/yyyy hh:mm a'
  };

  // Number Input - use `number` string to pre-configure the internal Number Mask
  const numberInput: any = document.querySelector('#mask-number');
  numberInput.mask = 'number';
  numberInput.maskOptions = {
    allowDecimal: true,
    allowNegative: true,
    allowThousandsSeparator: true,
    decimalLimit: 2,
    integerLimit: 7
  };
});
