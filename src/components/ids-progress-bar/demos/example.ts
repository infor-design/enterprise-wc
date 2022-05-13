document.addEventListener('DOMContentLoaded', () => {
  const btnUpdateVal = document.querySelector('#btn-progress-value');
  const btnDisable = document.querySelector('#btn-progress-disable');
  const btnSetLabel = document.querySelector('#btn-progress-set-label');
  const elem: any = document.querySelector('#elem-progress') || {};
  const orgValue: any = elem.value;

  // Update and reset value
  btnUpdateVal?.addEventListener('click', (e: any) => {
    if (elem.disabled) {
      return;
    }
    e.target.toggle();
    const max = '100';
    elem.value = elem.value === max ? orgValue : max;
  });

  // Toggle disable/enable
  btnDisable?.addEventListener('click', (e: any) => {
    e.target.toggle();
    elem.disabled = !elem.disabled;
  });

  // Toggle label audible
  btnSetLabel?.addEventListener('click', (e: any) => {
    if (elem.disabled) {
      return;
    }
    e.target.toggle();
    elem.labelAudible = !elem.labelAudible;
  });
});
