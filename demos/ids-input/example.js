// Supporting components
import IdsButton from '../../src/components/ids-button/ids-button';

document.addEventListener('DOMContentLoaded', () => {
  const btnEnable = document.querySelector('#btn-input-enable');
  const btnDisable = document.querySelector('#btn-input-disable');
  const btnReadonly = document.querySelector('#btn-input-readonly');
  const btnRevealable = document.querySelector('#revealable-btn');
  const passwordBtn = document.querySelector('#password-test');
  const input = document.querySelector('#input-toggle-state') || {};

  // Enable
  btnEnable?.addEventListener('click', () => {
    input.disabled = false;
    input.readonly = false;
  });

  // Disable
  btnDisable?.addEventListener('click', () => {
    input.disabled = true;
  });

  // Readonly
  btnReadonly?.addEventListener('click', () => {
    input.readonly = true;
  });

  btnRevealable?.addEventListener('click', () => {
    passwordBtn.revealablePassword = !passwordBtn.revealablePassword;
  });
});
