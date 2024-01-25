import { IdsValidationRule } from '../../../mixins/ids-validation-mixin/ids-validation-mixin';
import '../../ids-input/ids-input';
import '../../ids-time-picker/ids-time-picker';
import type IdsInput from '../../ids-input/ids-input';
import IdsInputGroup, { IdsGroupValidationRule } from '../ids-input-group';

const findInputByName = (formInputs: any[], name: string) => formInputs.find((input) => input.getAttribute('name') === name);

// Custom Rule (uppercase)
const isNameCapitalized: IdsValidationRule = {
  check: (input: IdsInput) => {
    const val = input.value;
    const capitalized = val.charAt(0).toUpperCase() + val.substring(1);
    return val === capitalized;
  },
  message: 'First letter of your name should be capitalized.',
  type: 'error',
  id: 'capitalized-name'
};

// Custom duplicate name rule
const noDuplicateNames: IdsGroupValidationRule = {
  check: (formInputs: any[]) => {
    const commonNames = ['john smith', 'jane doe'];
    const firstName = findInputByName(formInputs, 'firstname').value.toLowerCase();
    const lastName = findInputByName(formInputs, 'lastname').value.toLowerCase();

    return commonNames.indexOf(`${firstName} ${lastName}`) === -1;
  },
  message: 'Multiple employees share your name. Your company email address will be suffixed with a serial number.'
};

const isOvertime: IdsGroupValidationRule = {
  check: (formInputs: any[]) => {
    const startPicker = findInputByName(formInputs, 'starttime');
    const endPicker = findInputByName(formInputs, 'endtime');
    const startValue = Number(`${startPicker.hours24}${String(startPicker.minutes).padStart(2, '0')}`);
    const endValue = Number(`${endPicker.hours24}${String(endPicker.minutes).padStart(2, '0')}`);

    // overtime is greater than 8 hours
    return endValue - startValue <= 800;
  },
  message: 'Time selected range is overtime and will require manager approval.'
};

document.addEventListener('DOMContentLoaded', () => {
  const nameInputGroup = document.querySelector<IdsInputGroup>('#validation-group-name');
  const firstname = document.querySelector<IdsInput>('ids-input[name="firstname"]');
  const middleinitial = document.querySelector<IdsInput>('ids-input[name="middleinitial"]');
  const lastname = document.querySelector<IdsInput>('ids-input[name="lastname"]');

  firstname?.addValidationRule(isNameCapitalized);
  middleinitial?.addValidationRule(isNameCapitalized);
  lastname?.addValidationRule(isNameCapitalized);
  nameInputGroup?.setGroupValidationRule(noDuplicateNames);

  const timeInputGroup = document.querySelector<IdsInputGroup>('#validation-group-time');
  timeInputGroup?.setGroupValidationRule(isOvertime);
});
