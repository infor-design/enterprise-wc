import IdsInput from '../../src/components/ids-input/ids-input';

document.addEventListener('DOMContentLoaded', () => {
  const mask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  // Phone Number Input with guides
  const guides = document.querySelector('#mask-phone-number-guides');
  guides.maskGuide = true;
  guides.mask = mask;

  // Phone Number Input retaining original character positions when field contents are removed.
  const positions = document.querySelector('#mask-phone-number-positions');
  positions.maskRetainPositions = true;
  positions.mask = mask;

  // Phone Number Input that combines both settings.
  const both = document.querySelector('#mask-phone-number-both');
  both.maskGuide = true;
  both.maskRetainPositions = true;
  both.mask = mask;
});
