// Supporting components
import '../ids-input';
import '../../ids-radio/ids-radio';

document.addEventListener('DOMContentLoaded', () => {
  // Custom Rule (uppercase)
  const myCustomRule1 = {
    check: (input: any) => {
      const val = input.value;
      return /^[A-Z]*$/.test(val);
    },
    message: 'Only uppercase letters allowed',
    type: 'error',
    id: 'my-custom-uppercase'
  };

  // Custom Rule (no-numbers)
  const myCustomRule2 = {
    check: (input: any) => {
      const val = input.value;
      return !(/[\d]+/.test(val));
    },
    message: 'No numbers allowed',
    type: 'error',
    id: 'no-numbers'
  };

  // Custom Rule (no-special-characters)
  const myCustomRule3 = {
    check: (input: any) => {
      const val = input.value;
      return !(/[!@#\\$%\\^\\&*\\)\\(+=._-]+/.test(val));
    },
    message: 'No special characters allowed',
    type: 'error',
    id: 'no-special-characters'
  };

  // Get elements
  const input1: any = document.querySelector('#input-custom-validation-1');
  const input2: any = document.querySelector('#input-custom-validation-2');
  const radio1: any = document.querySelector('#radio-custom-validation-1');
  const radio2: any = document.querySelector('#radio-custom-validation-2');

  // Add/Remove single validation rule (with input 1)
  const setRulesWithInput1 = () => {
    if (radio1.value === 'add') {
      input1?.addValidationRule(myCustomRule1);

      // check if need current input value is valid or not
      input1?.checkValidation();
    } else {
      const id = myCustomRule1.id;
      input1?.removeValidationRule(id);
    }
  };

  // Add/Remove multiple validation rules (with input 2)
  const setRulesWithInput2 = () => {
    if (radio2.value === 'add') {
      input2?.addValidationRule([myCustomRule2, myCustomRule3]);

      // check if need current input value is valid or not
      input2?.checkValidation();
    } else {
      const ids = [myCustomRule2.id, myCustomRule3.id];
      input2?.removeValidationRule(ids);
    }
  };

  // Bind radios
  radio1?.addEventListener('change', setRulesWithInput1);
  radio2?.addEventListener('change', setRulesWithInput2);

  // Initialize
  setRulesWithInput1();
  setRulesWithInput2();
});
