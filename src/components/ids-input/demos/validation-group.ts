import { IdsValidationRule } from '../../../mixins/ids-validation-mixin/ids-validation-mixin';
import '../../ids-time-picker/ids-time-picker';
import IdsInput from '../ids-input';
import '../ids-input-group';
import type { IdsGroupValidationRule } from '../ids-input-group';
import IdsInputGroup from '../ids-input-group';

// Custom Rule (uppercase)
const uppercaseRule: IdsValidationRule = {
  check: (input: IdsInput) => {
    const val = input.value;
    const capitalized = val.charAt(0).toUpperCase() + val.substring(1);
    return val === capitalized;
  },
  message: 'First letter of your name should be capitalized',
  type: 'error',
  id: 'my-custom-uppercase'
};

// Custom duplicate name rule
const duplicateNameRule: IdsGroupValidationRule = {
  check: (inputs: any[]) => {
    const commonNames = ['john smith', 'jane doe'];
    const getInputValue = (fieldName: string) => {
      const input = inputs.find((elem: any) => elem.getAttribute('name') === fieldName);
      return input.value;
    };
    const firstName = getInputValue('firstname').toLowerCase();
    const lastName = getInputValue('lastname').toLowerCase();

    return commonNames.indexOf(`${firstName} ${lastName}`) === -1;
  },
  message: 'Multiple employees share your name. Your company email address will be suffixed with a serial number. Ex john.smith7@infor.com'
};

const isOvertime: IdsGroupValidationRule = {
  check: (inputs: any[]) => {
    const startValue = Number(`${inputs[0].hours24}${inputs[0].minutes || '00'}`);
    const endValue = Number(`${inputs[1].hours24}${inputs[1].minutes || '00'}`);

    console.log(startValue, endValue, endValue - startValue);

    // overtime is greater than 8 hours
    return endValue - startValue <= 800;
  },
  message: 'Time selected range is overtime and will require manager approval'
};

document.addEventListener('DOMContentLoaded', () => {
  const nameInputGroup = document.querySelector<IdsInputGroup>('#validation-group-name');
  const firstname = document.querySelector<IdsInput>('ids-input[name="firstname"]');
  const middleinitial = document.querySelector<IdsInput>('ids-input[name="middleinitial"]');
  const lastname = document.querySelector<IdsInput>('ids-input[name="lastname"]');

  firstname?.addValidationRule(uppercaseRule);
  middleinitial?.addValidationRule(uppercaseRule);
  lastname?.addValidationRule(uppercaseRule);
  nameInputGroup?.addGroupValidationRule(duplicateNameRule);

  const timeInputGroup = document.querySelector<IdsInputGroup>('#validation-group-time');
  timeInputGroup?.addGroupValidationRule(isOvertime);
});
