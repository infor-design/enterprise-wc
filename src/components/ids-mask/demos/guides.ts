document.addEventListener('DOMContentLoaded', () => {
  const mask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  // Phone Number Input with guides
  const guides: any = document.querySelector('#mask-phone-number-guides');
  guides.maskGuide = true;
  guides.mask = mask;

  // Phone Number Input retaining original character positions when field contents are removed.
  const positions: any = document.querySelector('#mask-phone-number-positions');
  positions.maskRetainPositions = true;
  positions.mask = mask;

  // Phone Number Input that combines both settings.
  const both: any = document.querySelector('#mask-phone-number-both');
  both.maskGuide = true;
  both.maskRetainPositions = true;
  both.mask = mask;
});
