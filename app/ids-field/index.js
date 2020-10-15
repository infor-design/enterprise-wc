import IdsField from '../../src/ids-field/ids-field';

document.addEventListener('DOMContentLoaded', () => {
  const btnEnable = document.querySelector('#btn-enable');
  const btnDisable = document.querySelector('#btn-disable');
  const btnReadonly = document.querySelector('#btn-readonly');
  const textField = document.querySelector('#test-enable-disable-readonly');

  /**
   * @param {object} el The element
   * @param {string} state to set
   */
  function setState(el, state) {
    el?.setAttribute('field-state', state);
  }

  // Enable
  btnEnable.addEventListener('click', () => {
    setState(textField, 'enabled');
  });

  // Disable
  btnDisable.addEventListener('click', () => {
    setState(textField, 'disabled');
  });

  // Readonly
  btnReadonly.addEventListener('click', () => {
    setState(textField, 'readonly');
  });
});
