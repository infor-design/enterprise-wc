// Supporting components
import IdsToggleButton from '../../src/components/ids-toggle-button';

document.addEventListener('DOMContentLoaded', () => {
  const btnUpdateVal = document.querySelector('#btn-progress-value');
  const btnDisable = document.querySelector('#btn-progress-disable');
  const btnSetLabel = document.querySelector('#btn-progress-set-label');
  const elem = document.querySelector('#elem-progress') || {};
  const orgValue = elem.value;

  // Update and reset value
  btnUpdateVal?.addEventListener('click', (e) => {
    if (elem.disabled) {
      return;
    }
    e.target.toggle();
    const max = '100';
    elem.value = elem.value === max ? orgValue : max;
  });

  // Toggle disable/enable
  btnDisable?.addEventListener('click', (e) => {
    e.target.toggle();
    elem.disabled = !elem.disabled;
  });

  // Toggle label audible
  btnSetLabel?.addEventListener('click', (e) => {
    if (elem.disabled) {
      return;
    }
    e.target.toggle();
    elem.labelAudible = !elem.labelAudible;
  });
});
