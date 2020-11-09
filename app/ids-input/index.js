import IdsInput from '../../src/ids-input/ids-input';

// Supporting components
import IdsButton from '../../src/ids-button/ids-button';
import IdsIcon from '../../src/ids-icon/ids-icon';
import IdsText from '../../src/ids-text/ids-text';
import IdsLayoutGrid from '../../src/ids-layout-grid/ids-layout-grid';

document.addEventListener('DOMContentLoaded', () => {
  const btnEnable = document.querySelector('#btn-input-enable');
  const btnDisable = document.querySelector('#btn-input-disable');
  const btnReadonly = document.querySelector('#btn-input-readonly');
  const inputToggleState = document.querySelector('#input-toggle-state') || {};

  // Enable
  btnEnable?.addEventListener('click', () => {
    inputToggleState.disabled = false;
    inputToggleState.readonly = false;
  });

  // Disable
  btnDisable?.addEventListener('click', () => {
    inputToggleState.disabled = true;
  });

  // Readonly
  btnReadonly?.addEventListener('click', () => {
    inputToggleState.readonly = true;
  });
});
