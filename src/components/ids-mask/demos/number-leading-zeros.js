document.addEventListener('DOMContentLoaded', () => {
  // Number Input - use `number` string to pre-configure the internal Number Mask
  const numberInput = document.querySelector('#mask-number');
  numberInput.mask = 'number';
  numberInput.maskOptions = {
    allowDecimal: true,
    allowLeadingZeros: true,
    allowNegative: true,
    allowThousandsSeparator: true,
    decimalLimit: 2,
    integerLimit: 7
  };
});
