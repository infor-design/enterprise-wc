import '../../ids-text/ids-text';
import '../ids-time-picker-popup';

import type IdsText from '../../ids-text/ids-text';
import type IdsTimePickerPopup from '../ids-time-picker-popup';

document.addEventListener('DOMContentLoaded', () => {
  const picker = document.querySelector<IdsTimePickerPopup>('ids-time-picker-popup')!;
  const outputEl = document.querySelector<IdsText>('#current-time')!;

  picker.onEvent('timeselected', picker, (e: CustomEvent) => {
    console.info(e.detail.value);
    outputEl.textContent = e.detail.value;
  });
});
