// Supporting components
import IdsButton from '../../src/components/ids-button';

document.addEventListener('DOMContentLoaded', () => {
  const btnUpdateValue = document.querySelector('#btn-textarea-update-value');
  const btnResetValue = document.querySelector('#btn-textarea-reset-value');
  const textareaUpdateValue = document.querySelector('#textarea-update-value') || {};
  const orgVal = textareaUpdateValue?.value || '';
  const newVal = 'New value updated';

  // Update value
  btnUpdateValue?.addEventListener('click', () => {
    textareaUpdateValue.value = newVal;
  });

  // Reset value
  btnResetValue?.addEventListener('click', () => {
    textareaUpdateValue.value = orgVal;
  });

  const btnEnable = document.querySelector('#btn-textarea-enable');
  const btnDisable = document.querySelector('#btn-textarea-disable');
  const btnReadonly = document.querySelector('#btn-textarea-readonly');
  const textareaToggleState = document.querySelector('#textarea-toggle-state') || {};

  // Enable
  btnEnable?.addEventListener('click', () => {
    textareaToggleState.disabled = false;
    textareaToggleState.readonly = false;
  });

  // Disable
  btnDisable?.addEventListener('click', () => {
    textareaToggleState.disabled = true;
  });

  // Readonly
  btnReadonly?.addEventListener('click', () => {
    textareaToggleState.readonly = true;
  });
});
